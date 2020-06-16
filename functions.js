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

        grid[currentIndex] = (!grid[currentIndex] ? currentBlock : grid[currentIndex]);
        if(currentPixelX - 1 >= 0)
        {
            grid[currentIndex - 1] = (!grid[currentIndex - 1] ? currentBlock : grid[currentIndex - 1]);
            grid[currentIndex - 1 + columns] = (!grid[currentIndex - 1 + columns] ? currentBlock : grid[currentIndex - 1 + columns]);
            grid[currentIndex - 1 - columns] = (!grid[currentIndex - 1 - columns] ? currentBlock : grid[currentIndex - 1 - columns]);
        }
        grid[currentIndex + columns] = (!grid[currentIndex + columns] ? currentBlock : grid[currentIndex + columns]);
        grid[currentIndex - columns] = (!grid[currentIndex - columns] ? currentBlock : grid[currentIndex - columns]);
        if(currentPixelX + 1 < columns)
        {
            grid[currentIndex + 1] = (!grid[currentIndex + 1] ? currentBlock : grid[currentIndex + 1]);
            grid[currentIndex + 1 + columns] = (!grid[currentIndex + 1 + columns] ? currentBlock : grid[currentIndex + 1 + columns]);
            grid[currentIndex + 1 - columns] = (!grid[currentIndex + 1 - columns] ? currentBlock : grid[currentIndex + 1 - columns]);
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
	    	currentBlock = 1;
	    	break;
	    case '2':
	    	currentBlock = 2;
	    	break;
	    case '3':
	    	currentBlock = 3;
	    	break;
	    case '4':
	    	currentBlock = 4;
	    	break;
	    case '5':
	    	currentBlock = 5;
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
	let tmpVal;

	// Directions for flowing liquids
	let dirs = [-3, -2, -1, 1, 2, 3];
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
					tmpVal = tmp[currentIndex + columns];
					tmp[currentIndex + columns] = tmp[currentIndex];
					tmp[currentIndex] = tmpVal;
				} 
				else if(j > 0 && grid[currentIndex + columns - 1] == 4 || grid[currentIndex + columns - 1] == 5)
				{
					tmpVal = tmp[currentIndex + columns - 1];
					tmp[currentIndex + columns - 1] = tmp[currentIndex];
					tmp[currentIndex] = tmpVal;
				} 
				else if(j + 1 < columns && grid[currentIndex + columns + 1] == 4 || grid[currentIndex + columns + 1] == 5)
				{
					tmpVal = tmp[currentIndex + columns + 1];
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
			}

			for(let k = -1; k <= 1; k++)
			for(let l = 0; l <= 1; l++)
			if(!(k == 0 && l == 0))
			{
				if(j + k >= 0 && j + k < columns && i + l <= rows &&
				  ((grid[currentIndex] == 4 && grid[currentIndex + k + columns * l] == 5) ||
				   (grid[currentIndex] == 5 && grid[currentIndex + k + columns * l] == 4)))
				{
					tmp[currentIndex + k + columns * l] = 2;
					tmp[currentIndex] = 0;
				}
			}

            // If either the left or right block is occupied, don't flow
            if(grid[currentIndex + 1] && grid[currentIndex - 1])
                break;

			// Pick random direction to flow in
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