var canvas = document.getElementById('snakegame');
var context = canvas.getContext('2d');


var grid = 16;
var count = 0;

var snake = {
  x: 160,
  y: 160,

  
  dx: grid,
  dy: 0,

  
  cells: [],

  maxCells: 4
};

var food = {
  x: 320,
  y: 320
};


function getRandomInt(min, max) {
  return Math.floor(randomNumber() * (max - min)) + min;
}


function loop() {
  requestAnimationFrame(loop);

  
  if (++count < 4) {
    return;
  }

  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);

  
  snake.x += snake.dx;
  snake.y += snake.dy;

  
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  
  snake.cells.unshift({x: snake.x, y: snake.y});

  
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  
  context.fillStyle = 'red';
  context.fillRect(food.x, food.y, grid-1, grid-1);

  
  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {

   
    context.fillRect(cell.x, cell.y, grid-1, grid-1);

    
    if (cell.x === food.x && cell.y === food.y) {
      snake.maxCells++;

      
      food.x = getRandomInt(0, 25) * grid;
      food.y = getRandomInt(0, 25) * grid;
    }

    
    for (var i = index + 1; i < snake.cells.length; i++) {

      
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;

        food.x = getRandomInt(0, 25) * grid;
        food.y = getRandomInt(0, 25) * grid;
      }
    }
  });
}


document.addEventListener('keydown', function(e) {


  
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }

  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});


requestAnimationFrame(loop);

function createSnakegame(){
  $("#Arcade").hide();
  $("#snakegamebody").show();
}

function hideSnakegame(){
  $("#Arcade").show();
  $("#snakegamebody").hide();
}
