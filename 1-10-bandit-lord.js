// press down four times

const robot = require("robotjs");
const config = require('./config');

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
  }, 100);
};

const location = (x, y, hex) => ({x:x, y:y, hex:hex});

const positions = {
    banditLord: location(689, 308, 'ffffff'),
    extreme: location(664, 261, '2c94e5'),
    toBattle: location(461, 480, 'ffffff'),
    withoutParty: location(496, 350, '2c94e5'),
    useAbility: location(392, 554, 'ffffff'),
    acceptLoot: location(439, 555, 'd54e1f'),
    collectDailyReward: location(453, 476, 'fbcd29'),
    moveOnDailyReward: location(521, 262, 'd83134')
};

runSimpleBot(positions);

