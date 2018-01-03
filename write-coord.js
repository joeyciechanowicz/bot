const robot = require('robotjs');

const writeColor = () => {
	const mouse = robot.getMousePos();
	const hex = robot.getPixelColor(mouse.x, mouse.y);
	console.log(`#${hex}, ${mouse.x}, ${mouse.y}`);
};
setInterval(writeColor, 1000);
