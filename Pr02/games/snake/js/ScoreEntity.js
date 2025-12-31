import { Entity } from '../../../js/engine/Entity.js';

export default class ScoreEntity extends Entity {
    type = 'score';
    constructor() {
        super();
        this.score = 0;
    }

    update(deltaFrames, engine) {
        this.score = engine.score;
    }

    render(ctx) {
        ctx.fillStyle = 'black';
        ctx.font = '20px "Press Start 2P"';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${this.score}`, 10, 30);
    }
}
