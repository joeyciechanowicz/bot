const {Repeat, AnyOf, Action, Condition, BlockingCondition, ActionSeries, BlockingAction, If, Not, location} = require('../bot');
const common = require('./common');

const heroBattleLocations = {
  wizardsChosen: location(239, 490, '48a115'),
  wizardsEstimatedRewards: location(501, 347, '2c94e5'),
  guildHungers: location(442, 347, '2c94e5')
};

const events = {
  atStart: 'heroBattles:at-start',
  canRun: 'heroBattles:can-run',
  complete: 'heroBattles:complete',
  cantRun: 'heroBattles:cant-run',
  guildHungers: 'heroBattles:guild-hungers',
  guildPointsSpent: 'heroBattles:guild-points-spent'
};

const goToPvpStart = ActionSeries(
  BlockingAction(common.locations.homeScreenBattle),
  BlockingAction(common.pvpLocations.homeScreenPvp)
    .thenRaise(events.atStart)
);

const checkPvpCanBeRan = ActionSeries(
  BlockingAction(common.pvpLocations.heroBattles),
  BlockingAction(heroBattleLocations.wizardsChosen),
  Repeat(
    Condition(heroBattleLocations.wizardsEstimatedRewards)
      .true(events.canRun),
    Condition(heroBattleLocations.guildHungers)
      .true(events.guildHungers)
      .false(events.cantRun),
  )
);

const claimColor = '5fd520';
const buyColor = 'fbcd29';
const guildShopLocations = {
  claimKeys: location(170, 428, claimColor),
  buyKeys: location(170, 428, buyColor),
  claimTomes: location(432, 428, claimColor),
  buyTomes: location(432, 428, buyColor),
  claimStones: location(681, 428, claimColor),
  buyStones: location(681, 428, buyColor),
  hasPoints: location(498, 123, 'd63035')
};

const guildHungers = ActionSeries(
  BlockingAction(heroBattleLocations.guildHungers),
  Repeat(
    AnyOf(
      Action(guildShopLocations.buyStones),
      Action(guildShopLocations.buyTomes),
      Action(guildShopLocations.claimTomes),
      Action(guildShopLocations.claimStones),
      Action(guildShopLocations.claimKeys),
      Action(common.locations.acceptStone),
      Action(guildShopLocations.buyKeys),
    )
  ).until(Not(Condition(guildShopLocations.hasPoints)).true(events.guildPointsSpent))
)

const spellSword = location(290, 557, 'ffffff');
const ninja = location(375, 566, 'ffffff');
const druid = location(511, 565, 'ffffff');
const bgTank = location(440, 547, 'ffffff');
const bgDps = location(291, 546, 'ffffff');
const monkTank = location(433, 554, 'ffffff');
const thief = location(366, 562, 'ffffff');

const knight = location(438, 543, 'f3f1e7');
const shaman = location(291, 562, 'ffffff');

const ourEmptyWinFirstRound = location(341, 50, '26272c');
const theirEmptyWinFirstRound = location(458, 50, '26272c');

const runPvpSetup1 = ActionSeries(
  BlockingAction(heroBattleLocations.wizardsEstimatedRewards),
  Repeat(
    AnyOf(
      Action(knight),
      Action(druid),
      Action(spellSword),
      Action(bgDps),
      Action(monkTank),
      Action(thief),
      Action(shaman),
      Action(common.locations.acceptLoot),
      Action(common.locations.defeat)
    )
  ).until(
    Condition(common.pvpLocations.heroBattles)
      .true(events.complete)
  ),
);


module.exports = {
  events,
  goToPvpStart,
  guildHungers,
  checkPvpCanBeRan,
  runPvpSetup1
};
