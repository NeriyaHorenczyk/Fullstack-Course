// @ts-check
import { Entity } from './Entity.js';
import Vector from './Vector.js';

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
		this.gameOffset = new Vector(0, 0);

		/** @type {((deltaFrames: number) => void)[]} */
		this.tickCallbacks = [];
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
		// Clamp deltaFrames to prevent massive jumps during lag spikes (max 5 frames ~ 83ms)
		const rawDeltaFrames = this.deltaTime / (1000 / this.FPS_TARGET);
		const deltaFrames = Math.min(rawDeltaFrames, 5);

		this.update(deltaFrames);
		this.render();

		requestAnimationFrame(this.gameLoop);
		this.tickCallbacks.forEach((callback) => callback(deltaFrames));
	}

	/**
	 * Registers a callback to be called on each tick.
	 * @param {(deltaFrames: number) => void} callback
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
		if (!this.context) return;

		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.context.save();

		// Apply the camera offset
		// We translate the entire coordinate system by the offset amount
		this.context.translate(this.gameOffset.x, this.gameOffset.y);

		for (const entity of this.entities) {
			if (entity.STATIC_ON_SCREEN) {
				// Render static entities in screen space
				this.context.save();
				this.context.translate(-this.gameOffset.x, -this.gameOffset.y);
				entity.render(this.context);
				this.context.restore();
			} else {
				// Render dynamic entities in world space
				entity.render(this.context);
			}
		}
		this.context.restore();
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
