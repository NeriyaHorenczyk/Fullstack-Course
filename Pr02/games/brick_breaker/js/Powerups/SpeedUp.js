// @ts-check
import BasePowerup from './BasePowerup.js';
import { BrickBreakerGameEngine } from '../BrickBreakerGameEngine.js';
import { FloatingTextEntity } from '../FloatingTextEntity.js';

/**
 * Power-up that grants an extra life when collected.
 * @extends {BasePowerup}
 */
export default class SpeedUpPowerup extends BasePowerup {
    /**
     * @param {number} x
     * @param {number} y
     * @param {ImageBitmap} sprite
     */
    constructor(x, y, sprite) {
        super('SpeedUp', x, y, 2, sprite);
        this.magnitude = 1.2; // 20% speed increase
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
        gameEngine.assets.getAudio('speed_up_sound').play();
        gameEngine.addEntity(
            new FloatingTextEntity('FASTER!!', this.position.x + this.size.x / 2, this.position.y, {
                lifetimeFrames: 50,
                pixelsPerFrame: 1.0,
            })
        );
    }
}
