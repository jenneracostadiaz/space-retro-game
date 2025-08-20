// Retro Space Game - JavaScript Implementation
class RetroSpaceGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        
        // Game entities
        this.player = null;
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.stars = [];
        
        // Game stats
        this.score = 0;
        this.lives = 5;
        this.level = 1;
        this.enemySpawnRate = 0.005;
        this.lastTime = 0;
        
        // Input handling
        this.keys = {};
        this.mouse = { x: 0, y: 0, isDown: false };
        this.setupEventListeners();
        this.initializeGame();
        this.createStarfield();
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.gameState === 'playing') {
                    this.player.shoot();
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Left mouse button
                this.mouse.isDown = true;
                if (this.gameState === 'playing') {
                    this.player.shoot();
                }
                e.preventDefault();
            }
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) { // Left mouse button
                this.mouse.isDown = false;
            }
        });
        
        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Button events
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartGame();
        });
    }
    
    initializeGame() {
        this.player = new Player(this.canvas.width / 2, this.canvas.height - 50, this);
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.score = 0;
        this.lives = 5;
        this.level = 1;
        this.updateUI();
    }
    
    createStarfield() {
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 2 + 0.5,
                size: Math.random() * 2 + 1
            });
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'inline-block';
        this.gameLoop();
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseBtn').textContent = 'RESUME';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseBtn').textContent = 'PAUSE';
            this.gameLoop();
        }
    }
    
    restartGame() {
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('pauseBtn').style.display = 'none';
        this.gameState = 'menu';
        this.initializeGame();
    }
    
    gameLoop(currentTime = 0) {
        if (this.gameState !== 'playing') return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        // Update player
        this.player.update();
        
        // Update bullets
        this.bullets.forEach((bullet, index) => {
            bullet.update();
            if (bullet.y < 0) {
                this.bullets.splice(index, 1);
            }
        });
        
        // Update enemies
        this.enemies.forEach((enemy, index) => {
            enemy.update();
            if (enemy.y > this.canvas.height) {
                this.enemies.splice(index, 1);
                this.lives--;
                this.updateUI();
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        });
        
        // Update particles
        this.particles.forEach((particle, index) => {
            particle.update();
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
        
        // Update starfield
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
        });
        
        // Spawn enemies
        if (Math.random() < this.enemySpawnRate) {
            this.spawnEnemy();
        }
        
        // Check collisions
        this.checkCollisions();
        
        // Level progression
        if (this.score > 0 && this.score % 2000 === 0 && this.score !== this.lastLevelScore) {
            this.level++;
            this.enemySpawnRate += 0.003;
            this.lastLevelScore = this.score;
            this.updateUI();
        }
    }
    
    spawnEnemy() {
        const x = Math.random() * (this.canvas.width - 40);
        this.enemies.push(new Enemy(x, -30, this));
    }
    
    checkCollisions() {
        // Bullet-enemy collisions
        this.bullets.forEach((bullet, bulletIndex) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (this.collision(bullet, enemy)) {
                    // Create explosion particles
                    this.createExplosion(enemy.x, enemy.y, '#FF6B35');
                    
                    // Remove bullet and enemy
                    this.bullets.splice(bulletIndex, 1);
                    this.enemies.splice(enemyIndex, 1);
                    
                    // Increase score
                    this.score += 100;
                    this.updateUI();
                }
            });
        });
        
        // Player-enemy collisions
        this.enemies.forEach((enemy, index) => {
            if (this.collision(this.player, enemy)) {
                this.createExplosion(enemy.x, enemy.y, '#FF6B35');
                this.enemies.splice(index, 1);
                this.lives--;
                this.updateUI();
                
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        });
    }
    
    collision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    createExplosion(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000814';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw starfield
        this.ctx.fillStyle = '#FFFFFF';
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw game entities
        this.player.draw();
        this.bullets.forEach(bullet => bullet.draw());
        this.enemies.forEach(enemy => enemy.draw());
        this.particles.forEach(particle => particle.draw());
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'block';
        document.getElementById('pauseBtn').style.display = 'none';
    }
}

class Player {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 30;
        this.speed = 6;
        this.game = game;
        this.shootCooldown = 0;
        this.mouseControlled = false;
    }
    
    update() {
        // Check if mouse is being used for control
        if (this.game.mouse.x > 0 || this.game.mouse.y > 0) {
            this.mouseControlled = true;
        }
        
        if (this.mouseControlled) {
            // Mouse movement - smooth following
            const targetX = this.game.mouse.x - this.width / 2;
            const targetY = this.game.mouse.y - this.height / 2;
            
            // Smooth movement towards mouse position
            const dx = targetX - this.x;
            const dy = targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5) { // Only move if mouse is far enough away
                const moveX = (dx / distance) * this.speed;
                const moveY = (dy / distance) * this.speed;
                
                this.x += moveX;
                this.y += moveY;
            }
            
            // Keep player within canvas bounds
            this.x = Math.max(0, Math.min(this.game.canvas.width - this.width, this.x));
            this.y = Math.max(0, Math.min(this.game.canvas.height - this.height, this.y));
            
            // Auto-shoot when mouse is held down
            if (this.game.mouse.isDown) {
                this.shoot();
            }
        } else {
            // Keyboard movement (fallback)
            if (this.game.keys['ArrowLeft'] && this.x > 0) {
                this.x -= this.speed;
            }
            if (this.game.keys['ArrowRight'] && this.x < this.game.canvas.width - this.width) {
                this.x += this.speed;
            }
            if (this.game.keys['ArrowUp'] && this.y > 0) {
                this.y -= this.speed;
            }
            if (this.game.keys['ArrowDown'] && this.y < this.game.canvas.height - this.height) {
                this.y += this.speed;
            }
        }
        
        // Reduce shoot cooldown
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
    }
    
    shoot() {
        if (this.shootCooldown <= 0) {
            this.game.bullets.push(new Bullet(this.x + this.width / 2, this.y, -8));
            this.shootCooldown = 6;
        }
    }
    
    draw() {
        const ctx = this.game.ctx;
        
        // Draw player ship with retro style
        ctx.fillStyle = '#00FF41';
        ctx.fillRect(this.x + this.width / 2 - 2, this.y, 4, this.height);
        
        // Wings
        ctx.fillStyle = '#FFD60A';
        ctx.fillRect(this.x, this.y + this.height / 2, this.width, 8);
        
        // Cockpit
        ctx.fillStyle = '#FF6B35';
        ctx.fillRect(this.x + this.width / 2 - 6, this.y + 5, 12, 15);
        
        // Engine glow
        ctx.fillStyle = '#00FF41';
        ctx.shadowColor = '#00FF41';
        ctx.shadowBlur = 10;
        ctx.fillRect(this.x + 5, this.y + this.height, 8, 6);
        ctx.fillRect(this.x + this.width - 13, this.y + this.height, 8, 6);
        ctx.shadowBlur = 0;
    }
}

class Enemy {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 25;
        this.speed = 1 + Math.random() * 1.5;
        this.game = game;
    }
    
    update() {
        this.y += this.speed;
    }
    
    draw() {
        const ctx = this.game.ctx;
        
        // Draw enemy ship
        ctx.fillStyle = '#FF6B35';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Enemy details
        ctx.fillStyle = '#FFD60A';
        ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, 5);
        
        // Weapons
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x + 2, this.y + this.height - 5, 4, 8);
        ctx.fillRect(this.x + this.width - 6, this.y + this.height - 5, 4, 8);
    }
}

class Bullet {
    constructor(x, y, speedY) {
        this.x = x;
        this.y = y;
        this.width = 3;
        this.height = 10;
        this.speedY = speedY;
    }
    
    update() {
        this.y += this.speedY;
    }
    
    draw() {
        const ctx = game.ctx;
        ctx.fillStyle = '#00FF41';
        ctx.shadowColor = '#00FF41';
        ctx.shadowBlur = 5;
        ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.speedX = (Math.random() - 0.5) * 6;
        this.speedY = (Math.random() - 0.5) * 6;
        this.life = 30;
        this.maxLife = 30;
        this.color = color;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        this.speedX *= 0.98;
        this.speedY *= 0.98;
    }
    
    draw() {
        const ctx = game.ctx;
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 3, 3);
        ctx.globalAlpha = 1;
    }
}

// Initialize the game when page loads
let game;
window.addEventListener('load', () => {
    game = new RetroSpaceGame();
});
