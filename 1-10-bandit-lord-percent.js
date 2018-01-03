// press down four times

const robot = require("robotjs");
const config = require('./config');

function color_diff(colorA, colorB) {

  if (!colorA && !colorB) return;

  const _r = parseInt(colorA.substring(0,2), 16);
  const _g = parseInt(colorA.substring(2,4), 16);
  const _b = parseInt(colorA.substring(4,6), 16);

  const __r = parseInt(colorB.substring(0,2), 16);
  const __g = parseInt(colorB.substring(2,4), 16);
  const __b = parseInt(colorB.substring(4,6), 16);

  const p1 = (_r / 255) * 100;
  const p2 = (_g / 255) * 100;
  const p3 = (_b / 255) * 100;

  const perc1 = (p1 + p2 + p3) / 3;

  const _p1 = (__r / 255) * 100;
  const _p2 = (__g / 255) * 100;
  const _p3 = (__b / 255) * 100;

  const perc2 = (_p1 + _p2 + _p3) / 3;

  return Math.abs(perc1 - perc2);
}

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
      } else {
        const diff = color_diff(hex, poss.hex);
        if (diff < 10) {
          console.log(`Diff: ${diff}, Key: ${key}, ${hex} == ${poss.hex}`);
        } else {
          console.log(`Diff: ${diff}, Key: ${key}`);
        }
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

