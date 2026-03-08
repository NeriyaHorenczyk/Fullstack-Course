// @ts-check
import { BrickBreakerGameEngine } from './BrickBreakerGameEngine.js';
import { Paddle } from './Paddle.js';
import { Ball } from './Ball.js';
import BGandHUD from './BGandHUD.js';

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

    // Add Entities
    gameEngine.addEntity(new BGandHUD(gameEngine));
    gameEngine.registerPaddle(new Paddle(canvas.width / 2 - 50, canvas.height - 40));
    gameEngine.registerBall(new Ball(canvas.width / 2, canvas.height - 60));

    // Input handling for Ball Launch
    /** @type {(e: KeyboardEvent) => void} */
    const handleKeyDown = (e) => {
        if (e.code === 'Space') {
            if (gameEngine.gameOver) {
                // Restart the game
                gameEngine.reset();
                return;
            }
            if (gameEngine.ball.stuckToPaddle) gameEngine.ball.launch();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    gameEngine.registerCleanupCallback(() => {
        window.removeEventListener('keydown', handleKeyDown);
    });

    gameEngine.onTick(() => {
        if (gameEngine.levelCleared) {
            gameEngine.advanceLevel();
        }
    });

    gameEngine.start();
}

export function stopGame() {
    if (gameEngine) gameEngine.destroy();
    // @ts-expect-error shh
    gameEngine = null;
}
