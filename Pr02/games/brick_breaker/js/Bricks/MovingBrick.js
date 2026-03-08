// @ts-check
import { Brick } from './Brick.js';
import Vector from '../../../../js/engine/Vector.js';
import { BrickBreakerGameEngine } from '../BrickBreakerGameEngine.js';

export class MovingBrick extends Brick {
    /**
     * @param {object} opts
     * @param {number} opts.x
     * @param {number} opts.y
     * @param {number} opts.width
     * @param {number} opts.height
     * @param {string} opts.color
     * @param {number} [opts.health=1]
     * @param {Vector} [opts.velocity]
     */
    constructor(opts) {
        super(opts);
        this.velocity = opts.velocity ?? new Vector(1, 0);
    }

    /**
     * @param {number} df - Delta frames
     * @param {BrickBreakerGameEngine} gameEngine
     */
    update(df, gameEngine) {
        this.position.x += this.velocity.x * df;
        // Bounce off walls
        if (this.position.x <= 0 || this.position.x + this.size.x >= gameEngine.canvas.width) {
            this.velocity.x *= -1;
        }
    }
}
