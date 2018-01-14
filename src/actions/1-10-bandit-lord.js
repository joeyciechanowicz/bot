const {Repeat, AnyOf, Action, Condition, BlockingCondition, ActionSeries, BlockingAction, If, Not, TickCounter, location} = require('../bot');
const common = require('./common');
const config = require('../../config');

const redColor = 'd63035';

const oneTenLocations = {
  campaign: location(328, 522, 'e8db9c'),
  selectACampaign: location(395, 147, 'ffffff'),
  firstSpotIsFight: location(187, 182, redColor),
  secondSpotIsFight: location(361, 182, redColor),
  thirdSpotIsFight: location(616, 182, redColor),
  banditLord: location(689, 308, 'ffffff'),
  extreme: location(664, 261, '2c94e5'),
  toBattle: location(461, 480, 'ffffff'),
  withoutParty: location(496, 350, '2c94e5'),
  useAbility: location(392, 554, 'ffffff'),
  acceptLoot: location(439, 555, 'd54e1f'),
};

const events = {
  atStart: '1-10:at-start',
  complete: '1-10:complete'
};

const goToStart = ActionSeries(
  BlockingAction(common.locations.homeScreenBattle),
  BlockingAction(oneTenLocations.campaign),
  BlockingCondition(oneTenLocations.selectACampaign),
  If(Condition(oneTenLocations.firstSpotIsFight))
    .then(Action(oneTenLocations.firstSpotIsFight).thenRaise(events.atStart)),
  If(Condition(oneTenLocations.secondSpotIsFight))
    .then(Action(oneTenLocations.secondSpotIsFight).thenRaise(events.atStart)),
  If(Condition(oneTenLocations.thirdSpotIsFight))
    .then(Action(oneTenLocations.thirdSpotIsFight).thenRaise(events.atStart)),
);

const hoursToRunFor = 1;
const ticks = (hoursToRunFor * 60 * 60 * 1000) / config.interval;
const run = Repeat(
  AnyOf(
    Action(oneTenLocations.banditLord),
    Action(oneTenLocations.extreme),
    Action(oneTenLocations.toBattle),
    Action(oneTenLocations.withoutParty),
    Action(oneTenLocations.useAbility),
    Action(oneTenLocations.acceptLoot)
  ),
).until(TickCounter(ticks).thenRaise(events.complete));

module.exports = {
  events,
  goToStart,
  run
};

