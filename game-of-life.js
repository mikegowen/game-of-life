const canvasSketch = require('canvas-sketch');

const settings = {
  animate: true,
  dimensions: [ 600, 600 ],
  fps: 24,
  playbackRate: 'throttle',
};

// Start the sketch
canvasSketch(() => {
  const gridSize = 200;
  const initialOrganisms = 12000;

  let grid = new Array(gridSize).fill(null).map(() => new Array(gridSize).fill('black'));

  populateOrganisms(grid, initialOrganisms);

  function populateOrganisms(grid, quantity) {
    // console.log('Populating organisms')
    for (let i = 0; i < quantity; i++) {
      grid[Math.round(random(0, gridSize - 1))][Math.round(random(0, gridSize - 1))] = 'white';
    }
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  return ({ context, width, height }) => {

    var scaleFactor = window.devicePixelRatio || 1;
    var rect = context.canvas.getBoundingClientRect();
    context.canvas.width = rect.width * scaleFactor;
    context.canvas.height = rect.height * scaleFactor;
    context.scale(scaleFactor, scaleFactor);
    const cellSize = width / gridSize;

    // Prepare next state based on current state.
    let nextGrid = grid.map(row => [...row]);

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const topLeft = row > 0 && col > 0 ? grid[row - 1][col - 1] : 'black';
          const top = row > 0 ? grid[row - 1][col] : 'black';
          const topRight = row > 0 && col < gridSize - 1 ? grid[row - 1][col + 1] : 'black';
          const left = col > 0 ? grid[row][col - 1] : 'black';
          const right = col < gridSize - 1 ? grid[row][col + 1] : 'black';
          const bottomLeft = row < gridSize - 1 && col > 0 ? grid[row + 1][col - 1] : 'black';
          const bottom = row < gridSize - 1 ? grid[row + 1][col] : 'black';
          const bottomRight = row < gridSize - 1 && col < gridSize - 1 ? grid[row + 1][col + 1] : 'black';


          const neighbors = [topLeft, top, topRight, left, right, bottomLeft, bottom, bottomRight];

          const livingNeighbors = neighbors.filter(neighbor => neighbor === 'white').length;

          if (livingNeighbors < 2 || livingNeighbors > 3) {
            // console.log('Dying');
            nextGrid[row][col] = 'black';
          }

          if (livingNeighbors === 3) {
            // console.log('Aliving');
            nextGrid[row][col] = 'white';
          }
        }
    }

    // Update grid with next state.
    grid = nextGrid;

    // Render the grid.
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        context.fillStyle = grid[row][col];
        context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }

    drawGridLines(gridSize, cellSize, width, height, "#252525", context);

    // console.log('Running');

  };

  function drawGridLines(gridSize, cellSize, width, height, lineColor, context) {
    context.strokeStyle = lineColor;

    for (let i = 0; i <= gridSize; i++) {
      context.beginPath();
      context.moveTo(i * cellSize, 0);
      context.lineTo(i * cellSize, height);
      context.lineWidth = 1;
      context.stroke();
      context.beginPath();
      context.moveTo(0, i * cellSize);
      context.lineTo(width, i * cellSize);
      context.stroke();
    }
  }
}, settings);
