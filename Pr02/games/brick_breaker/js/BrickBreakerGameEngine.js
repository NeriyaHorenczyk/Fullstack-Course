// @ts-check
import { fetchCurrentUserData, storeCurrentUserData } from '../../../js/auth/userdata.js';
import { AssetLoader } from '../../../js/engine/AssetLoader.js';
import { GameEngine } from '../../../js/engine/GameEngine.js';
import { Ball } from './Ball.js';
import { Brick } from './Brick.js';
import { Paddle } from './Paddle.js';

export class BrickBreakerGameEngine extends GameEngine {
    /**
     *
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
        super(canvas);
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameOver = false;
        const userData = fetchCurrentUserData() || {};
        this.highScore = userData.highScore || 0;
        this.levelCleared = false;
        /** @type {Ball} */
        this.ball;
        /** @type {Paddle} */
        this.paddle;
        this.assets = new AssetLoader('games/brick_breaker/assets/');
    }

    async initEngine() {
        // Load sprites and sounds
        await this.assets.load({
            big_paddle_powerup: {
                url: 'sprite1.png',
                scale: 0.1,
            },
        });
        await super.initEngine();
        this.generateLevel();
    }

    /**
     * Registers the ball entity in the game engine.
     * @param {Ball} ball
     */
    registerBall(ball) {
        this.ball = ball;
        this.addEntity(ball);
    }

    /**
     * Registers the paddle entity in the game engine.
     * @param {Paddle} paddle
     */
    registerPaddle(paddle) {
        this.paddle = paddle;
        this.addEntity(paddle);
    }

    reset() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameOver = false;
        this.levelCleared = false;
        this.entities.forEach((entity) => {
            if (entity.type === 'Brick') this.removeEntity(entity);
        });
        this.paddle.reset();
        this.ball.reset();
        this.generateLevel();
    }

    advanceLevel() {
        const ball = this.entities.find((e) => e instanceof Ball);
        const paddle = this.entities.find((e) => e instanceof Paddle);
        ball?.attachToPaddle(paddle);
        this.level += 1;
        this.addScore(500); // Bonus for clearing level
        this.generateLevel();
        this.levelCleared = false;
    }

    /**
     * Adds points to the score and updates high score if needed.
     * @param {number} points
     */
    addScore(points) {
        this.score += points;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            const userData = fetchCurrentUserData() || {};
            userData.brickBreaker ||= {};
            userData.brickBreaker.highScore = this.highScore;
            storeCurrentUserData(userData);
        }
    }

    /**
     * Overrides base update to add game-specific logic.
     * @param {number} deltaFrames
     */
    update(deltaFrames) {
        // Check if level cleared
        const bricksRemaining = this.entities.some((e) => e instanceof Brick && e.health > 0);
        if (!bricksRemaining) {
            this.levelCleared = true;
        }

        // Check for game over
        if (this.lives <= 0) {
            this.gameOver = true;
        }

        super.update(deltaFrames);
    }

    /**
     * Generates a procedural level based on the current level number.
     */
    generateLevel() {
        const levelIndex = this.level;
        // 1. Difficulty Scaling
        // As levels get higher, add more rows and potential brick density
        const rows = Math.min(5 + Math.floor(levelIndex / 2), 12);
        const cols = 8 + (levelIndex % 2); // Alternate between 8 and 9 cols

        const padding = 10;
        const width = (this.canvas.width - (cols + 1) * padding) / cols;
        const height = 25;
        const topOffset = 60;

        // 2. Select a Pattern Generator based on level index
        const patternType = levelIndex % 5;
        /** @type {number[][]} */
        let map = [];

        switch (patternType) {
            case 0:
                map = patterns.classic(rows, cols);
                break;
            case 1:
                map = patterns.checkerboard(rows, cols);
                break;
            case 2:
                map = patterns.diamond(rows, cols);
                break;
            case 3:
                map = patterns.sineWave(rows, cols);
                break;
            case 4:
                map = patterns.symmetricalRandom(rows, cols, 0.6);
                break;
        }

        // 3. Render the Map
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // Check our generated map if a brick exists here
                if (map[r][c] === 1) {
                    const x = padding + c * (width + padding);
                    const y = padding + r * (height + padding) + topOffset;

                    // Color Generation: HSL allows for nice programmatic gradients
                    // Hue shifts based on Row and Level
                    const hue = (levelIndex * 40 + r * 15) % 360;
                    const color = `hsl(${hue}, 70%, 50%)`;

                    // Health Calculation: Higher levels have tougher bricks
                    // (Assuming your Brick class accepts health)
                    const health = Math.random() < levelIndex * 0.1 ? 2 : 1;

                    const brick = new Brick(x, y, width, height, color, health);
                    this.addEntity(brick);
                }
            }
        }
    }
}

// --- Pattern Algorithms ---

/**
 * Collection of pattern generator functions.
 * Each function returns a 2D array representing brick placement.
 */
const patterns = {
    /**
     * Standard block
     * @param {number} rows
     * @param {number} cols
     * @returns {number[][]}
     */
    classic: (rows, cols) => {
        let map = [];
        for (let r = 0; r < rows; r++) {
            let row = [];
            for (let c = 0; c < cols; c++) row.push(1);
            map.push(row);
        }
        return map;
    },

    /**
     * A staggered checkerboard look
     * @param {number} rows
     * @param {number} cols
     * @returns {number[][]}
     */
    checkerboard: (rows, cols) => {
        let map = [];
        for (let r = 0; r < rows; r++) {
            let row = [];
            for (let c = 0; c < cols; c++) {
                // Use modulo to alternate
                row.push((r + c) % 2 === 0 ? 1 : 0);
            }
            map.push(row);
        }
        return map;
    },

    /**
     * Creates a diamond/pyramid shape using Manhattan Distance
     * @param {number} rows
     * @param {number} cols
     * @returns {number[][]}
     */
    diamond: (rows, cols) => {
        let map = [];
        const centerC = (cols - 1) / 2;
        const centerR = (rows - 1) / 2;

        for (let r = 0; r < rows; r++) {
            let row = [];
            for (let c = 0; c < cols; c++) {
                // Calculate distance from center
                const dist = Math.abs(r - centerR) + Math.abs(c - centerC);
                // Invert logic: if close to center, place brick
                row.push(dist < cols / 2 ? 1 : 0);
            }
            map.push(row);
        }
        return map;
    },

    /**
     * Uses a sine wave to create a wavy brick layout
     * @param {number} rows
     * @param {number} cols
     * @returns {number[][]}
     */
    sineWave: (rows, cols) => {
        let map = [];
        for (let r = 0; r < rows; r++) {
            let row = [];
            for (let c = 0; c < cols; c++) {
                // Normalize column to 0-PI range
                const normalized = (c / cols) * Math.PI * 2;
                const waveHeight = Math.sin(normalized) * (rows / 2) + rows / 2;

                // Fill bricks below the wave line
                row.push(r > waveHeight ? 1 : 0);
            }
            map.push(row);
        }
        return map;
    },

    /**
     * Generates a random left side, and mirrors it to the right
     * This looks designed/alien rather than just "random noise"
     * @param {number} rows
     * @param {number} cols
     * @param {number} density
     * @returns {number[][]}
     */
    symmetricalRandom: (rows, cols, density) => {
        let map = [];
        for (let r = 0; r < rows; r++) {
            let row = new Array(cols).fill(0);
            for (let c = 0; c < Math.ceil(cols / 2); c++) {
                const hasBrick = Math.random() < density ? 1 : 0;
                row[c] = hasBrick;
                // Mirror to the other side
                row[cols - 1 - c] = hasBrick;
            }
            map.push(row);
        }
        return map;
    },
};
