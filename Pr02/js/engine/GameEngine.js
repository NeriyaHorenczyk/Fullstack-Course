// @ts-check
import { Entity } from './Entity.js';

export class GameEngine {
	FPS_TARGET = 60;
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
	 * @param {number} deltaTime
	 */
	update(deltaTime) {
		// Update each entity
		const deltaFrames = deltaTime / (1000 / this.FPS_TARGET);
		for (const entity of this.entities) {
			if (typeof entity.update === 'function') {
				entity.update(deltaFrames, this);
			}
		}

		// Handle collision
		for (let i = 0; i < this.entities.length; i++) {
			for (let j = i + 1; j < this.entities.length; j++) {
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
		if (!this.context) return;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (const entity of this.entities) {
			if (typeof entity.render === 'function') {
				entity.render(this.context);
			}
		}
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
