const {Bot, Repeat, AnyOf, Action, Condition, ActionSeries, BlockingAction} = require('./bot');

const bot = new Bot()
  .step(
    'run tower',
    ActionSeries(
      BlockingAction(747, 470, '5fd520').debug(() => {console.log('enter tower')}), // enter tower
      BlockingAction(480, 466, '5fd520'), // start
      Repeat(
        Action(302, 545, 'ffffff'), // ability 1
        Action(374, 563, 'ffffff'), // shaman punch
        Action(451, 547, 'fffffe'), // DM stun
        Action(521, 554, 'ffffff'), // necro heal
      ).until(
        Condition(448, 552, 'd54e1f') // loot available
      ),
      BlockingAction(448, 552, 'd54e1f'),
      Condition(743, 474, 'facc29')
        .true('tower:loot-available')
        .false('tower:loot-unavailable')
    )
  )
  .step(
    'collect loot',
    ActionSeries(
      BlockingAction(744, 467, 'fbcd29'),
      Repeat(
        Action(724, 466, '000000')
      ).until(
        AnyOf(
          Condition(750, 470, '5fd520').true('tower:tower-complete'),
          Condition(750, 470, '5fd520'), // this needs to be changed for when theres no tickets left
        )
      )

    )
  )
  .step('focus', Action(313, 38, null))
  .on('tower:complete', 'run tower')
  .on('tower:loot-available', 'collect loot')

bot.start('run tower');
