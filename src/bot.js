const robot = require("robotjs");
const config = require('../config');

// Helper func to ensure we always create a step object the same way
const stepDesc = (stepName, arg) => ({
  stepName: stepName,
  arg: arg
});

module.exports.location = (x, y, hex) => ({
  x, y, hex
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
module.exports.WaitingCondition = function (x, y, hex) {
  return new WaitingCondition(x, y, hex);
};
module.exports.BlockingCondition = function (x, y, hex) {
  return new BlockingCondition(x, y, hex);
};
module.exports.ActionSeries = function (...actions) {
  return new ActionSeries(actions);
};
module.exports.BlockingAction = function (x, y, hex) {
  return new BlockingAction(x, y, hex);
};
module.exports.AllOf = function (...conditions) {
  return new AllOf(conditions);
};
module.exports.If = function (condition) {
  return new If(condition);
};
module.exports.Not = function (condition) {
  return new Not(condition);
};

class Tickable {

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
  constructor() {
    super();
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

    if (this.index >= this.actions.length) {
      throw new Error('Action series has iterated all actions. A event needs to be raised before this happens');
    }

    const action = this.actions[this.index];
    const result = action.tick(bot);

    if (action instanceof Blockable) {
      if (result === true) {
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

  true(eventName) {
    if (!eventName || eventName.length == 0) {
      throw new Error('Event name is not allowed to be empty');
    }

    this._trueEventName = eventName;
    return this;
  }

  false(eventName) {
    if (!eventName || eventName.length == 0) {
      throw new Error('Event name is not allowed to be empty');
    }

    this._falseEventName = eventName;
    return this;
  }

  tick(bot) {
    this._runDebugCallback(this);
    this.actions.forEach(action => {
      if (action.tick(bot)) {
        if (this._trueEventName) {
          this.emit(this._trueEventName, bot);
        }
        return true;
      }
    });
    if (this._falseEventName) {
      this.emit(this._falseEventName, bot);
    }
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
      if (result === true) {
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
    if (x.x) {
      this.x = x.x;
      this.y = x.y;
      this.hex = x.hex;
    } else {
      this.x = x;
      this.y = y;
      this.hex = hex;
    }
  }

  true(eventName) {
    if (!eventName || eventName.length == 0) {
      throw new Error('Event name is not allowed to be empty');
    }

    this._trueEventName = eventName;
    return this;
  }

  false(eventName) {
    if (!eventName || eventName.length == 0) {
      throw new Error('Event name is not allowed to be empty');
    }

    this._falseEventName = eventName;
    return this;
  }

  tick(bot) {
    this._runDebugCallback(this);
    const x = config.offsets.x + this.x;
    const y = config.offsets.y + this.y;
    const hex = robot.getPixelColor(x, y);

    if (hex === this.hex) {
      if (this._trueEventName) {
        this.emit(this._trueEventName, bot)
      }
      return true;
    } else if (this._falseEventName) {
      this.emit(this._falseEventName, bot)
    }
    return false;
  }
}

class If extends Tickable {
  constructor(condition) {
    super();
    if (!condition || !condition.tick) {
      throw new Error('Must pass a condition to If constructor');
    }

    this._condition = condition;
  }

  then(action) {
    if (!action || !action.tick) {
      throw new Error('Must pass an action to If.then');
    }

    this._then = action;
    return this;
  }

  tick(bot) {
    this._runDebugCallback(this);

    if (this._condition.tick(bot)) {
      this._then.tick(bot);
    }

    return true;
  }
}

class Not extends Tickable {
  constructor(condition) {
    super();
    if (!condition || !condition.tick) {
      throw new Error('Must pass a condition to If constructor');
    }

    this._condition = condition;
  }

  tick(bot) {
    this._runDebugCallback(this);

    if (this._condition.tick(bot)) {
      return false
    }

    return true;
  }
}

class WaitingCondition extends Blockable {

  constructor(x, y, hex) {
    super();
    if (x.x) {
      this.x = x.x;
      this.y = x.y;
      this.hex = x.hex;
    } else {
      this.x = x;
      this.y = y;
      this.hex = hex;
    }
    this._waitedCount = 0;
  }

  true(eventName) {
    if (!eventName || eventName.length == 0) {
      throw new Error('Event name is not allowed to be empty');
    }

    this._trueEventName = eventName;
    return this;
  }

  false(eventName) {
    if (!eventName || eventName.length == 0) {
      throw new Error('Event name is not allowed to be empty');
    }

    this._falseEventName = eventName;
    return this;
  }

  waitFor(ticks) {
    this._ticks = ticks;
    return this;
  }

  tick(bot) {
    this._runDebugCallback(this);
    const x = config.offsets.x + this.x;
    const y = config.offsets.y + this.y;
    const hex = robot.getPixelColor(x, y);

    if (hex === this.hex) {
      if (this._trueEventName) {
        this.emit(this._trueEventName, bot)
      }
      return true;
    }

    this._waitedCount++;

    if (this._waitedCount >= this._ticks) {
      if (this._falseEventName) {
        this.emit(this._falseEventName, bot)
      }

      return true;
    }

    return false;
  }
}

class AllOf extends Tickable {
  constructor(conditions) {
    super();
    this._conditions = conditions;
  }

  true(eventName) {
    if (!eventName || eventName.length == 0) {
      throw new Error('Event name is not allowed to be empty');
    }

    this._trueEventName = eventName;
    return this;
  }

  false(eventName) {
    if (!eventName || eventName.length == 0) {
      throw new Error('Event name is not allowed to be empty');
    }

    this._falseEventName = eventName;
    return this;
  }

  tick(bot) {
    this._runDebugCallback(this);

    this._conditions.forEach(condition => {
      if (!condition.tick(bot)) {
        if (this._falseEventName) {
          this.emit(this._falseEventName, bot);
        }

        return false;
      }
    });

    if (this._trueEventName) {
      this.emit(this._trueEventName, bot);
    }
    return true;
  }
}

class BlockingAction extends Blockable {
  constructor(x, y, hex) {
    super();

    if (x.x) {
      this.x = x.x;
      this.y = x.y;
      this.hex = x.hex;
    } else {
      this.x = x;
      this.y = y;
      this.hex = hex;
    }
  }

  thenRaise(eventName) {
    if (!eventName || eventName.length == 0) {
      throw new Error('Event name is not allowed to be empty');
    }

    this.eventName = eventName;
    return this;
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

class BlockingCondition extends Blockable {

  constructor(x, y, hex) {
    super();
    if (x.x) {
      this.x = x.x;
      this.y = x.y;
      this.hex = x.hex;
    } else {
      this.x = x;
      this.y = y;
      this.hex = hex;
    }
  }

  true(eventName) {
    if (!eventName || eventName.length == 0) {
      throw new Error('Event name is not allowed to be empty');
    }

    this._trueEventName = eventName;
    return this;
  }

  tick(bot) {
    this._runDebugCallback(this);
    const x = config.offsets.x + this.x;
    const y = config.offsets.y + this.y;
    const hex = robot.getPixelColor(x, y);

    if (hex === this.hex) {
      console.log(`Blocking condition met, emitting: ${this._trueEventName}`);
      if (this._trueEventName) {
        this.emit(this._trueEventName, bot)
      }
      return true;
    }

    return false;
  }
}

class Action extends Tickable {
  constructor(x, y, hex) {
    super();
    if (x.x) {
      this.x = x.x;
      this.y = x.y;
      this.hex = x.hex;
    } else {
      this.x = x;
      this.y = y;
      this.hex = hex;
    }
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

    if (this._eventName) {
      this.emit(this._eventName, bot);
    }

    return true;
  }

  thenRaise(eventName) {
    if (!eventName || eventName.length == 0) {
      throw new Error('Event name is not allowed to be empty');
    }

    this._eventName = eventName;
    return this;
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
    if (config.debug) {
      console.log(`Emitting event - ${event}`);
    }
    if (this.eventToStep[event]) {
      this.stepChangeCb(this.eventToStep[event]);
    }
  }
}

module.exports.Bot = class Bot {
  constructor() {
    this._currentStep = null;
    this._steps = {};

    this._eventBus = new EventBus((nextStep) => {

      if (!this._steps[nextStep.stepName]) {
        throw new Error(`Unknown step: ${nextStep.stepName}`)
      }

      this._iterations = 0; // reset number of iterations when we change states

      if (config.debug) {
        const currentStepLog = this._currentStep.arg && this._currentStep.arg.length > 0
          ? `${this._currentStep.stepName}:${this._currentStep.arg}`
          : this._currentStep.stepName;

        const nextStepLog = nextStep.arg && nextStep.arg.length > 0
          ? `${nextStep.stepName}:${nextStep.arg}`
          : nextStep.stepName;

        console.log(`Switching from "${currentStepLog}" to "${nextStepLog}"`);
      }
      this._currentStep = nextStep;
      this._steps[nextStep.stepName].reset();

    });
  }

  step(name, action) {
    if (this._steps[name]) {
      throw new Error(`Duplicate step: ${name}`);
    }
    if (!action) {
      throw new Error(`No action passed for step "${name}"`);
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
    this._iterations = 0;

    this._currentStep = stepDesc(stepName, arg);
    this.intervalId = setInterval(this._tick.bind(this), config.interval);
  }

  _tick() {
    if (!this._steps[this._currentStep.stepName]) {
      console.error(`Step not found: ${this._currentStep.stepName}`);
      clearInterval(this.intervalId);
      return;
    }

    if (config.debug) {
      this._iterations++;

      if (this._iterations > config.maxIterations) {
        this._iterations = 0;
        console.warn(`Exceeded ${config.maxIterations} iterations on step ${this._currentStep.stepName}`);
        return;
      }
    }

    try {
      this._steps[this._currentStep.stepName].tick(this);
    } catch (e) {
      console.error(`Error thrown when trying to perform step "${this._currentStep.stepName}:${this._currentStep.arg}"`);
      console.error(e);
      this._currentStep = this.onFailure;
      console.warn(`Switching to failure step: ${this._currentStep.stepName}:${this._currentStep.arg}`)
      this._steps[this._currentStep.stepName].reset();
    }
  }

  get currentStep() {
    return this._currentStep;
  }

  get eventBus() {
    return this._eventBus;
  }
}
