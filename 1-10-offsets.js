// press down four times

const robot = require("robotjs");
const config = require('./config');

runSimpleBot = (positions) => {
  setInterval(() => {
    Object.keys(positions).forEach(key => {
      const poss = positions[key];
      const x = config.offsets.x + poss.x;
      const y = config.offsets.y + poss.y;

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
  banditLord: location(688, 307, 'ffffff'),
  difficulty: location(618, 256, '0091e6'),
  toBattle: location(463, 481, 'ffffff'),
  proceedWithoutParty: location(497, 349, '0091e6'),
  useAbility: location(413, 535, 'a7ee10'),
  useAbility2: location(381, 547, '8fc800'),
  acceptLoot: location(440, 551, 'dc4e10'),
  // dailyReward: asdfasdfsadf,
  // closePopup: asdfasdfsadf,
  // closeNewsPopup: asdfasdfsadf,
  // acceptStones: asdfasdfsadf,
  // acceptStones2: asdfasdfsadf,
};

runSimpleBot(positions);

