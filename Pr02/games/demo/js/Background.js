// @ts-check
import { Entity } from '../../../js/engine/Entity.js';
import { GameEngine } from '../../../js/engine/GameEngine.js';
import Vector from '../../../js/engine/Vector.js';

export default class Wallpaper extends Entity {
	type = 'wallpaper';
	STATIC_ON_SCREEN = true;
	NO_COLLISION = true;
	PARALLAX_FACTOR = 1;

	// Doodle jump grid background
	constructor() {
		super();
		this.baseColor = '#F0E9DF';
		this.gridColor = '#EBAC04';
		this.cellSize = 10;
		this.relativeOffset = new Vector(0, 0);
	}

	/**
	 * @param {number} deltaFrames
	 * @param {GameEngine} gameEngine
	 */
	update(deltaFrames, gameEngine) {
		// Update relative offset based on game offset to create parallax effect
		this.relativeOffset = gameEngine.gameOffset;
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	render(ctx) {
		// Undo the game offset for wallpaper rendering
		// Draw background
		ctx.fillStyle = this.baseColor;
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		// Draw grid
		ctx.strokeStyle = this.gridColor;
		ctx.lineWidth = 1;
		ctx.globalAlpha = 0.5;

		for (let x = this.cellSize; x < ctx.canvas.width; x += this.cellSize) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, ctx.canvas.height);
			ctx.stroke();
		}

		for (let y = this.cellSize; y < ctx.canvas.height; y += this.cellSize) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(ctx.canvas.width, y);
			ctx.stroke();
		}

		// Draw a line at the Y threshold
		ctx.globalAlpha = 1;
		ctx.strokeStyle = 'blue';
		ctx.beginPath();
		ctx.moveTo(0, 0.25 * ctx.canvas.height);
		ctx.lineTo(ctx.canvas.width, 0.25 * ctx.canvas.height);
		ctx.stroke();
	}
}
