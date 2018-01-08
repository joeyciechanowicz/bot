// press down three times
// 1152 x 786

const robot = require("robotjs");
const config = require("./config");

runSimpleBot = (positions) => {
  setInterval(() => {
    Object.keys(positions).forEach(key => {
      const poss = positions[key];
      const x = poss.x + config.offsets.x;
      const y = poss.y + config.offsets.y;

      const hex = robot.getPixelColor(x, y);
      if (hex === poss.hex) {
        robot.moveMouse(x, y);
        robot.mouseClick();
      }
    });
  }, config.interval);
};

const location = (x, y, hex) => ({x: x, y: y, hex: hex});

const positions = {
  banditLord: location(686, 309, 'ffffff'),
  extreme: location(659, 262, '0091e6'),
  toBattle: location(460, 483, 'ffffff'),
  withoutParty: location(502, 351, '0091e6'),
  ability: location(393, 557, 'ffffff'),
  loot: location(432, 552, 'dc4e10')
};

runSimpleBot(positions);

