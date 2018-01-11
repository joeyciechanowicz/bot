const {Repeat, AnyOf, Action, Condition, BlockingCondition, WaitingCondition, ActionSeries, BlockingAction, If, Not, location} = require('../bot');
const common = require('./common');

const addForBreakpoint = () => {
  console.log('break here');
  common.getFocusAction().tick(null);
};

const pvp = {
  homeScreenPvp: location(440, 536, 'dccbac'),
  attackTower: location(323, 264, '2c94e5'),
  heroBattles: location(723, 267, '2c94e5'),
};

const tower = {
  attack: location(279, 460, 'd54e1f'),
  toBattle: location(475, 468, '5fd520'),
  loot: location(434, 549, 'd54e1f')
};

const events = {
  tower: {
    atStart: 'tower:at-start',
    canRun: 'tower:can-run',
    cantRun: 'tower:cant-run',
    complete: 'tower:complete'
  },
  pvp: {
    atStart: 'heroBattles:at-start',
    canRun: 'heroBattles:can-run',
    complete: 'heroBattles:complete',
    cantRun: 'heroBattles:cant-run'
  }
};

const goToTowerStart = ActionSeries(
  BlockingAction(common.locations.homeScreenBattle),
  BlockingAction(pvp.homeScreenPvp),
  BlockingAction(pvp.attackTower),
  BlockingCondition(tower.attack)
    .true(events.tower.atStart)
);

const checkTowerCanBeRan = ActionSeries(
  BlockingAction(tower.attack),
  WaitingCondition(tower.toBattle)
    .waitFor(5)
    .true(events.tower.canRun)
    .false(events.tower.cantRun)
);

/*
lock
ninja   BG
cleric
 */
// Todo: put in >50% use bg ability
const bgLockNinjaClericAbilities = {
  ninja: location(362, 531, 'ffffff'),
  bg: location(441, 548, 'ffffff'),
  lock: location(287, 562, 'ffffff'),
  cleric: location(526, 544, 'ffffff'),
  clericCantUse: location(518, 572, 'dd0c19')
};
const runTowerBGLockNinjaCleric = ActionSeries(
  BlockingAction(tower.toBattle),
  Repeat(
    AnyOf(
      If(Not(Condition(bgLockNinjaClericAbilities.clericCantUse))).then(Action(bgLockNinjaClericAbilities.cleric)),
      Action(bgLockNinjaClericAbilities.ninja),
      Action(bgLockNinjaClericAbilities.lock),
    )
  ).until(Condition(tower.loot),
  Action(tower.loot).thenRaise(events.tower.complete))
);

module.exports = {
  goToTowerStart,
  checkTowerCanBeRan,
  runTowerBGLockNinjaCleric,
  events
};
