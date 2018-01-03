const {Bot, Offsets, Repeat, AnyOf, Action, Condition, ActionSeries, BlockingAction} = require('./bot');

const bot = new Bot({
    offsets: new Offsets(170, 188, 50, 50),
    interval: 100, //ms
  })
  .step( // Run with an argument. When an event is raised it will have %s replaced with the argument
    'return to home',
    Repeat(
      AnyOf(
        Action(0.1113892365456821, 0.9166666666666666, 'ffffff'),
        Action(0.5043804755944932, 0.08833333333333333, null),
      )
    ).until(
      Condition(0.46307884856070086, 0.6416666666666667, 'bab5a7').raise('home:%s')
    )
  )
  .step(
    'go to tower start',
    ActionSeries(
      BlockingAction(0.49937421777221525, 0.9116666666666666, '52180e'), // select battle
      BlockingAction(0.5456821026282853, 0.89, 'ddcdb2'), // select pvp
      BlockingAction(0.8898623279098874, 0.44333333333333336, '2c94e5').raise('tower:at-start'), // select hero battles
    )
  )
  .step(
    'check tower can be run',
    AnyOf(
      Condition(0, 1, '0f0f0f').raise('tower:can-be-ran'),
      Condition(0, 1, 'ffffff').raise('tower:can-not-be-ran')
    )
  )
  .step(
    'run tower',
    ActionSeries(
      BlockingAction(0, 1, 'ffffff'), // select start
      Repeat(
        Action(0, 1, 'ffffff'), // spam first ability
        Action(0, 2, 'ffffff'), // spam second ability
      ).until(
        Condition(5, 5, '0f0f0f') // loot available
      ),
      BlockingAction(5, 5, '0f0f0f').raise('tower:complete'), // accept loot
    )
  )
  .step(
    'go to pvp start',
    ActionSeries(
      BlockingAction(0, 1, 'ffffff'), // select first menu
      BlockingAction(0, 2, 'fffff00'), // select second menu
      BlockingAction(0, 3, 'fffff00').raise('pvp:at-start'), // select third menu
    )
  )
  .step(
    'check pvp can be ran',
    AnyOf(
      Condition(0, 1, '0f0f0f').raise('pvp:can-be-ran'),
      Condition(0, 1, 'ffffff').raise('pvp:can-not-be-ran')
    )
  )
  .step(
    'run pvp',
    ActionSeries(
      BlockingAction(0, 1, 'ffffff'), // select start
      Repeat( // Round 1
        Action(0, 1, 'ffffff'), // spam first ability
        Action(0, 2, 'ffffff'), // spam second ability
      ).until(
        Condition(5, 5, '0f0f0f') // First round ends
      ),
      Repeat( // Round 2
        Action(0, 1, 'ffffff'), // spam first ability
        Action(0, 2, 'ffffff'), // spam second ability
      ).until(
        Condition(5, 5, '0f0f0f') // Second round ends
      ),
      Repeat( // Third round, may not happen
        Action(0, 1, 'ffffff'), // spam first ability
        Action(0, 2, 'ffffff'), // spam second ability
      ).until(
        AnyOf( // Deal with ending after second round or third round
          Condition(5, 5, '0f0f0f'), // Second round end
          Condition(5, 4, 'ffffff') // Third round end
        )
      ),
      BlockingAction(5, 5, '0f0f0f').raise('pvp:complete'), // accept loot
    )
  )
  .step(
    'go to mission',
    ActionSeries(
      BlockingAction(0, 1, 'ffffff'), // select first menu
      BlockingAction(0, 2, 'fffff00'), // select second menu
      BlockingAction(0, 3, 'fffff00').raise('pve:at-start'), // select third menu
    )
  )
  .step(
    'check pve can be ran',
    AnyOf(
      Condition(0, 1, '0f0f0f').raise('pve:can-be-ran'),
      Condition(0, 1, 'ffffff').raise('pve:can-not-be-ran')
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
      BlockingAction(5, 5, '0f0f0f').raise('pve:complete'), // accept loot
    )
  )
  .on('home:startup', 'go to tower start')
  .on('tower:at-start', 'check tower can be run')
  .on('tower:can-be-ran', 'run tower')
  .on('tower:complete', 'check tower can be run')
  .on('tower:can-not-be-ran', 'return to home', 'after-tower')
  .on('home:after-tower', 'go to pvp start')
  .on('pvp:at-start', 'check pvp can be ran')
  .on('pvp:can-be-ran', 'run pvp')
  .on('pvp:complete', 'check pvp can be ran')
  .on('pvp:can-not-be-ran', 'return to home', 'after-pvp')
  .on('home:after-pvp', 'go to repeatable mission')
  .on('pve:at-start', 'check pve can be ran')
  .on('pve:can-be-ran', 'run pve')
  .on('pve:complete', 'check pve can be ran')
  .on('pve:can-not-be-ran', 'navigate to home', 'startup') // repeat infintely until something is available
  .onFailure('return to home', 'startup');

bot.start('return to home', 'startup');
