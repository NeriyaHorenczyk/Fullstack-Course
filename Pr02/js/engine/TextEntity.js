// @ts-check
import { Entity } from './Entity.js';
import { GameEngine } from './GameEngine.js';

export default class TextEntity extends Entity {
    STATIC_ON_SCREEN = true;
    type = 'text';
    /**
     * @param {string} text
     * @param {number} x
     * @param {number} y
     */
    constructor(text, x, y) {
        super();
        this.text = text;
        this.x = x;
        this.y = y;
    }
    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.x, this.y);
    }
}
