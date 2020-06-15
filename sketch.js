var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var canvas = document.getElementById("sketch");
canvas.width = windowWidth;
canvas.height = windowHeight;
var ctx = canvas.getContext("2d");

/*	Blocks:
 *	1 = sand
 *  2 = stone
 *  3 = dirt
 *  4 = water
 *  5 = lava
 */
var currentBlock = 1;

var particleSize = 10;
var rows = Math.ceil(windowHeight / particleSize);
var columns = Math.ceil(windowWidth / particleSize);

var grid = [];
for(let i = 0; i < rows*columns; i++)
	grid.push(0);

window.requestAnimationFrame(draw);