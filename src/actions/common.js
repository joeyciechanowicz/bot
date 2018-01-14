const {Repeat, AnyOf, Action, Condition, WaitingCondition, ActionSeries, BlockingAction, location} = require('../bot');

const locations = {
  homeScreenBattle: location(369, 527, 'd2cbb2'),
  newsEventsRedCross: location(81, 30, 'ffffff'),
  collectDailyReward: location(456, 474, 'fbcd29'),
  acceptDailyReward: location(528, 262, 'd83134'),
  acceptStone: location(395, 134, '050309'),
  defeat: location(428, 439, '2c94e5'),
  closeGetMoreAttacks: location(178, 216, 'ffffff'),
  above45PercentEnergy: location(398, 590, 'f5a23f'),
  acceptLoot: location(434, 549, 'd54e1f'),
  keeperLevelUp: location(478, 413, 'd83134'),
  closeYourTowerHasBeenAttacked: location(22, 152, 'ffffff'),
};

const pvpLocations = {
  homeScreenPvp: location(440, 536, 'dccbac'),
  attackTower: location(323, 264, '2c94e5'),
  heroBattles: location(723, 267, '2c94e5'),
};

// const above50PercentEngergy =

const returnToHome = Repeat(
  AnyOf(
    Action(25, 148, 'ffffff'), // blue back arrow
    Action(82, 157, 'ffffff'), // smaller blue back arrow
    Action(124, 153, 'ffffff'), // red cross
    Action(385, 60, '343910'), // grass
    Action(92, 549, 'ffffff'), // screen before home, bottom left blue arrow
    Action(locations.acceptLoot), // loot
    Action(locations.defeat),
    Action(locations.newsEventsRedCross),
    Action(locations.acceptDailyReward),
    Action(locations.collectDailyReward),
    Action(locations.acceptStone),
    Action(locations.closeGetMoreAttacks),
    Action(locations.closeYourTowerHasBeenAttacked)
  )
).until(
  Condition(365, 526, 'd2cbb3').true('home:%s')
);

const getFocusAction = () => Action(location(378, 71, null));

const addForBreakpoint = () => {
  console.log('break here');
  getFocusAction().tick(null);
};

module.exports = {
  returnToHome,
  getFocusAction,
  locations,
  pvpLocations,
  addForBreakpoint
};
