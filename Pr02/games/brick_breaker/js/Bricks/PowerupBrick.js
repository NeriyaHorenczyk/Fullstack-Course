import { Brick } from './Brick.js';

export class PowerupBrick extends Brick {
    constructor(opts) {
        if (!opts.powerup) {
            throw new Error('PowerupBrick requires a powerup');
        }
        super(opts);
    }
}
