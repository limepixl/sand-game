var mouseClick = false;
var clientX, clientY;

function draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    grid = Iterate(grid, rows, columns).slice();
    
    // Mouse input
    if(mouseClick)
    {
        let currentPixelX = Math.floor(clientX / (windowWidth / columns));
        let currentPixelY = Math.floor(clientY / (windowHeight / rows));
        let currentIndex = currentPixelX + currentPixelY * columns;

        grid[currentIndex] = (!grid[currentIndex] ? currentBlock.valueOf() : grid[currentIndex]);
        if(currentPixelX - 1 >= 0)
        {
            grid[currentIndex - 1] = (!grid[currentIndex - 1] ? currentBlock.valueOf() : grid[currentIndex - 1]);
            grid[currentIndex - 1 + columns] = (!grid[currentIndex - 1 + columns] ? currentBlock.valueOf() : grid[currentIndex - 1 + columns]);
            grid[currentIndex - 1 - columns] = (!grid[currentIndex - 1 - columns] ? currentBlock.valueOf() : grid[currentIndex - 1 - columns]);
        }
        grid[currentIndex + columns] = (!grid[currentIndex + columns] ? currentBlock.valueOf() : grid[currentIndex + columns]);
        grid[currentIndex - columns] = (!grid[currentIndex - columns] ? currentBlock.valueOf() : grid[currentIndex - columns]);
        if(currentPixelX + 1 < columns)
        {
            grid[currentIndex + 1] = (!grid[currentIndex + 1] ? currentBlock.valueOf() : grid[currentIndex + 1]);
            grid[currentIndex + 1 + columns] = (!grid[currentIndex + 1 + columns] ? currentBlock.valueOf() : grid[currentIndex + 1 + columns]);
            grid[currentIndex + 1 - columns] = (!grid[currentIndex + 1 - columns] ? currentBlock.valueOf() : grid[currentIndex + 1 - columns]);
        }
    }

    // Keyboard input
    document.onkeypress = function(evt) 
    {
        evt = evt || window.event;
        let charCode = evt.keyCode || evt.which;
        let charStr = String.fromCharCode(charCode);

        switch(charStr)
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
    };
	
	let lastBlock = 0;
	for(let i = 0; i < rows; i++)
	for(let j = 0; j < columns; j++)
	{
		// Only update the color if block bolor is different than the last color
		if(lastBlock != grid[j + i * columns])
		switch(grid[j + i * columns])
		{
		case 1:
			ctx.fillStyle = '#FFF8AD';
			break;
		case 2:
			ctx.fillStyle = '#919190';
			break;
		case 3:
			ctx.fillStyle = '#594122';
			break;
		case 4:
			ctx.fillStyle = '#6AB5DE';
			break;
		case 5:
			ctx.fillStyle = '#F08000';
			break;
		default:
			continue;
		}

		if(grid[j + i * columns])
			ctx.fillRect(j * particleSize, i * particleSize, particleSize, particleSize);

		lastBlock = grid[j + i * columns];
    }
    
    window.requestAnimationFrame(draw);
}

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
				} 
				else if(j > 0 && grid[currentIndex + columns - 1] == 0)
				{
					tmp[currentIndex + columns - 1] = tmp[currentIndex];
					tmp[currentIndex] = 0;
				} 
				else if(j + 1 < columns && grid[currentIndex + columns + 1] == 0)
				{
					tmp[currentIndex + columns + 1] = tmp[currentIndex];
					tmp[currentIndex] = 0;
				}
				else if(grid[currentIndex + columns] == 4 || grid[currentIndex + columns] == 5)
				{
					let tmpVal = tmp[currentIndex + columns];
					tmp[currentIndex + columns] = tmp[currentIndex];
					tmp[currentIndex] = tmpVal;
				} 
				else if(j > 0 && grid[currentIndex + columns - 1] == 4 || grid[currentIndex + columns - 1] == 5)
				{
					let tmpVal = tmp[currentIndex + columns - 1];
					tmp[currentIndex + columns - 1] = tmp[currentIndex];
					tmp[currentIndex] = tmpVal;
				} 
				else if(j + 1 < columns && grid[currentIndex + columns + 1] == 4 || grid[currentIndex + columns + 1] == 5)
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
				} 
				else if(j > 0 && grid[currentIndex + columns - 1] == 0)
				{
					tmp[currentIndex + columns - 1] = tmp[currentIndex];
					tmp[currentIndex] = 0;
				} 
				else if(j + 1 < columns && grid[currentIndex + columns + 1] == 0)
				{
					tmp[currentIndex + columns + 1] = tmp[currentIndex];
					tmp[currentIndex] = 0;
				} 
				else if(j > 0 && 
						 (grid[currentIndex + columns] == 5 && grid[currentIndex] == 4) ||
						 (grid[currentIndex + columns] == 4 && grid[currentIndex] == 5))
				{
					tmp[currentIndex + columns] = 2;
					tmp[currentIndex] = 0;
				} 
				else if(j > 0 && 
						 (grid[currentIndex + columns - 1] == 5 && grid[currentIndex] == 4) ||
						 (grid[currentIndex + columns - 1] == 4 && grid[currentIndex] == 5))
				{
					tmp[currentIndex + columns - 1] = 2;
					tmp[currentIndex] = 0;
				} 
				else if(j > 0 && 
						(grid[currentIndex + columns + 1] == 5 && grid[currentIndex] == 4)  ||
						(grid[currentIndex + columns + 1] == 4 && grid[currentIndex] == 5))
				{
					tmp[currentIndex + columns + 1] = 2;
					tmp[currentIndex] = 0;
				}
            }

            // If either the left or right block is occupied, don't flow
            if(grid[currentIndex + 1] && grid[currentIndex - 1])
                break;

			// Pick random direction to flow in
            let dirs = [-3, -2, -1, 1, 2, 3];
            let dir = dirs[Math.floor(Math.random() * dirs.length)];
			if(j + dir >= 0 && j + dir < columns && grid[currentIndex + dir] == 0 && tmp[currentIndex + dir] == 0)
			{
				tmp[currentIndex + dir] = tmp[currentIndex];
				tmp[currentIndex] = 0;
			}
			break;
		default:
			continue;
		};
	}

	return tmp;
}