# Snake Game 🐍

A classic Snake game built with HTML5 Canvas and Vanilla JavaScript. Play in your browser and try to achieve the highest score!

## Features

- 🎮 **Classic Gameplay** - Eat food to grow and avoid hitting walls or yourself
- 🧱 **Obstacles** - Navigate around 4 orange obstacles placed randomly on the map
- 📊 **Score Tracking** - Keeps track of your current score and high score (saved in localStorage)
- ⚡ **Progressive Difficulty** - Game speeds up as your score increases
- 🎨 **Responsive Design** - Works on desktop and mobile devices
- ⏸️ **Pause/Resume** - Pause the game at any time
- 🎯 **Smooth Controls** - Use arrow keys or WASD to move
- 🔄 **Wall Wraparound** - Exit one side and enter from the opposite side

## How to Play

1. **Open** `index.html` in your web browser
2. **Click "Start Game"** to begin
3. **Use Arrow Keys** or **WASD** to move the snake
4. **Eat the red food** to grow and earn points (10 points per food)
5. **Avoid hitting:**
   - Your own tail
   - Orange obstacles (instant game over)
   - Note: You can pass through walls and wrap around to the other side
6. **Navigate obstacles** strategically to reach the food
7. **Try to beat your high score!**

## Project Structure

```
snake-game/
├── index.html      # Main HTML file
├── style.css       # Game styling and layout
├── game.js         # Game logic and mechanics
└── README.md       # This file
```

## Files Description

### `index.html`
- Main HTML structure
- Canvas element for game rendering
- Control buttons (Start, Pause, Reset)
- Game instructions display

### `style.css`
- Gradient background styling
- Canvas and button styling
- Responsive design for mobile devices
- Smooth animations and transitions

### `game.js`
- Snake and food objects
- Game loop and update logic
- Collision detection (walls and self)
- Input handling (keyboard controls)
- Score management with localStorage
- Progressive difficulty system

## Game Mechanics

- **Snake Movement**: Snake moves continuously in the last pressed direction
- **Food**: Appears randomly on the grid (never on the snake or obstacles)
- **Obstacles**: 4 orange obstacles are randomly placed at the start (instant game over if touched)
- **Collision**: Game ends if snake hits itself or obstacles
- **Wall Wraparound**: Exit one side and enter from the opposite side
- **Growth**: Snake grows when eating food
- **Speed**: Game speed increases every 50 points
- **High Score**: Automatically saved to browser storage

## Controls

| Action | Key |
|--------|-----|
| Move Up | ⬆️ Arrow or W |
| Move Down | ⬇️ Arrow or S |
| Move Left | ⬅️ Arrow or A |
| Move Right | ➡️ Arrow or D |
| Start/Restart | Click "Start Game" |
| Pause/Resume | Click "Pause" |
| Reset Game | Click "Reset" |

## Technologies Used

- **HTML5** - Canvas API for rendering
- **CSS3** - Styling and responsive design
- **Vanilla JavaScript** - Game logic and interactions
- **LocalStorage** - High score persistence

## Getting Started

1. Clone this repository:
```bash
git clone https://github.com/srini539/snake-game.git
cd snake-game
```

2. Open the game:
```bash
# Simply open index.html in your browser
# Or use a local server:
python -m http.server 8000
# Then visit http://localhost:8000
```

## Tips & Tricks

- 💡 Plan ahead - anticipate where the food will appear
- 🎯 Try to keep the snake in a pattern to avoid collisions
- ⚡ The game gets progressively faster, so practice to improve
- 💾 Your high score is saved automatically!

## Future Enhancements

- [ ] Different difficulty levels
- [ ] Power-ups (speed boost, shield)
- [ ] Obstacles on the map
- [ ] Multiplayer mode
- [ ] Sound effects
- [ ] Different game modes
- [ ] Leaderboard

## License

This project is open source and available under the MIT License.

## Author

Created by srini539

---

**Enjoy the game! 🎮**
