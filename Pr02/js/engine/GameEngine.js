// @ts-check
import TextEntity from '../../games/demo/js/TextEntity.js';
import { Entity } from './Entity.js';
import Vector from './Vector.js';

export class GameEngine {
	FPS_TARGET = 60;
	FRAME_TIME = 1000 / this.FPS_TARGET;

	/**
	 * @param {HTMLCanvasElement} canvas
	 * @param {boolean} debug
	 */
	constructor(canvas, debug = false) {
		this.canvas = canvas;
		this.debug = debug;
		this.context = canvas.getContext('2d');
		if (!this.context) throw new Error('Failed to get 2D context');

		/**
		 * @type {Entity[]}
		 */
		this.entities = [];
		this.running = false;
		this.lastUpdateTime = 0;
		this.deltaTime = 0;
		this.gameOffset = new Vector(0, 0);
		this.gameIsOver = false;

		/** @type {(() => void)[]} */
		this.tickCallbacks = [];
		// Bind once, so 'this' works in gameLoop
		this.gameLoop = this.gameLoop.bind(this);
		this.accumulator = 0; // Time accumulator for fixed timestep
	}

	/**
	 * Starts the game loop.
	 */
	start() {
		if (this.running) return;
		this.running = true;
		this.lastUpdateTime = performance.now();
		requestAnimationFrame(this.gameLoop);
	}

	/**
	 * Stops the game loop.
	 */
	stop() {
		this.running = false;
	}

	/**
	 * The main game loop.
	 * @param {number} timestamp
	 */
	gameLoop(timestamp) {
		if (!this.running) return;

		this.accumulator += timestamp - this.lastUpdateTime;
		this.lastUpdateTime = timestamp;

		while (this.accumulator >= this.FRAME_TIME) {
			this.update(1); // exactly one frame
			this.accumulator -= this.FRAME_TIME;
		}

		this.render();
		requestAnimationFrame(this.gameLoop);
		this.tickCallbacks.forEach((cb) => cb());
	}

	/**
	 * Registers a callback to be called on each tick.
	 * @param {() => void} callback
	 */
	onTick(callback) {
		this.tickCallbacks.push(callback);
	}

	/**
	 * Adds a game entity.
	 * @param {Entity} entity
	 */
	addEntity(entity) {
		this.entities.push(entity);
		entity.onAdd?.(this);
	}

	/**
	 * Removes a game entity.
	 * @param {*} entity
	 */
	removeEntity(entity) {
		const removedEntities = this.entities.filter((e) => e === entity);
		this.entities = this.entities.filter((e) => e !== entity);
		for (const removedEntity of removedEntities) {
			removedEntity.destroy?.(this);
		}
	}

	/**
	 * Updates all game entities.
	 * @param {number} deltaFrames
	 */
	update(deltaFrames) {
		// Update each entity
		for (const entity of this.entities) {
			if (typeof entity.update === 'function') {
				entity.update(deltaFrames, this);
			}
		}

		// Handle collision
		for (let i = 0; i < this.entities.length; i++) {
			if (this.entities[i].NO_COLLISION) continue;
			for (let j = i + 1; j < this.entities.length; j++) {
				if (this.entities[j].NO_COLLISION) continue;
				const entityA = this.entities[i];
				const entityB = this.entities[j];

				if (this.checkCollision(entityA, entityB)) {
					entityA.onCollision(entityB, this);
					entityB.onCollision(entityA, this);
				}
			}
		}
	}

	/**
	 * Renders all game entities.
	 */
	render() {
		const ctx = this.context;
		if (!ctx) return;

		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		ctx.save();

		// Apply the camera offset
		// We translate the entire coordinate system by the offset amount
		ctx.translate(-this.gameOffset.x, -this.gameOffset.y);

		for (const entity of this.entities) {
			ctx.save();
			if (entity.STATIC_ON_SCREEN) ctx.translate(this.gameOffset.x, this.gameOffset.y);
			entity.render(ctx, this.debug);
			ctx.restore();
		}
		ctx.restore();

		if (!this.debug) return;

		// Show the relative offset for debugging
		ctx.fillStyle = 'black';
		ctx.font = '16px Arial';
		ctx.fillText(
			`Offset: (${this.gameOffset.x.toFixed(0)}, ${this.gameOffset.y.toFixed(0)})`,
			10,
			ctx.canvas.height - 10
		);

		const absolutePositionOfBottom = ctx.canvas.height + this.gameOffset.y;

		// Show where the bottom of the canvas is in world coordinates
		ctx.fillText(
			`World Y at bottom: ${absolutePositionOfBottom.toFixed(0)}`,
			10,
			ctx.canvas.height - 30
		);

		// Show the number of entities below the bottom of the canvas
		const entitiesBelow = this.entities.filter(
			(entity) => entity.position.y > absolutePositionOfBottom && !entity.STATIC_ON_SCREEN
		).length;
		ctx.fillText(`Entities below screen: ${entitiesBelow}`, 10, ctx.canvas.height - 50);
	}

	gameOver() {
		this.gameIsOver = true;
		// The player is currently falling, and the offset is following them down.
		// We want to add the GAME OVER text at a fixed position on the screen
		this.addEntity(new TextEntity('GAME OVER', this.canvas.width / 2 - 50, this.canvas.height / 2));
	}

	/**
	 * Checks for AABB collision between two entities.
	 * @param {Entity} a
	 * @param {Entity} b
	 * @returns {boolean}
	 */
	checkCollision(a, b) {
		return (
			a.position.x < b.position.x + b.size.x &&
			a.position.x + a.size.x > b.position.x &&
			a.position.y < b.position.y + b.size.y &&
			a.position.y + a.size.y > b.position.y
		);
	}
}
