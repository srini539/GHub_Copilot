// Game Variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameActive = false;
let gamePaused = false;
let gameSpeed = 100; // milliseconds

// DOM Elements
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

// Initialize
highScoreDisplay.textContent = highScore;

// Event Listeners
document.addEventListener('keydown', handleKeyPress);
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
resetBtn.addEventListener('click', resetGame);

function handleKeyPress(e) {
    const key = e.key.toLowerCase();
    
    if (['arrowup', 'w'].includes(key) && direction.y === 0) {
        nextDirection = { x: 0, y: -1 };
        e.preventDefault();
    } else if (['arrowdown', 's'].includes(key) && direction.y === 0) {
        nextDirection = { x: 0, y: 1 };
        e.preventDefault();
    } else if (['arrowleft', 'a'].includes(key) && direction.x === 0) {
        nextDirection = { x: -1, y: 0 };
        e.preventDefault();
    } else if (['arrowright', 'd'].includes(key) && direction.x === 0) {
        nextDirection = { x: 1, y: 0 };
        e.preventDefault();
    }
}

function startGame() {
    if (!gameActive) {
        gameActive = true;
        gamePaused = false;
        startBtn.textContent = 'Restart';
        pauseBtn.textContent = 'Pause';
        gameLoop();
    }
}

function togglePause() {
    if (gameActive) {
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
        if (!gamePaused) {
            gameLoop();
        }
    }
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    gameActive = false;
    gamePaused = false;
    scoreDisplay.textContent = score;
    startBtn.textContent = 'Start Game';
    pauseBtn.textContent = 'Pause';
    generateFood();
    draw();
}

function generateFood() {
    let newFood;
    let foodOnSnake = true;
    
    while (foodOnSnake) {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        foodOnSnake = snake.some(segment => 
            segment.x === newFood.x && segment.y === newFood.y
        );
    }
    
    food = newFood;
}

function update() {
    if (gamePaused || !gameActive) return;
    
    // Update direction
    direction = nextDirection;
    
    // Calculate new head
    const head = snake[0];
    const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
    };
    
    // Check wall collision
    if (newHead.x < 0 || newHead.x >= tileCount || 
        newHead.y < 0 || newHead.y >= tileCount) {
        endGame();
        return;
    }
    
    // Check self collision
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        endGame();
        return;
    }
    
    snake.unshift(newHead);
    
    // Check food collision
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;
        generateFood();
        
        // Increase speed slightly as score increases
        gameSpeed = Math.max(50, 100 - Math.floor(score / 50));
    } else {
        snake.pop();
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    ctx.fillStyle = '#0f0';
    snake.forEach(segment => {
        ctx.fillRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
    });
    
    // Draw snake head in different color
    if (snake.length > 0) {
        ctx.fillStyle = '#00ff00';
        const head = snake[0];
        ctx.fillRect(
            head.x * gridSize + 1,
            head.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
    }
    
    // Draw food
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Draw grid (optional - for visual clarity)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

function endGame() {
    gameActive = false;
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreDisplay.textContent = highScore;
    }
    
    alert(`Game Over! Final Score: ${score}\nHigh Score: ${highScore}`);
    startBtn.textContent = 'Start Game';
}

function gameLoop() {
    if (!gamePaused && gameActive) {
        update();
        draw();
        setTimeout(gameLoop, gameSpeed);
    } else if (gameActive && gamePaused) {
        draw();
    }
}

// Initial draw
draw();
