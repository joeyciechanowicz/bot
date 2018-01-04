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
		x: 687,
		y: 304,
		hex: 'ffffff'
	},
  difficulty: {
    x: 630,
    y: 254,
    hex: '1894e4'
  },
  toBattle: {
    x: 461,
    y: 483,
    hex: 'ffffff'
  },
  proceedWithoutParty: {
    x: 498,
    y: 351,
    hex: '1894e4'
  },
  useAbility: {
    x: 414,
    y: 533,
    hex: 'a6e631'
  },
  acceptLoot: {
    x: 426,
    y: 552,
    hex: 'da4f21'
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
  }
};

// e82e2b at x:268 y:218

runSimpleBot(positions);

