// press down four times

const bot = require('./bot');

//#48a115 at x:649 y:686
const positions = {
	startCatacomb: {
		x: 649,
		y: 686,
		hex: '48a115'
	},
  proceedWithoutParty: {
    x: 662,
    y: 533,
    hex: '2c94e5'
  },
  useWizAbility: {
    x: 621,
    y: 717,
    hex: 'a1e72b'
  },
  useDMAbility: {
    x: 549,
    y: 741,
    hex: '86b81c'
  },
  acceptLoot: {
    x: 599,
    y: 739,
    hex: 'd54e1f'
  },
  enterCatacombs: {
    x: 898,
    y: 652,
    hex: '5fd520'
  },
  acceptDefeat: {
    x: 605,
    y: 627,
    hex: '2c94e5'
  }
};

bot.runSimpleBot(positions);

