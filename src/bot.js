const robot = require("robotjs");
const config = require('../config');

// Helper func to ensure we always create a step object the same way
const stepDesc = (stepName, arg) => ({
  stepName: stepName,
  arg: arg
});

// These are all technically actions. They all return a
module.exports.Repeat = function (...action) {
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
  constructor() {
  }

  tick() {
    throw new Error('Not implemented');
  }

  reset() {
  }

  emit(eventName, bot) {
    bot.eventBus.emit(eventName.replace('%s', bot.currentStep.arg));
  }

  debug(callback) {
    this.debugCallback = callback;
    return this;
  }

  _runDebugCallback(obj) {
    if (this.debugCallback) {
      this.debugCallback(obj);
    }
  }
}

class Blockable extends Tickable {
  constructor(x, y, hex) {
    super();
    this.x = x;
    this.y = y;
    this.hex = hex;
  }
}


class ActionSeries extends Blockable {
  constructor(actions) {
    super();
    this.actions = actions;
    this.index = 0;
  }

  tick(bot) {
    this._runDebugCallback(this);
    const action = this.actions[this.index];
    const result = action.tick(bot);

    if (action instanceof Blockable) {
      if (result) {
        this.index++;
      }
    } else {
      this.index++;
    }

    if (this.index >= this.actions.length) {
      return true;
    }
    return false;
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

  tick(bot) {
    this._runDebugCallback(this);
    this.actions.forEach(action => {
      if (action.tick(bot)) {
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

    actions.forEach(x => {
      if (x.hex === null) {
        throw new Error(' hex checks not allowed within a repeat block');
      }
    })
  }

  until(condition) {
    this.condition = condition;
    return this;
  }

  reset() {
    this.index = 0;
    this.actions.forEach(x => x.reset());
  }

  tick(bot) {
    this._runDebugCallback(this);
    const action = this.actions[this.index];
    const result = action.tick(bot);

    if (action instanceof Blockable) {
      if (result) {
        this.index++;
      }
    } else {
      this.index++;
    }

    if (this.index >= this.actions.length) {
      this.index = 0;
    }

    if (this.condition.tick(bot)) {
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

  true(eventName) {
    this.trueEventName = eventName;
    return this;
  }

  false(eventName) {
    this.falseEventName = eventName;
    return this;
  }

  tick(bot) {
    this._runDebugCallback(this);
    const x = config.offsets.x + this.x;
    const y = config.offsets.y + this.y;
    const hex = robot.getPixelColor(x, y);

    if (hex === this.hex) {
      if (this.trueEventName) {
        this.emit(this.trueEventName, bot)
      }
      return true;
    } else if (this.falseEventName) {
      this.emit(this.falseEventName, bot)
    }
    return false;
  }
}

class BlockingAction extends Blockable {
  constructor(x, y, hex) {
    super(x, y, hex);
  }

  thenRaise(eventName) {
    this.eventName = eventName;
  }

  tick(bot) {
    this._runDebugCallback(this);
    const x = config.offsets.x + this.x;
    const y = config.offsets.y + this.y;
    const hex = robot.getPixelColor(x, y);
    if (hex === this.hex) {
      robot.moveMouse(x, y);
      robot.mouseClick();
      if (this.eventName) {
        this.emit(this.eventName, bot);
      }
      return true;
    }
    return false;
  }
}

class Action extends Tickable {
  constructor(x, y, hex) {
    super();
    this.x = x;
    this.y = y;
    this.hex = hex;
  }

  tick(bot) {
    this._runDebugCallback(this);
    const x = config.offsets.x + this.x;
    const y = config.offsets.y + this.y;
    const hex = robot.getPixelColor(x, y);
    if (hex === this.hex || this.hex === null) {
      robot.moveMouse(x, y);
      robot.mouseClick();
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
  constructor() {
    this._currentStep = null;
    this._steps = {};

    this._eventBus = new EventBus((stepName, arg) => {
      this._currentStep = stepDesc(stepName, arg);

      if (!this._steps[stepName]) {
        throw new Error(`Unknown step: ${stepName}`)
      }

      this._steps[stepName].reset();
      console.log(`Running step ${this._currentStep.stepName}`);
    });
  }

  step(name, action) {
    if (this._steps[name]) {
      throw new Error(`Duplicate step: ${name}`);
    }
    this._steps[name] = action;
    return this;
  }

  on(event, stepName, arg = null) {
    this._eventBus.add(event, stepName, arg);
    return this;
  }

  onFailure(stepName, arg) {
    this.errorHandler = stepDesc(stepName, arg);
    return this;
  }

  start(stepName, arg) {
    this._currentStep = stepDesc(stepName, arg);
    this.intervalId = setInterval(this._tick.bind(this), config.interval);
  }

  _tick() {
    if (!this._steps[this._currentStep.stepName]) {
      throw new Error(`Invalid step: ${this._currentStep.stepName}`);
    }

    try {
      this._steps[this._currentStep.stepName].tick(this);
    } catch (e) {
      console.error(`Error thrown when trying to perform step "${this._currentStep.stepName}:${this._currentStep.arg}"`);
      console.error(e);
      clearInterval(this.intervalId);
    }
  }

  get currentStep() {
    return this._currentStep;
  }

  get eventBus() {
    return this._eventBus;
  }
}
