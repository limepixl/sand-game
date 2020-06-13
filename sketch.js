var particleSize = 10;
var rows, columns;
var grid;

const blocks = 
{
	SAND: 1,
	STONE: 2,
	DIRT: 3,
	WATER: 4,
	LAVA: 5
};
var currentBlock;

function Iterate(grid, rows, columns)
{
	let tmp = grid.slice();
	for(let i = 0; i < rows; i++)
	for(let j = 0; j < columns; j++)
	{
		let currentIndex = j + i * columns;

		switch(grid[currentIndex])
		{
		// Sand and Dirt
		case 1:
		case 3:
			if(i + 1 < rows)
			{
				if(grid[currentIndex + columns] == 0)
				{
					tmp[currentIndex + columns] = tmp[currentIndex];
					tmp[currentIndex] = 0;
				} else if(j > 0 && grid[currentIndex + columns - 1] == 0)
				{
					tmp[currentIndex + columns - 1] = tmp[currentIndex];
					tmp[currentIndex] = 0;
				} else if(j + 1 < columns && grid[currentIndex + columns + 1] == 0)
				{
					tmp[currentIndex + columns + 1] = tmp[currentIndex];
					tmp[currentIndex] = 0;
				}
				else if(grid[currentIndex + columns] == 4 || grid[currentIndex + columns] == 5)
				{
					let tmpVal = tmp[currentIndex + columns];
					tmp[currentIndex + columns] = tmp[currentIndex];
					tmp[currentIndex] = tmpVal;
				} else if(grid[currentIndex + columns - 1] == 4 || grid[currentIndex + columns - 1] == 5)
				{
					let tmpVal = tmp[currentIndex + columns - 1];
					tmp[currentIndex + columns - 1] = tmp[currentIndex];
					tmp[currentIndex] = tmpVal;
				} else if(grid[currentIndex + columns + 1] == 4 || grid[currentIndex + columns + 1] == 5)
				{
					let tmpVal = tmp[currentIndex + columns + 1];
					tmp[currentIndex + columns + 1] = tmp[currentIndex];
					tmp[currentIndex] = tmpVal;
				}
			}
			break;
		// Water and Lava
		case 4:
		case 5:
			if(i + 1 < rows)
			{
				if(grid[currentIndex + columns] == 0)
				{
					tmp[currentIndex + columns] = tmp[currentIndex];
					tmp[currentIndex] = 0;
				} else if(j > 0 && grid[currentIndex + columns - 1] == 0)
				{
					tmp[currentIndex + columns - 1] = tmp[currentIndex];
					tmp[currentIndex] = 0;
				} else if(j + 1 < columns && grid[currentIndex + columns + 1] == 0)
				{
					tmp[currentIndex + columns + 1] = tmp[currentIndex];
					tmp[currentIndex] = 0;
				} else if(j > 0 && 
						 (grid[currentIndex + columns] == 5 && grid[currentIndex] == 4) ||
						 (grid[currentIndex + columns] == 4 && grid[currentIndex] == 5))
				{
					tmp[currentIndex + columns] = 2;
					tmp[currentIndex] = 0;
				} else if(j > 0 && 
						 (grid[currentIndex + columns - 1] == 5 && grid[currentIndex] == 4) ||
						 (grid[currentIndex + columns - 1] == 4 && grid[currentIndex] == 5))
				{
					tmp[currentIndex + columns - 1] = 2;
					tmp[currentIndex] = 0;
				} else if(j > 0 && 
						(grid[currentIndex + columns + 1] == 5 && grid[currentIndex] == 4)  ||
						(grid[currentIndex + columns + 1] == 4 && grid[currentIndex] == 5))
				{
					tmp[currentIndex + columns + 1] = 2;
					tmp[currentIndex] = 0;
				}
			}
			// Pick random direction to flow in
			let dirs = [-2, -1, 1, 2];
			let dir = dirs[Math.floor(Math.random() * dirs.length)];
			if(j + dir >= 0 && j + dir < columns && grid[currentIndex + dir] == 0 && tmp[currentIndex + dir] == 0)
			{
				tmp[currentIndex + dir] = tmp[currentIndex];
				tmp[currentIndex] = 0;
			}
		};
	}

	return tmp;
}

function setup() 
{
	createCanvas(windowWidth, windowHeight);
	cursor(CROSS);

	rows = Math.ceil(windowHeight / particleSize);
	columns = Math.ceil(windowWidth / particleSize);
	grid = [rows * columns];
	for(let i = 0; i < rows*columns; i++)
		grid[i] = 0;

	currentBlock = blocks.SAND;
}

function draw()
{
	background(255);

	grid = Iterate(grid, rows, columns).slice();

	if(mouseIsPressed)
	{
		let currentPixelX = Math.floor(mouseX / (windowWidth / columns));
		let currentPixelY = Math.floor(mouseY / (windowHeight / rows));
		grid[currentPixelX + currentPixelY * columns] = currentBlock.valueOf();
		if(currentPixelX - 1 >= 0)
		{
			grid[currentPixelX - 1 + currentPixelY * columns] = currentBlock.valueOf();
			grid[currentPixelX - 1 + (currentPixelY + 1) * columns] = currentBlock.valueOf();
			grid[currentPixelX - 1 + (currentPixelY - 1) * columns] = currentBlock.valueOf();
		}
		grid[currentPixelX + (currentPixelY + 1) * columns] = currentBlock.valueOf();
		grid[currentPixelX + (currentPixelY - 1) * columns] = currentBlock.valueOf();
		if(currentPixelX + 1 < columns)
		{
			grid[currentPixelX + 1 + currentPixelY * columns] = currentBlock.valueOf();
			grid[currentPixelX + 1 + (currentPixelY + 1) * columns] = currentBlock.valueOf();
			grid[currentPixelX + 1 + (currentPixelY - 1) * columns] = currentBlock.valueOf();
		}
	}

	if(keyIsPressed)
	{
		switch(key)
		{
		case '1':
			currentBlock = blocks.SAND;
			break;
		case '2':
			currentBlock = blocks.STONE;
			break;
		case '3':
			currentBlock = blocks.DIRT;
			break;
		case '4':
			currentBlock = blocks.WATER;
			break;
		case '5':
			currentBlock = blocks.LAVA;
			break;
		default:
		}
	}
	
	noStroke();
	for(let i = 0; i < rows; i++)
	for(let j = 0; j < columns; j++)
	{
		switch(grid[j + i * columns])
		{
		case 1:
			fill(255, 248, 173);
			break;
		case 2:
			fill(145, 145, 144);
			break;
		case 3:
			fill(89, 65, 34);
			break;
		case 4:
			fill(106, 181, 222);
			break;
		case 5:
			fill(240, 128, 0);
			break;
		default:
			continue;
		}

		if(grid[j + i * columns])
			rect(j * particleSize, i * particleSize, particleSize, particleSize);

	}
}