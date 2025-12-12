// @ts-check
import { Entity } from '../../../js/engine/Entity.js';
import { GameEngine } from '../../../js/engine/GameEngine.js';
import Vector from '../../../js/engine/Vector.js';

export default class Header extends Entity {
	NO_COLLISION = true;
	STATIC_ON_SCREEN = true;
	// Doodle jump grid background
	constructor() {
		super();
		this.score = 0;
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	render(ctx) {
		// Undo the game offset for wallpaper rendering
		ctx.save();

		// Draw the header bar with the score
		ctx.globalAlpha = 0.4;
		ctx.fillStyle = '#6799BF';

		ctx.fillRect(0, 0, ctx.canvas.width, 40);
		ctx.fillStyle = '#000000';
		ctx.font = '24px Arial';
		ctx.globalAlpha = 1;
		ctx.fillText(`Score: ${this.score}`, 20, 28);

		// Draw a shadow under the header
		ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
		ctx.fillRect(0, 40, ctx.canvas.width, 5);

		ctx.restore();
	}
}
