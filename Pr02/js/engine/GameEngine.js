import { Entity } from './Entity.js';

// @ts-check
export class GameEngine {
	/**
	 * @param {HTMLCanvasElement} canvas
	 */
	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		if (!this.context) throw new Error('Failed to get 2D context');

		/**
		 * @type {Entity[]}
		 */
		this.entities = [];
		this.running = false;
		this.lastUpdateTime = 0;
		this.deltaTime = 0;

		// Bind once, so 'this' works in gameLoop
		this.gameLoop = this.gameLoop.bind(this);
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

		this.deltaTime = timestamp - this.lastUpdateTime;
		this.lastUpdateTime = timestamp;

		this.update(this.deltaTime);
		this.render();

		requestAnimationFrame(this.gameLoop);
	}

	/**
	 * Adds a game entity.
	 * @param {{ update: (deltaTime: number) => void, render: (ctx: CanvasRenderingContext2D) => void }} entity
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
	 * @param {number} deltaTime
	 */
	update(deltaTime) {
		for (const entity of this.entities) {
			if (typeof entity.update === 'function') {
				entity.update(deltaTime, this);
			}
		}
	}

	/**
	 * Renders all game entities.
	 */
	render() {
		if (!this.context) return;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (const entity of this.entities) {
			if (typeof entity.render === 'function') {
				entity.render(this.context);
			}
		}
	}
}
