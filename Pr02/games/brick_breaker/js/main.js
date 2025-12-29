// @ts-check
import { BrickBreakerGameEngine } from './BrickBreakerGameEngine.js';
import { Paddle } from './Paddle.js';
import { Ball } from './Ball.js';

/** @type {BrickBreakerGameEngine} */
let gameEngine;

/**
 * Starts the Brick Breaker game on the given canvas.
 * @param {HTMLCanvasElement} canvas
 */
export function startGame(canvas) {
    if (gameEngine) gameEngine.destroy();
    gameEngine = new BrickBreakerGameEngine(canvas);

    // Create Entities
    const paddle = new Paddle(canvas.width / 2 - 50, canvas.height - 40);
    const ball = new Ball(canvas.width / 2, canvas.height - 60);

    // Add Entities
    gameEngine.addEntity(paddle);
    gameEngine.addEntity(ball);

    // Initalize engine
    gameEngine.reset();

    // Input handling for Ball Launch
    /** @type {(e: KeyboardEvent) => void} */
    const handleKeyDown = (e) => {
        if (e.code === 'Space') {
            if (gameEngine.gameOver) {
                // Restart the game
                gameEngine.reset();
                return;
            }
            if (ball.stuckToPaddle) ball.launch();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    gameEngine.registerCleanupCallback(() => {
        window.removeEventListener('keydown', handleKeyDown);
    });

    // Score and GUI overlay
    gameEngine.onTick(() => {
        const ctx = gameEngine.context;
        if (!ctx) return;
        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${gameEngine.score}`, 10, 30);
        ctx.fillText(`Lives: ${gameEngine.lives}`, 10, 60);
        ctx.fillText(`Level: ${gameEngine.level}`, canvas.width - 100, 30);
        ctx.fillText(`High Score: ${gameEngine.highScore}`, canvas.width - 200, 60);

        if (gameEngine.gameOver) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = '50px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
            ctx.font = '20px Arial';
            ctx.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 50);

            // Restart logic
            // (Only if space is pressed in game over state, maybe reusing the same listener or logic?)
        }

        if (gameEngine.levelCleared) {
            gameEngine.advanceLevel();
        }
        ctx.restore();
    });

    gameEngine.start();
}

export function stopGame() {
    if (gameEngine) gameEngine.destroy();
    // @ts-expect-error shh
    gameEngine = null;
}
