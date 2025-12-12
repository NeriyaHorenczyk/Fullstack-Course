// @ts-check
import { GameEngine } from './GameEngine.js';
import Vector from './Vector.js';

export class Entity {
	type = 'generic';
	NO_COLLISION = false;
	STATIC_ON_SCREEN = false;
	constructor() {
		this.position = new Vector(0, 0);
		this.size = new Vector(0, 0);
	}

	/**
	 * Updates the entity's state.
	 * @param {number} deltaFrames - Time elapsed since the last update in frames.
	 * @param {GameEngine} gameEngine - The game engine instance.
	 */
	update(deltaFrames, gameEngine) {
		// Default implementation does nothing.
		// Override this method in subclasses to provide specific behavior.
	}

	/**
	 * Renders the entity on the provided canvas context.
	 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
	 */
	render(ctx) {
		// Default implementation does nothing.
		// Override this method in subclasses to provide specific rendering.
	}

	/**
	 * Called when the entity is added to the game engine.
	 * @param {GameEngine} gameEngine - The game engine instance.
	 */
	onAdd(gameEngine) {
		// Default implementation does nothing.
		// Override this method in subclasses to provide specific behavior.
		// For example, initialize resources or event listeners here.
	}

	/**
	 * Called when the entity is destroyed or removed from the game engine.
	 * @param {GameEngine} gameEngine - The game engine instance.
	 */
	destroy(gameEngine) {
		// Default implementation does nothing.
		// Override this method in subclasses to provide specific behavior.
		// For example, cleanup resources or event listeners here.
	}

	/**
	 * Handles collision with another entity.
	 * @param {Entity} other - The other entity involved in the collision.
	 * @param {GameEngine} gameEngine - The game engine instance.
	 */
	onCollision(other, gameEngine) {
		// Default implementation does nothing.
		// Override this method in subclasses to provide specific behavior.
	}
}
