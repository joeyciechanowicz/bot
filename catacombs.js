// press down four times

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

const location = (x, y, hex) => {
  return {
    x: x,
    y: y,
    hex: hex
  };
};

//#fbcd29 at x:625 y:661
const positions = {
  // enter: location(727, 466, '5fd520'),
  // toBattle: location(479, 465, '5fd520'),
  // enterWithoutFullParty: location(489, 348, '2c94e5'),
  ability1: location(453, 559, '70a217'),
  ability2: location(380, 540, 'a1db24'),
  acceptLoot: location(440, 552, 'd54e1f'),

};

// e82e2b at x:268 y:218

runSimpleBot(positions);

