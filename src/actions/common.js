const {Repeat, AnyOf, Action, Condition, WaitingCondition, ActionSeries, BlockingAction, location} = require('../bot');

const homeScreenBattle = location(369, 527, 'd2cbb2');

// const above50PercentEngergy =

const returnToHome = Repeat(
  AnyOf(
    Action(25, 148, 'ffffff'), // blue back arrow
    Action(82, 157, 'ffffff'), // smaller blue back arrow
    Action(124, 153, 'ffffff'), // red cross
    Action(385, 60, '343910'), // grass
    Action(92, 549, 'ffffff'), // screen before home, bottom left blue arrow
    Action(434, 549, 'd54e1f'), // loot
  )
).until(
  Condition(365, 526, 'd2cbb3').true('home:%s')
);

const getFocusAction = () => Action(location(378, 71, null));

module.exports = {
  returnToHome,
  getFocusAction,
  locations: {
    homeScreenBattle
  }
};
