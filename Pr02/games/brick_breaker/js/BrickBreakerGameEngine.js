// @ts-check
import { fetchCurrentUserData, storeCurrentUserData } from '../../../js/auth/userdata.js';
import { AssetLoader } from '../../../js/engine/AssetLoader.js';
import { GameEngine } from '../../../js/engine/GameEngine.js';
import { Ball } from './Ball.js';
import BigPaddlePowerup from './Powerups/BigPaddlePowerup.js';
import { Brick } from './Bricks/Brick.js';
import OneUpPowerup from './Powerups/ExtraLifePowerup.js';
import { InvincibleBrick } from './Bricks/InvincibleBrick.js';
import { MovingBrick } from './Bricks/MovingBrick.js';
import { Paddle } from './Paddle.js';
import { PowerupBrick } from './Bricks/PowerupBrick.js';
import SpeedUpPowerup from './Powerups/SpeedUp.js';
import SlowDownPowerup from './Powerups/SlowDown.js';

export class BrickBreakerGameEngine extends GameEngine {
    /**
     *
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
        super(canvas);
        this.score = 0;
        this.lives = 3;
        this.level = 4;
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
            expand_paddle_sprite: {
                url: 'expand.png',
                scale: 0.1,
            },
            one_up_sprite: {
                url: 'one_up.png',
                scale: 0.1,
            },
            speed_up_sprite: {
                url: 'speed_up.png',
                scale: 0.05,
            },
            slow_down_sprite: {
                url: 'slow_down.png',
                scale: 0.05,
            },
            expand_paddle_sound: { url: 'expand.mp3' },
            speed_up_sound: { url: 'speed_up.mp3' },
            slow_down_sound: { url: 'slow_down.mp3' },
            brick_explode: { url: 'stone_smash.mp3' },
            one_up_sound: { url: 'oneup.ogg' },
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
        this.ball.attachToPaddle(this.paddle);
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
        const bricksRemaining = this.entities.some((e) => e instanceof Brick && e.health > 0 && e.requiredToClearLevel);
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
        const level = this.level;

        /* -----------------------------
           Difficulty & Layout Scaling
          ------------------------------ */
        const rows = Math.min(5 + Math.floor(level / 2), 12);
        const cols = 8 + (level % 2);

        const padding = 10;
        const height = 25;
        const width = (this.canvas.width - (cols + 1) * padding) / cols;
        const topOffset = 60;

        /* -----------------------------
            Pattern Selection
          ------------------------------ */
        const patternType = level % 5;
        const map = this.generatePattern(patternType, rows, cols);

        /* -----------------------------
            Feature Gates
          ------------------------------ */
        const allowInvincible = level >= 3;
        const allowAdvanced = level >= 4;

        /* -----------------------------
            Brick Placement
          ------------------------------ */
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (map[r][c] === 0) continue;

                const x = padding + c * (width + padding);
                const y = padding + r * (height + padding) + topOffset;

                const hue = (level * 40 + r * 15) % 360;
                const color = `hsl(${hue}, 70%, 50%)`;

                const brick = this.createBrick({
                    level,
                    allowInvincible,
                    allowAdvanced,
                    x,
                    y,
                    width,
                    height,
                    color,
                });

                this.addEntity(brick);
            }
        }
    }

    /**
     * Decides which type of brick to create based on level.
     * @param {{
     * level: number,
     * allowInvincible: boolean,
     * allowAdvanced: boolean,
     * x: number,
     * y: number,
     * width: number,
     * height: number,
     * color: string}} options
     * @returns {Brick}
     */
    createBrick({ level, allowInvincible, allowAdvanced, x, y, width, height, color }) {
        const roll = Math.random();

        /* -----------------------------
           Powerup Blocks (Level ≥ 2)
          ------------------------------ */
        if (level >= 2 /* && roll < 0.3 */) {
            return new PowerupBrick({
                x,
                y,
                width,
                height,
                color,
                health: this.randomHealth(level),
                powerup: this.randomPowerup(),
            });
        }

        /* -----------------------------
           Invincible Blocks (Level ≥ 3)
          ------------------------------ */
        if (allowInvincible && roll < 0.08) {
            return new InvincibleBrick({ x, y, width, height, color: '#666' });
        }

        /* -----------------------------
           Moving Blocks (Level ≥ 4)
          ------------------------------ */
        if (allowAdvanced && roll < 0.18) {
            return new MovingBrick({ x, y, width, height, color, health: this.randomHealth(level) });
        }

        /* -----------------------------
           Standard Random-Health Brick
          ------------------------------ */
        return new Brick({ x, y, width, height, color, health: this.randomHealth(level) });
    }

    /**
     * Returns a random health value based on level.
     * @param {number} level
     * @returns {number}
     */
    randomHealth(level) {
        return Math.floor(Math.random() * level) + 1;
    }

    randomPowerup() {
        const choices = [BigPaddlePowerup, OneUpPowerup, SpeedUpPowerup, SlowDownPowerup];
        const PowerupClass = choices[Math.floor(Math.random() * choices.length)];
        let spriteName;
        switch (PowerupClass) {
            case BigPaddlePowerup:
                spriteName = 'expand_paddle_sprite';
                break;
            case OneUpPowerup:
                spriteName = 'one_up_sprite';
                break;
            case SpeedUpPowerup:
                spriteName = 'speed_up_sprite';
                break;
            case SlowDownPowerup:
                spriteName = 'slow_down_sprite';
                break;
            default:
                spriteName = '';
        }
        return new PowerupClass(0, 0, this.assets.getImage(spriteName));
    }

    /**
     * Generates a brick pattern based on the selected type.
     * @param {number} type
     * @param {number} rows
     * @param {number} cols
     * @returns {number[][]} 2D array representing brick placement
     */
    generatePattern(type, rows, cols) {
        switch (type) {
            case 0:
                return patterns.classic(rows, cols);
            case 1:
                return patterns.checkerboard(rows, cols);
            case 2:
                return patterns.diamond(rows, cols);
            case 3:
                return patterns.sineWave(rows, cols);
            case 4:
                return patterns.symmetricalRandom(rows, cols, 0.6);
            default:
                return patterns.classic(rows, cols);
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
