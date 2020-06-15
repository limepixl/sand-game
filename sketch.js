var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var canvas = document.getElementById("sketch");
canvas.width = windowWidth;
canvas.height = windowHeight;
var ctx = canvas.getContext("2d");

const blocks = 
{
	SAND: 1,
	STONE: 2,
	DIRT: 3,
	WATER: 4,
	LAVA: 5
};
var currentBlock = blocks.SAND;

var particleSize = 10;
var rows = Math.ceil(windowHeight / particleSize);
var columns = Math.ceil(windowWidth / particleSize);

var grid = [];
for(let i = 0; i < rows*columns; i++)
	grid.push(0);

window.requestAnimationFrame(draw);