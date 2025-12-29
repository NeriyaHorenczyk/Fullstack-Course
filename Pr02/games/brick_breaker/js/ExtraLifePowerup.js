// @ts-check
import BasePowerup from './BasePowerup.js';
import { BrickBreakerGameEngine } from './BrickBreakerGameEngine.js';
import { FloatingTextEntity } from './FloatingTextEntity.js';

/**
 * Power-up that grants an extra life when collected.
 * @extends {BasePowerup}
 */
export default class OneUpPowerup extends BasePowerup {
    /**
     * @param {number} x
     * @param {number} y
     * @param {ImageBitmap} sprite
     */
    constructor(x, y, sprite) {
        super('OneUp', x, y, 2, sprite);
    }

    /**
     * Applies the big paddle effect when collected.
     * @param {BrickBreakerGameEngine} gameEngine
     */
    activatePowerup(gameEngine) {
        super.activatePowerup(gameEngine);
        gameEngine.lives += 1; // Increase lives by 1
        gameEngine.assets.getAudio('one_up_sound').play();
        gameEngine.addEntity(
            new FloatingTextEntity('+1 Life', this.position.x + this.size.x / 2, this.position.y, {
                lifetimeFrames: 75,
                pixelsPerFrame: 0.6,
            })
        );
    }
}
