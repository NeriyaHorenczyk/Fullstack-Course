import { BrickBreakerGameEngine } from './BrickBreakerGameEngine.js';
import { Paddle } from './Paddle.js';
import { Ball } from './Ball.js';
import { Brick } from './Brick.js';

let gameEngine;

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
            // Snap the paddle to the center
            /** @type {Ball} */
            const ball = gameEngine.entities.find((e) => e instanceof Ball);
            /** @type {Paddle} */
            const paddle = gameEngine.entities.find((e) => e instanceof Paddle);
            ball.attachToPaddle(paddle);
            gameEngine.level += 1;
            generateLevel(gameEngine);
            gameEngine.levelCleared = false;
        }
        ctx.restore();
    });

    gameEngine.start();
}

export function stopGame() {
    if (gameEngine) gameEngine.destroy();
    gameEngine = null;
}
