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
  1:location(478, 456, '734a11'),
  2: location(370, 459, '734a11'),
  3: location(265, 455, '734a11'),

};

runSimpleBot(positions);
