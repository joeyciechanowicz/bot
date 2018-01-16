// press down four times

const robot = require("robotjs");
const config = require('./config');

const delay = 75;

runSimpleBot = (positions) => {
  positions.forEach((poss, idx) => {

    setTimeout(() => {
      const x = poss.x + config.offsets.x;
      const y = poss.y + config.offsets.y;

      const hex = robot.getPixelColor(x, y);
      if (hex === poss.hex) {
        robot.moveMouse(x, y);
        robot.mouseClick();
      }
    }, idx * delay);
  });
};

const location = (x, y, hex) => ({x: x, y: y, hex: hex});

const brown = '734a11';
const firstX = 270;
const firstY = 282;
const diff = 105;
runSimpleBot([
  location(firstX, firstY, brown),
  location(firstX, firstY, brown),
  location(firstX + diff, firstY, brown),
  location(firstX + 2 * diff, firstY, brown),

  location(firstX, firstY + diff, brown),
  location(firstX + diff, firstY + diff, brown),
  location(firstX + 2 * diff, firstY + diff, brown),

  location(firstX, firstY + 2 * diff, brown),
  location(firstX + diff, firstY + 2 * diff, brown),
  location(firstX + 2 * diff, firstY + 2 * diff, brown),
]);

