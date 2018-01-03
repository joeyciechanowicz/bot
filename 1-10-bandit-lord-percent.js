// press down four times

const robot = require("robotjs");
const config = require('./config');

runSimpleBot = (positions) => {
  setInterval(() => {
    Object.keys(positions).forEach(key => {
      const poss = positions[key];
      const x = config.offsets.topLeft.x + ((config.offsets.bottomRight.x - config.offsets.topLeft.x) * poss.x);
      const y = config.offsets.topLeft.y + ((config.offsets.bottomRight.y - config.offsets.topLeft.y) * poss.y);

      const hex = robot.getPixelColor(x, y);
      if (hex === poss.hex) {
        robot.moveMouse(x, y);
        robot.mouseClick();
      }
    });
  }, config.interval);
};


const location = (x, y, hex) => {
  return {
    hex: hex,
    x: x,
    y: y
  }
};

const positions = {
  banditLord: location(0.8625, 0.52, 'ffffff'),
  difficulty: location(0.7675, 0.42333333333333334, '2c94e5'),
  toBattle: location(0.5775, 0.8, 'ffffff'),
  proceedWithoutParty: location(0.60375, 0.5766666666666667, '2c94e5'),
  useAbility: location(0.51625, 0.8766666666666667, '98df28'),
  acceptLoot: location(0.545, 0.9216666666666666, 'd54e1f'),
  // dailyReward: asdfasdfsadf,
  // closePopup: asdfasdfsadf,
  // closeNewsPopup: asdfasdfsadf,
  // acceptStones: asdfasdfsadf,
  // acceptStones2: asdfasdfsadf,
};

runSimpleBot(positions);

