const robot = require('robotjs');

const writeColor = () => {
	try {
    const mouse = robot.getMousePos();
    const hex = robot.getPixelColor(mouse.x, mouse.y);
    console.log(`${mouse.x}, ${mouse.y}, ${hex}`);
  } catch (e) {}
};
setInterval(writeColor, 1000);
