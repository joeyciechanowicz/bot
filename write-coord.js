const robot = require('robotjs');

const writeColor = () => {
	const mouse = robot.getMousePos();
	console.log(`${mouse.x}, ${mouse.y}`);
};
setInterval(writeColor, 1000);
