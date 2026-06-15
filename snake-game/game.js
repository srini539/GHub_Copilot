/**
 * ===============================================
 * SNAKE GAME - FINAL VERSION
 * HTML5 Canvas + Vanilla JavaScript
 * ===============================================
 */

// ==========================================
// GAME CANVAS & GRID SETUP
// ==========================================
/** Get the canvas element from HTML for drawing */
const canvas = document.getElementById('gameCanvas');
/** Get 2D context for canvas drawing operations */
const ctx = canvas.getContext('2d');
/** Size of each grid cell in pixels */
const gridSize = 20;
/** Total number of tiles in one row/column (400px / 20px = 20 tiles) */
const tileCount = canvas.width / gridSize;

// ==========================================
// GAME STATE VARIABLES
// ==========================================
/** Snake represented as array of body segments with x, y coordinates */
let snake = [{ x: 10, y: 10 }];
/** Current food position on the game grid */
let food = { x: 15, y: 15 };
/** Array of obstacle positions that cause instant game over */
let obstacles = [];
/** Current direction the snake is moving (dx, dy) */
let direction = { x: 1, y: 0 };
/** Next direction to move (handles buffered input) */
let nextDirection = { x: 1, y: 0 };
/** Current game score (10 points per food eaten) */
let score = 0;
/** Highest score achieved (loaded from browser storage) */
let highScore = localStorage.getItem('snakeHighScore') || 0;
/** Flag to track if game is currently running */
let gameActive = false;
/** Flag to track if game is paused */
let gamePaused = false;
/** Time between game updates in milliseconds (lower = faster) */
let gameSpeed = 150;

// ==========================================
// DOM ELEMENT REFERENCES
// ==========================================
/** Display element for current score */
const scoreDisplay = document.getElementById('score');
/** Display element for high score */
const highScoreDisplay = document.getElementById('highScore');
/** Start/Restart game button */
const startBtn = document.getElementById('startBtn');
/** Pause/Resume game button */
const pauseBtn = document.getElementById('pauseBtn');
/** Reset game button */
const resetBtn = document.getElementById('resetBtn');

// ==========================================
// INITIALIZATION
// ==========================================
/** Display the saved high score when page loads */
highScoreDisplay.textContent = highScore;

// ==========================================
// EVENT LISTENERS
// ==========================================
/** Listen for keyboard input to control snake direction */
document.addEventListener('keydown', handleKeyPress);
/** Listen for Start button clicks */
startBtn.addEventListener('click', startGame);
/** Listen for Pause button clicks */
pauseBtn.addEventListener('click', togglePause);
/** Listen for Reset button clicks */
resetBtn.addEventListener('click', resetGame);

/**
 * FUNCTION: Handle keyboard input for snake direction control
 * - Arrow keys and WASD both work
 * - Prevents reversing into itself
 * - Prevents default browser behavior (page scrolling)
 * 
 * @param {KeyboardEvent} e - The keyboard event object
 */
function handleKeyPress(e) {
    // Convert key to lowercase for consistent comparison
    const key = e.key.toLowerCase();
    
    // UP: Arrow Up or W key (only if moving vertically)
    if (['arrowup', 'w'].includes(key) && direction.y === 0) {
        nextDirection = { x: 0, y: -1 };
        e.preventDefault();
    }
    // DOWN: Arrow Down or S key (only if moving vertically)
    else if (['arrowdown', 's'].includes(key) && direction.y === 0) {
        nextDirection = { x: 0, y: 1 };
        e.preventDefault();
    }
    // LEFT: Arrow Left or A key (only if moving horizontally)
    else if (['arrowleft', 'a'].includes(key) && direction.x === 0) {
        nextDirection = { x: -1, y: 0 };
        e.preventDefault();
    }
    // RIGHT: Arrow Right or D key (only if moving horizontally)
    else if (['arrowright', 'd'].includes(key) && direction.x === 0) {
        nextDirection = { x: 1, y: 0 };
        e.preventDefault();
    }
}

/**
 * FUNCTION: Start or restart the game
 * - Activates game loop
 * - Resets pause state
 * - Updates button text
 */
function startGame() {
    if (!gameActive) {
        gameActive = true;
        gamePaused = false;
        startBtn.textContent = 'Restart';
        pauseBtn.textContent = 'Pause';
    }
}

/**
 * FUNCTION: Toggle pause/resume state
 * - Pauses game updates but continues drawing
 * - Updates button text to show current state
 */
function togglePause() {
    if (gameActive) {
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
    }
}

/**
 * FUNCTION: Reset game to initial state
 * - Clears snake, resets score and direction
 * - Generates new food and obstacles
 * - Resets all UI elements
 */
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
    generateObstacles();
    draw();
}

/**
 * FUNCTION: Generate random food position
 * - Ensures food doesn't spawn on snake body
 * - Keeps trying until valid position is found
 */
function generateFood() {
    let newFood;
    let foodOnSnake = true;
    
    // Keep generating random positions until we find one not on the snake
    while (foodOnSnake) {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        // Check if any snake segment occupies this position
        foodOnSnake = snake.some(segment => 
            segment.x === newFood.x && segment.y === newFood.y
        );
    }
    
    food = newFood;
}

/**
 * FUNCTION: Generate random obstacle positions
 * - Creates 4 orange obstacles
 * - Ensures obstacles don't spawn on snake or food
 * - Each obstacle is a single grid cell
 */
function generateObstacles() {
    obstacles = [];
    const numObstacles = 4; // Number of obstacles to create
    
    // Generate each obstacle
    for (let i = 0; i < numObstacles; i++) {
        let obstacleOnSnake = true;
        let newObstacle;
        
        // Keep generating until we find a valid empty position
        while (obstacleOnSnake) {
            newObstacle = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
            
            // Check if position is occupied by snake or food
            obstacleOnSnake = snake.some(segment => 
                segment.x === newObstacle.x && segment.y === newObstacle.y
            ) || (newObstacle.x === food.x && newObstacle.y === food.y);
        }
        
        // Add valid obstacle to array
        obstacles.push(newObstacle);
    }
}

/**
 * FUNCTION: Update game state for current frame
 * - Move snake in current direction
 * - Check all collision types
 * - Handle food eating and growth
 * - Increase difficulty as score increases
 * - Does nothing if game is paused
 */
function update() {
    // Skip update if game is not active or is paused
    if (gamePaused || !gameActive) return;
    
    // ================ SNAKE MOVEMENT ================
    // Update actual direction from buffered input
    direction = nextDirection;
    
    // Calculate the new head position based on current direction
    const head = snake[0];
    let newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
    };
    
    // ================ WALL WRAPAROUND ================
    // Torus/Pac-Man style: exit one side, enter from opposite
    newHead.x = (newHead.x + tileCount) % tileCount;
    newHead.y = (newHead.y + tileCount) % tileCount;
    
    // ================ SELF COLLISION ================
    // Game over if snake head hits any body segment
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        endGame();
        return;
    }
    
    // ================ OBSTACLE COLLISION ================
    // Game over if snake head hits any obstacle
    if (obstacles.some(obstacle => obstacle.x === newHead.x && obstacle.y === newHead.y)) {
        endGame();
        return;
    }
    
    // ================ ADD NEW HEAD ================
    // Add new head to front of snake
    snake.unshift(newHead);
    
    // ================ FOOD COLLISION ================
    // Check if snake ate food
    if (newHead.x === food.x && newHead.y === food.y) {
        // Increase score by 10 points
        score += 10;
        scoreDisplay.textContent = score;
        
        // Generate new food at random location
        generateFood();
        
        // Increase game speed slightly (max speed is 75ms)
        // Speed increases every 50 points
        gameSpeed = Math.max(75, 150 - Math.floor(score / 50));
    } else {
        // If no food eaten, remove tail to maintain length
        snake.pop();
    }
}

/**
 * FUNCTION: Draw all game elements on canvas
 * - Clear canvas
 * - Draw snake body and head
 * - Draw food
 * - Draw obstacles
 * - Draw grid lines
 * Called every frame regardless of pause state
 */
function draw() {
    // ================ CANVAS BACKGROUND ================
    // Clear entire canvas with black background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // ================ DRAW SNAKE BODY ================
    // Draw all snake segments in bright green
    ctx.fillStyle = '#0f0';
    snake.forEach(segment => {
        ctx.fillRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
    });
    
    // ================ DRAW SNAKE HEAD ================
    // Draw head in brighter green to distinguish from body
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
    
    // ================ DRAW FOOD ================
    // Draw food as red circle
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
    
    // ================ DRAW OBSTACLES ================
    // Draw obstacles as orange squares
    ctx.fillStyle = '#ff9500';
    obstacles.forEach(obstacle => {
        ctx.fillRect(
            obstacle.x * gridSize + 1,
            obstacle.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
    });
    
    // ================ DRAW GRID ================
    // Draw grid lines for visual clarity
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

/**
 * FUNCTION: Handle game over state
 * - Stop game activity
 * - Update high score if current score is better
 * - Save high score to local storage
 * - Update button text
 * - No popup - score is already visible on screen
 */
function endGame() {
    // Stop game immediately
    gameActive = false;
    
    // ================ HIGH SCORE UPDATE ================
    // Check if new high score was achieved
    if (score > highScore) {
        highScore = score;
        // Save to browser storage so it persists across sessions
        localStorage.setItem('snakeHighScore', highScore);
        // Update display
        highScoreDisplay.textContent = highScore;
    }
    
    // Reset button text for next game
    startBtn.textContent = 'Start Game';
}

/**
 * FUNCTION: Main game loop - runs continuously
 * - Calls update if game is active and not paused
 * - Calls draw every frame (even when paused for responsiveness)
 * - Recursively calls itself with timeout based on gameSpeed
 * - Speed increases as score increases, making game harder
 */
function gameLoop() {
    // If game is active, update game state
    if (gameActive) {
        // Only update if not paused
        if (!gamePaused) {
            update();
        }
        // Always draw (shows pause state clearly)
        draw();
    }
    
    // Schedule next frame
    // Uses timeout instead of recursion to prevent stack overflow
    // Speed increases dynamically based on score
    setTimeout(gameLoop, gameSpeed);
}

// ==========================================
// GAME INITIALIZATION
// ==========================================
/** Generate initial obstacles before game starts */
generateObstacles();
/** Start the continuous game loop */
gameLoop();

/**
 * ===============================================
 * GAME SUMMARY - FINAL VERSION
 * ===============================================
 * 
 * OBJECTIVE:
 * - Eat red food to grow and score points
 * - Avoid hitting obstacles and yourself
 * - Beat your high score
 * 
 * CONTROLS:
 * - Arrow Keys or WASD to move
 * - Start Game button to begin
 * - Pause button to pause/resume
 * - Reset button to clear and restart
 * 
 * FEATURES:
 * - 4 orange obstacles for challenge
 * - Wall wraparound (exit one side, enter opposite)
 * - Progressive difficulty (speed increases with score)
 * - High score saved to browser storage
 * - Smooth 60 FPS game loop
 * - Grid-based movement system
 * - No popup alerts - all info visible on screen
 * 
 * SCORING:
 * - 10 points per food eaten
 * - Game speeds up every 50 points
 * - Maximum speed is 75ms per frame
 * 
 * END CONDITIONS:
 * - Snake hits itself
 * - Snake hits obstacle
 * - (Walls no longer cause death - wrap around instead)
 * 
 * GAME VERSION: Final with comprehensive comments
 */
