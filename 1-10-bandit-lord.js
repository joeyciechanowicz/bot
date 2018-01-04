// press down four times

const robot = require("robotjs");

runSimpleBot = (positions) => {
  setInterval(() => {
    Object.keys(positions).forEach(key => {
      const poss = positions[key];
      const x = poss.x;
      const y = poss.y;

      const hex = robot.getPixelColor(x, y);
      if (hex === poss.hex) {
        robot.moveMouse(x, y);
        robot.mouseClick();
      }
    });
  }, 100);
};

//#fbcd29 at x:625 y:661
const positions = {
	banditLord: {
		x: 858,
		y: 497,
		hex: 'ffffff'
	},
  difficulty: {
    x: 765,
    y: 445,
    hex: '2c94e5'
  },
  toBattle: {
    x: 621,
    y: 667,
    hex: 'ffffff'
  },
  proceedWithoutParty: {
    x: 662,
    y: 533,
    hex: '2c94e5'
  },
  useAbility: {
    x: 550,
    y: 736,
    hex: '8fc11e'
  },
  useAbilityFromDiffPoss: {
    x: 584,
    y: 716,
    hex: '9de62a'
  },
  acceptLoot: {
    x: 618,
    y: 737,
    hex: 'd54e1f'
  },
  dailyReward: {
    x: 625,
    y: 661,
    hex: 'fbcd29'
  },
  closePopup: {
    x: 218,
    y: 294,
    hex: 'ea2d2b'
  },
  closeNewsPopup: {
    x: 268,
    y: 218,
    hex: 'e82e2b'
  },
  acceptStones: {
    x: 721,
    y: 456,
    hex: 'd83134'
  },
  acceptStones2: {
    x: 567,
    y: 330,
    hex: '7d7e7d'
  },
};

// e82e2b at x:268 y:218

runSimpleBot(positions);

