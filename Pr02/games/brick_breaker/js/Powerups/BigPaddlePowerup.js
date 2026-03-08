// @ts-check
import BasePowerup from './BasePowerup.js';
import { BrickBreakerGameEngine } from '../BrickBreakerGameEngine.js';

/**
 * Power-up that increases the paddle size when collected.
 * @extends {BasePowerup}
 */
export default class BigPaddlePowerup extends BasePowerup {
    /**
     * @param {number} x
     * @param {number} y
     * @param {ImageBitmap} sprite
     */
    constructor(x, y, sprite) {
        super('Big Paddle', x, y, 2, sprite);
    }

    /**
     * Applies the big paddle effect when collected.
     * @param {BrickBreakerGameEngine} gameEngine
     */
    activatePowerup(gameEngine) {
        super.activatePowerup(gameEngine);
        const paddle = gameEngine.paddle;
        gameEngine.assets.getAudio('expand_paddle_sound').play();
        paddle.size.x *= 1.5; // Increase paddle width by 50%
        // Set a timer to revert the effect after 15 seconds
        setTimeout(() => {
            paddle.size.x /= 1.5; // Revert paddle width
        }, 15000);
    }
}
