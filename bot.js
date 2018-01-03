const robot = require("robotjs");

module.exports.runSimpleBot = (positions) => {
  setInterval(() => {
    Object.keys(positions).forEach(key => {
      const poss = positions[key];
      const hex = robot.getPixelColor(poss.x, poss.y);
      if (hex === poss.hex) {
        robot.moveMouse(poss.x, poss.y);
        robot.mouseClick();
      }
    });
  }, 250);
};
