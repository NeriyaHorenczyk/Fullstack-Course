// @ts-check
import { Entity } from '../../../js/engine/Entity.js';
import Vector from '../../../js/engine/Vector.js';

export default class Platform extends Entity {
    type = 'platform';
    /**
     * @param {number} x
     * @param {number} y
     * @param {string} variant
     */
    constructor(x, y, variant) {
        super();
        this.position = new Vector(x, y);
        this.size = new Vector(60, 8);
        this.variant = variant;
    }

    /**
     * Renders the platform on the canvas.
     * @param {CanvasRenderingContext2D} ctx
     * @param {boolean} debug
     */
    render(ctx, debug) {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.roundRect(this.position.x, this.position.y, this.size.x, this.size.y, 5);
        ctx.fill();

        // Debug rendering, show platform bounds and position
        if (!debug) return;
        ctx.strokeStyle = 'red';
        ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
        ctx.fillStyle = 'black';
        ctx.font = '10px Arial';
        ctx.fillText(
            `(${this.position.x.toFixed(0)}, ${this.position.y.toFixed(0)})`,
            this.position.x,
            this.position.y - 5
        );
        ctx.fillText(`Size: (${this.size.x}, ${this.size.y})`, this.position.x, this.position.y + 20);
    }
}
