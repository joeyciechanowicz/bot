const robot = require('robotjs');
const config = require('./config');

const writeColor = () => {
	try {
    const mouse = robot.getMousePos();
    const hex = robot.getPixelColor(mouse.x, mouse.y);
    const x = (mouse.x - config.offsets.topLeft.x) / (config.offsets.bottomRight.x - config.offsets.topLeft.x);
    const y = (mouse.y - config.offsets.topLeft.y) / (config.offsets.bottomRight.y - config.offsets.topLeft.y);

    console.log(`location(${x}, ${y}, '${hex}')`);
  } catch (e) {}
};
setInterval(writeColor, 1000);
