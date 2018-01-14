const {Repeat, AnyOf, Action, Condition, BlockingCondition, ActionSeries, BlockingAction, If, Not, location} = require('../bot');
const common = require('./common');

const events = {
  atStart: 'tower:at-start',
  canRun: 'tower:can-run',
  cantRun: 'tower:cant-run',
  complete: 'tower:complete'
};

const towerLocations = {
  attack: location(279, 460, 'd54e1f'),
  toBattle: location(475, 468, '5fd520'),
  buyMoreAttacks: location(374, 357, '5fd520'),
  loot: location(434, 549, 'd54e1f'),
  defeat: location(428, 439, '2c94e5')
};


const goToTowerStart = ActionSeries(
  BlockingAction(common.locations.homeScreenBattle),
  BlockingAction(common.pvpLocations.homeScreenPvp)
    .thenRaise(events.atStart)
);

const checkTowerCanBeRan = ActionSeries(
  BlockingAction(common.pvpLocations.attackTower),
  Action(common.locations.closeYourTowerHasBeenAttacked),
  BlockingAction(towerLocations.attack),
  Repeat(
    Condition(towerLocations.toBattle)
      .true(events.canRun),
    Condition(towerLocations.buyMoreAttacks)
      .true(events.cantRun)
  )
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
  BlockingAction(towerLocations.toBattle),
  Repeat(
    AnyOf(
      If(Not(Condition(bgLockNinjaClericAbilities.clericCantUse))).then(Action(bgLockNinjaClericAbilities.cleric)),
      Action(bgLockNinjaClericAbilities.ninja),
      Action(bgLockNinjaClericAbilities.lock),
      Action(towerLocations.loot),
      Action(common.locations.defeat)
    )
  ).until(
    Condition(common.pvpLocations.attackTower).true(events.complete)
  )
);

module.exports = {
  events,
  goToTowerStart,
  checkTowerCanBeRan,
  runTowerBGLockNinjaCleric
};
