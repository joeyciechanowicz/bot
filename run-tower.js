// press down four times

const bot = require('./bot');

//#2c94e5 at x:500 y:452
const positions = {
	startTower: {
    x: 649,
    y: 686,
    hex: '48a115'
  },
  useAbility1: {
    x: 550,
    y: 718,
    hex: '98e228'
  },
  useAbility2: {
    x: 473,
    y: 720,
    hex: 'a2e62b'
  },
  acceptLoot: {
    x: 599,
    y: 739,
    hex: 'd54e1f'
  },
  enterCatacombs: {
    x: 500,
    y: 452,
    hex: '2c94e5'
  },
  acceptDefeat: {
    x: 605,
    y: 627,
    hex: '2c94e5'
  },
  enterTower: {
    x: 450,
    y: 636,
    hex: 'd54e1f'
  }
};
//d54e1f at x:450 y:636

bot.runSimpleBot(positions);

