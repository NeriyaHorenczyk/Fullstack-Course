import { Entity } from '../../../js/engine/Entity.js';
import Vector from '../../../js/engine/Vector.js';

export default class BackgroundEntity extends Entity {
    type = 'background';


    constructor() {
        super();
    }

    render(ctx, debug) {
        // Fill the background with light green color
        ctx.fillStyle = '#ccffcc';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Black border
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}
