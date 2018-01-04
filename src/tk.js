const {Bot, Repeat, AnyOf, Action, Condition, ActionSeries, BlockingAction} = require('./bot');

const bot = new Bot()
  .step( // Run with an argument. When an event is raised it will have %s replaced with the argument
    'return to home',
    Repeat(
      AnyOf(
        Action(37, 143, '2888d4'), // blue back arrow
        Action(37, 155, 'ffffff'), // red cross
        Action(409, 55, '343a10'), // grass
        Action(99, 547, 'ffffff'), // screen before home, bottom left blue arrow
      )
    ).until(
      Condition(747, 537, 'fbce82').raise('home:%s')
    )
  )
  .step(
    'go to tower start',
    ActionSeries(
      BlockingAction(375, 525, 'd3cbb3'), // select battle
      BlockingAction(448, 536, 'dccbac'), // select pvp
      BlockingAction(334, 270, '2c94e5'), // select tower
      BlockingAction(0.8898623279098874, 0.44333333333333336, '2c94e5').thenRaise('tower:at-start'), // select hero battles
    )
  )
  .step(
    'check tower can be run',
    ActionSeries(
      AllOf(

      ).true('tower:can-be-ran')
       .false('tower:can-not-be-ran')
    )
    AnyOf(
      Condition(0, 1, '0f0f0f').true('tower:can-be-ran').false('tower:can-not-be-ran')
    )
  )
  .step(
    'run tower',
    ActionSeries(
      BlockingAction(290, 455, 'd54e1f'), // attack
      BlockingAction(475, 467, '5fd520'), // start
      Repeat(
        Action(374, 564, 'ffffff'), // shaman punch
        Action(298, 538, 'f4fa7a'), // mage fire
        Action(464, 564, '538010'), // paladin buff
      ).until(
        Condition(5, 5, '0f0f0f') // loot available
      ),
      BlockingAction(5, 5, '0f0f0f').thenRaise('tower:complete'), // accept loot
    )
  )
  .step(
    'go to pvp start',
    ActionSeries(
      BlockingAction(0, 1, 'ffffff'), // select first menu
      BlockingAction(0, 2, 'fffff00'), // select second menu
      BlockingAction(0, 3, 'fffff00').thenRaise('pvp:at-start'), // select third menu
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
      BlockingAction(5, 5, '0f0f0f').thenRaise('pvp:complete'), // accept loot
    )
  )
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
      BlockingAction(5, 5, '0f0f0f').thenRaise('pve:complete'), // accept loot
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
