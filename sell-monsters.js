// press down four times

const robot = require("robotjs");
const config = require('./config');

runSimpleBot = (positions) => {
  positions.forEach((poss) => {
    const x = poss.x + config.offsets.x;
    const y = poss.y + config.offsets.y;

    const hex = robot.getPixelColor(x, y);
    if (hex === poss.hex) {
      robot.moveMouse(x, y);
      robot.mouseClick();
    }
  });
};

const location = (x, y, hex) => ({x: x, y: y, hex: hex});

const brown = '734a11';
const firstX = 420;
const diff = 105;
const firstY = 272;
runSimpleBot([
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

