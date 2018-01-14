const {Bot, Repeat, AnyOf, Action, Condition, WaitingCondition, ActionSeries, BlockingAction, location} = require('./bot');
const common = require('./actions/common');
const heroBattles = require('./actions/heroBattles');
const tower = require('./actions/tower');
const oneTen = require('./actions/1-10-bandit-lord');

const bot = new Bot()
  .step('focus', common.getFocusAction().thenRaise('has-focus'))
  .step('return to home', common.returnToHome)
  .step('go to tower start', tower.goToTowerStart)
  .step('check tower can be run', tower.checkTowerCanBeRan)
  .step('run tower', tower.runTowerBGLockNinjaCleric)
  .step('go to pvp start', heroBattles.goToPvpStart)
  .step('check pvp can be ran', heroBattles.checkPvpCanBeRan)
  .step('guild hungers', heroBattles.guildHungers)
  .step('run pvp', heroBattles.runPvpSetup1)
  .step('go to 1-10 start', oneTen.goToStart)
  .step('run 1-10', oneTen.run)

  .on('has-focus', 'return to home', 'startup')
  .on('home:startup', 'go to pvp start')
  .on(heroBattles.events.atStart, 'check pvp can be ran')
  .on(heroBattles.events.canRun, 'run pvp')
  .on(heroBattles.events.guildHungers, 'guild hungers')
  .on(heroBattles.events.guildPointsSpent, 'return to home', 'startup')
  .on(heroBattles.events.complete, 'check pvp can be ran')
  .on(heroBattles.events.cantRun, 'return to home', 'after-pvp')
  .on('home:after-pvp', 'go to tower start')
  .on(tower.events.atStart, 'check tower can be run')
  .on(tower.events.canRun, 'run tower')
  .on(tower.events.complete, 'check tower can be run')
  .on(tower.events.cantRun, 'return to home', 'after-tower')
  .on('home:after-tower', 'go to 1-10 start')
  .on(oneTen.events.atStart, 'run 1-10')
  .on(oneTen.events.complete, 'return to home', 'startup') // repeat infintely

  .everyTick(
    AnyOf(
      Action(common.locations.acceptDailyReward),
      Action(common.locations.collectDailyReward),
      Action(common.locations.acceptStone),
      Action(common.locations.newsEventsRedCross),
      Action(common.locations.keeperLevelUp)
    )
  )
  .onFailure('return to home', 'startup');

bot.start('focus');
