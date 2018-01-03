const robot = require("robotjs");
const config = require('../config');

// Helper func to ensure we always create a step object the same way
const stepDesc = (stepName, arg, action) => ({
  stepName: stepName,
  arg: arg,
  action: action
});

// These are all technically actions. They all return a
module.exports.Repeat = function (action) {
  return new Repeat(action);
};
module.exports.AnyOf = function (...actions) {
  return new AnyOf(actions);
};
module.exports.Action = function (x, y, hex) {
  return new Action(x, y, hex);
};
module.exports.Condition = function (x, y, hex) {
  return new Condition(x, y, hex);
};
module.exports.ActionSeries = function (...actions) {
  return new ActionSeries(actions);
};
module.exports.BlockingAction = function (x, y, hex) {
  return new BlockingAction(x, y, hex);
};

class Tickable {
  tick() {
    throw new Error('Not implemented');
  }

  reset() {
  }
}


class Raisable extends Tickable {
  raise(eventName) {
    this._eventName = eventName;
  }

  emit(arg, eventBus) {
    if (this._eventName) {
      eventBus.emit(this.eventName.replace('%s', arg));
    }
  }

  get eventName() {
    return this._eventName;
  }
}

class Blockable extends Raisable {
  constructor() {
    super();
    this._shouldProgress = false;
  }

  get shouldProgress() {
    return this._shouldProgress;
  }

  set shouldProgress(value) {
    this._shouldProgress = value;
  }
}


class ActionSeries extends Blockable {
  constructor(actions) {
    super();
    this.actions = actions;
    this.index = 0;
  }

  tick(offsets, arg, eventBus) {
    const action = this.actions[this.index];
    action.tick(offsets, arg, eventBus);

    if (action instanceof Blockable) {
      if (action.shouldProgress) {
        this.index++;
      }
    } else {
      this.index++;
    }

    if (this.index >= this.actions.length) {
      this.shouldProgress = true;
    }
  }

  reset() {
    this.actions.forEach(x => x.reset());
    this.index = 0;
  }

}

class AnyOf extends Tickable {
  constructor(actions) {
    super();
    this.actions = actions;
  }

  tick(offsets, arg, eventBus) {
    this.actions.forEach(action => {
      if (action.tick(offsets, arg, eventBus)) {
        return true;
      }
    });
    return false;
  }
}

class Repeat extends Blockable {
  constructor(actions) {
    super();
    this.actions = actions;
    this.index = 0;
  }

  until(condition) {
    this.condition = condition;
  }

  reset() {
    this.index = 0;
    this.actions.forEach(x => x.reset());
  }

  tick(offsets, arg, eventBus) {
    const action = this.actions[this.index];
    if (action instanceof Blockable) {
      action.tick(offsets, arg, eventBus);
      if (action.shouldProgress) {
        this.index++;
      }
    } else {
      action.tick(offsets, arg, eventBus);
      this.index++;
    }

    if (this.index >= this.actions.length) {
      this.index = 0;
    }

    if (this.condition.true(offsets, arg, eventBus)) {
      this.shouldProgress = true;
      return true;
    }
    return false;
  }
}

class Condition extends Tickable {
  constructor(x, y, hex) {
    super();
    this.x = x;
    this.y = y;
    this.hex = hex;
  }

  raise(eventName) {
    this.eventName = eventName;
    return this;
  }

  true(offset, arg, eventBus) {
    const x = config.offsets.x + this.x;
    const y = config.offsets.y + this.y;
    const hex = robot.getPixelColor(x, y);

    if (hex === this.hex) {
      this.emit(arg, eventBus);
      return true;
    }
    return false;
  }

  tick(offset, arg, eventBus) {
    return this.true(offset, arg, eventBus);
  }
}

class BlockingAction extends Blockable {
  constructor(x, y, hex) {
    super(x, y, hex);
  }

  tick(offset, arg, eventBus) {
    const translatedX = offset.translateX(this.x);
    const translatedY = offset.translateY(this.y);
    const hex = robot.getPixelColor(translatedX, translatedY);
    if (hex === this.hex || this.hex == null) {
      robot.moveMouse(translatedX, translatedY);
      robot.mouseClick();
      this.emit(arg, eventBus);
      this.shouldProgress = true;
      return true;
    }
    this.shouldProgress = false;
    return false;
  }
}

class Action extends Raisable {
  constructor(x, y, hex) {
    super();
    this.x = x;
    this.y = y;
    this.hex = hex;
  }

  tick(offset, arg, eventBus) {
    const translatedX = offset.translateX(this.x);
    const translatedY = offset.translateY(this.y);
    const hex = robot.getPixelColor(translatedX, translatedY);
    if (hex === this.hex || this.hex == null) {
      robot.moveMouse(translatedX, translatedY);
      robot.mouseClick();
      this.emit(arg, eventBus);
    }
    return true;
  }
}


class EventBus {
  constructor(stepChangeCb) {
    this.eventToStep = {};
    this.stepChangeCb = stepChangeCb;
  }

  add(event, stepName, arg) {
    if (this.eventToStep[event]) {
      throw new Error(`Duplicate event handler: ${event}`);
    }
    this.eventToStep[event] = stepDesc(stepName, arg);
  }

  emit(event) {
    if (this.eventToStep[event]) {
      this.stepChangeCb(this.eventToStep[event]);
    }
  }
}

module.exports.Bot = class Bot {
  constructor(config) {
    if (!config.offsets || !config.interval) {
      throw new Error('Requires offsets and interval');
    }
    this.offsets = config.offsets;
    this.interval = config.interval;

    this.currentStep = null;
    this.steps = {};
    this.args = {};
    this.eventBus = new EventBus((stepName) => {
      if (this.steps[stepName]) {
        this.currentStep = stepDesc(stepName, this.args[stepName], this.steps[stepName]);
        this.currentStep.action.reset();
      }
    });
  }

  step(name, action) {
    if (this.steps[name]) {
      throw new Error(`Duplicate step: ${name}`);
    }
    this.steps[name] = action;
    return this;
  }

  on(event, stepName, arg = null) {
    this.args[stepName] = arg;
    this.eventBus.add(event, stepName, arg);
    return this;
  }

  onFailure(stepName, arg) {
    this.errorHandler = stepDesc(stepName, arg);
    return this;
  }

  start(stepName, arg) {
    this.currentStep = stepDesc(stepName, arg);
    setInterval(this._tick.bind(this), this.interval);
  }

  _tick() {
    console.log(JSON.stringify(this.steps));
    if (!this.steps[this.currentStep.stepName]) {
      throw new Error(`Invalid step: ${this.currentStep.stepName}`);
    }

    console.clear();
    console.log(`Running step ${this.currentStep.stepName}`);
    this.steps[this.currentStep.stepName].tick(this.offsets, this.currentStep.stepName.arg, this.eventBus);
  }
}
