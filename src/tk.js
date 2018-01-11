const {Bot, Repeat, AnyOf, Action, Condition, WaitingCondition, ActionSeries, BlockingAction, location} = require('./bot');
const pvp = require('./actions/pvp');
const common = require('./actions/common');


const bot = new Bot()
  .step('focus', common.getFocusAction().thenRaise('has-focus'))
  .step('return to home', common.returnToHome)
  .step('go to tower start', pvp.goToTowerStart)
  .step('check tower can be run', pvp.checkTowerCanBeRan)
  .step('run tower', pvp.runTowerBGLockNinjaCleric)
  .step('go to pvp start', pvp.goToPvpStart)
  .step('check pvp can be ran', pvp.checkPvpCanBeRan)
  .step('run pvp', pvp.runPvp)
  .step(
    'go to mission',
    ActionSeries(
      BlockingAction(0, 1, 'ffffff'), // select first menu
      BlockingAction(0, 2, 'fffff00'), // select second menu
      BlockingAction(0, 3, 'fffff00').thenRaise('pve:at-start'), // select third menu
    )
  )
  .step(
    'check pve can be ran',
    AnyOf(
      Condition(0, 1, '0f0f0f').true('pve:can-be-ran').false('pve:can-not-be-ran')
    )
  )
  .step(
    'run pve',
    ActionSeries(
      BlockingAction(0, 1, 'ffffff'), // select start
      Repeat(
        Action(0, 1, 'ffffff'), // spam first ability
      ).until(
        Condition(5, 5, '0f0f0f') // loot available
      ),
      BlockingAction(5, 5, '0f0f0f').thenRaise('pve:complete'), // accept loot
    )
  )
  .on('has-focus', 'return to home', 'startup')
  .on('home:startup', 'go to tower start')
  .on(pvp.events.tower.atStart, 'check tower can be run')
  .on(pvp.events.tower.canRun, 'run tower')
  .on(pvp.events.tower.complete, 'check tower can be run')
  .on(pvp.events.cantRun, 'return to home', 'after-tower')
  .on('home:after-tower', 'go to pvp start')
  .on(pvp.events.pvp.atStart, 'pvp:at-start', 'check pvp can be ran')
  .on(pvp.events.pvp.canRun, 'pvp:can-be-ran', 'run pvp')
  .on(pvp.events.pvp.complete, 'pvp:complete', 'check pvp can be ran')
  .on(pvp.events.pvp.cantRun, 'pvp:can-not-be-ran', 'return to home', 'after-pvp')
  .on('home:after-pvp', 'go to repeatable mission')
  .on('pve:at-start', 'check pve can be ran')
  .on('pve:can-be-ran', 'run pve')
  .on('pve:complete', 'check pve can be ran')
  .on('pve:can-not-be-ran', 'navigate to home', 'startup') // repeat infintely until something is available
  .onFailure('return to home', 'startup');

bot.start('focus');
