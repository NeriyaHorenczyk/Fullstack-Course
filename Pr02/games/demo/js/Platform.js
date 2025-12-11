// @ts-check
import { Entity } from '../../../js/engine/Entity.js';
import Vector from '../../../js/engine/Vector.js';

export default class Platform extends Entity {
	type = 'platform';
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 */
	constructor(x, y, width, height) {
		super();
		this.position = new Vector(x, y);
		this.size = new Vector(width, height);
	}

	/**
	 * Renders the platform on the canvas.
	 * @param {CanvasRenderingContext2D} ctx
	 */
	render(ctx) {
		ctx.fillStyle = 'brown';
		ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
	}
}
