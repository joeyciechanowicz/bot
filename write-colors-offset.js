const robot = require('robotjs');

const topLeft = {
  x: 170,
	y: 188
};

const bottomRight = {
  x: 969,
	y: 788
};

const writeColor = () => {
	const mouse = robot.getMousePos();
	const hex = robot.getPixelColor(mouse.x, mouse.y);
	const x = (mouse.x - topLeft.x) / (bottomRight.x - topLeft.x);
	const y = (mouse.y - topLeft.y) / (bottomRight.y - topLeft.y);

	console.log(`${x}, ${y}, '${hex}'`);
};
setInterval(writeColor, 1000);
