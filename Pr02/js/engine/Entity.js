import { GameEngine } from './GameEngine.js';

// @ts-check
export class Entity {
	/**
	 * Updates the entity's state.
	 * @param {number} deltaTime - Time elapsed since the last update in milliseconds.
	 * @param {GameEngine} gameEngine - The game engine instance.
	 */
	update(deltaTime, gameEngine) {
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
}
