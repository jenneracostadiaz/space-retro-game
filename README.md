# Retro Space Game

A beautiful retro-style space shooter game built with HTML5 Canvas and JavaScript, featuring stunning visual effects and classic arcade gameplay.

## Features

- **Retro Aesthetic**: Beautiful neon-style graphics with green, orange, and yellow color scheme (no purple!)
- **Smooth Gameplay**: 60 FPS canvas-based rendering with particle effects
- **Classic Controls**: Arrow keys for movement, spacebar to shoot
- **Progressive Difficulty**: Enemies spawn faster as you advance through levels
- **Visual Effects**: 
  - Glowing neon borders and text
  - Animated starfield background
  - Explosion particle effects
  - Retro scanline overlay
- **Responsive Design**: Adapts to different screen sizes

## How to Play

1. **Movement**: Use arrow keys (↑↓←→) to move your ship
2. **Shooting**: Press spacebar to fire bullets at enemies
3. **Objective**: Destroy enemies to earn points and avoid collision
4. **Lives**: You start with 3 lives - lose one when hit by an enemy
5. **Levels**: Advance levels every 1000 points for increased difficulty

## Getting Started

### Prerequisites

- Modern web browser with HTML5 Canvas support
- Python 3.x (for running local server)

### Running the Game

1. **Clone or download** this project to your local machine

2. **Start a local server**:
   ```bash
   python -m http.server 8000
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

4. **Click "START GAME"** and enjoy!

### Alternative Servers

If you don't have Python, you can use:

- **Node.js**: `npx http-server`
- **PHP**: `php -S localhost:8000`
- **VS Code**: Install "Live Server" extension

## Project Structure

```
best-mode/
├── index.html          # Main HTML file
├── styles.css          # Retro-themed CSS styles
├── game.js            # Game logic and mechanics
└── README.md          # This file
```

## Game Architecture

### Classes

- **RetroSpaceGame**: Main game controller
- **Player**: Player ship with movement and shooting
- **Enemy**: AI-controlled enemy ships
- **Bullet**: Projectile physics
- **Particle**: Explosion and visual effects

### Game States

- `menu`: Initial state with start button
- `playing`: Active gameplay
- `paused`: Game paused
- `gameOver`: End game state

## Customization

### Colors
The game uses a carefully chosen retro palette:
- **Primary**: Neon Green (#00FF41)
- **Secondary**: Orange (#FF6B35) 
- **Accent**: Yellow (#FFD60A)
- **Background**: Dark Blue Gradient

### Difficulty
Modify these values in `game.js`:
- `enemySpawnRate`: Controls enemy frequency
- `player.speed`: Player movement speed
- `enemy.speed`: Enemy movement speed

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

## Performance

- Optimized for 60 FPS gameplay
- Efficient collision detection
- Particle system with lifecycle management
- Canvas rendering optimizations

## Future Enhancements

- Power-ups and special weapons
- Multiple enemy types
- Background music and sound effects
- High score persistence
- Mobile touch controls

## License

This project is open source and available under the MIT License.

---

**Enjoy your retro gaming experience! 🚀**
