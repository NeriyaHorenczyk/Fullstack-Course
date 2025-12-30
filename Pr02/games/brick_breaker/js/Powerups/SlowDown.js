// @ts-check
import BasePowerup from './BasePowerup.js';
import { BrickBreakerGameEngine } from '../BrickBreakerGameEngine.js';
import { FloatingTextEntity } from '../FloatingTextEntity.js';

/**
 * Power-up that grants an extra life when collected.
 * @extends {BasePowerup}
 */
export default class SlowDownPowerup extends BasePowerup {
    /**
     * @param {number} x
     * @param {number} y
     * @param {ImageBitmap} sprite
     */
    constructor(x, y, sprite) {
        super('SlowDown', x, y, 2, sprite);
        this.magnitude = 0.8; // 20% speed decrease
    }

    /**
     * Applies the big paddle effect when collected.
     * @param {BrickBreakerGameEngine} gameEngine
     */
    activatePowerup(gameEngine) {
        super.activatePowerup(gameEngine);
        const newSpeed = gameEngine.ball.velocity.scale(this.magnitude);
        gameEngine.ball.velocity = newSpeed;
        gameEngine.ball.speed = gameEngine.ball.speed * this.magnitude;
        gameEngine.assets.getAudio('slow_down_sound').play();
        gameEngine.addEntity(
            new FloatingTextEntity('S L O W E R', this.position.x + this.size.x / 2, this.position.y, {
                lifetimeFrames: 120,
                pixelsPerFrame: 0.1,
            })
        );
    }
}
