// @ts-check
import { Entity } from '../../../js/engine/Entity.js';
import { GameEngine } from '../../../js/engine/GameEngine.js';
import Vector from '../../../js/engine/Vector.js';

const PRECISION_THRESHOLD = 1 / 1000;

// PHYSICS CONSTANTS
const GRAVITY = 0.8;
// How much speed to add per frame while holding key
const ACCELERATION = 1.5;
// How quickly to slow down when letting go (0.0-1.0)
const FRICTION = 0.85;
// The fastest the player can run
const MAX_SPEED = 120;
// The fastest the player can fall to prevent tunneling
const MAX_FALL_SPEED = Infinity;
// How much force to apply when jumping
const JUMP_FORCE = -18;

const Y_THRESHOLD = 0.25; // If the player is in the top 25% of the screen, move the wallpaper

/**
 * Represents a player entity in the game.
 * @extends Entity
 */
export default class Player extends Entity {
	type = 'player';

	/**
	 * @param {string} spriteSrc
	 */
	constructor(spriteSrc) {
		super();
		this.scale = 0.1;
		this.position = new Vector(0, 0);
		this.previousPosition = new Vector(0, 0);
		this.velocity = new Vector(0, 0);

		// Input State tracking
		this.inputs = {
			up: false,
			left: false,
			right: false,
		};

		// Render state
		this.facingRight = true;

		/** @type {Record<symbol, string>} */
		// Can be extended to have different sprites for different states
		const statePaths = {
			[PlayerState.STANDING]: `${spriteSrc}/doodle_jump_guy.png`,
			[PlayerState.JUMPING]: `${spriteSrc}/doodle_jump_guy.png`,
			[PlayerState.FALLING]: `${spriteSrc}/doodle_jump_guy.png`,
			[PlayerState.RUNNING]: `${spriteSrc}/doodle_jump_guy.png`,
		};

		/** @type {Record<symbol, HTMLImageElement>} */
		this.sprites = {};

		// Pre-load images
		Reflect.ownKeys(statePaths).forEach((state) => {
			const img = new Image();
			// @ts-ignore
			img.src = statePaths[state];
			// @ts-ignore
			this.sprites[state] = img;
		});

		this.debug = true;
		this.state = PlayerState.STANDING;
		this.grounded = false;

		// Set initial size
		this.size = new Vector(0, 0);
		const standingImg = this.sprites[PlayerState.STANDING];

		const setSize = () => {
			this.size = new Vector(standingImg.width * this.scale, standingImg.height * this.scale);
		};

		if (standingImg.complete) setSize();
		else standingImg.onload = setSize;

		this.eventListeners = new Map();
	}

	/**
	 * @param {GameEngine} gameEngine
	 */
	onAdd(gameEngine) {
		// We need both KeyDown (start moving) and KeyUp (stop moving)
		// @ts-ignore event handler type
		const keyDownHandler = (e) => this.handleKey(e, true);
		// @ts-ignore event handler type
		const keyUpHandler = (e) => this.handleKey(e, false);
		// @ts-ignore event handler type
		const mouseClickHandler = (e) => this.onMouseClick(e, gameEngine.gameOffset);

		this.eventListeners.set('keydown', keyDownHandler);
		this.eventListeners.set('keyup', keyUpHandler);
		this.eventListeners.set('click', mouseClickHandler);

		window.addEventListener('keydown', keyDownHandler);
		window.addEventListener('keyup', keyUpHandler);
		gameEngine.canvas.addEventListener('click', mouseClickHandler);
	}

	/**
	 * @param {GameEngine} gameEngine
	 */
	destroy(gameEngine) {
		for (const [event, listener] of this.eventListeners) {
			if (event === 'click') gameEngine.canvas.removeEventListener(event, listener);
			else window.removeEventListener(event, listener);
		}
		this.eventListeners.clear();
	}

	/**
	 * Updates the player's position and physics.
	 * @param {number} deltaFrames
	 */
	update(deltaFrames) {
		// Store previous position for collision resolution
		this.previousPosition = new Vector(this.position.x, this.position.y);

		// 1. Apply Gravity
		this.velocity.y += GRAVITY * deltaFrames;
		// Snap to 0 if very slow to prevent micro-sliding
		if (Math.abs(this.velocity.y) < PRECISION_THRESHOLD) this.velocity.y = 0;

		// 2. Horizontal Movement (Acceleration)
		if (this.inputs.right) {
			this.velocity.x += ACCELERATION * deltaFrames;
			this.facingRight = true;
		} else if (this.inputs.left) {
			this.velocity.x -= ACCELERATION * deltaFrames;
			this.facingRight = false;
		} else {
			// 3. Apply Friction (only when no keys are pressed)
			this.velocity.x *= FRICTION;

			// Snap to 0 if very slow to prevent micro-sliding
			if (Math.abs(this.velocity.x) < PRECISION_THRESHOLD) this.velocity.x = 0;
		}

		// 4. Cap Velocity (Max Speed)
		if (this.velocity.x > MAX_SPEED) this.velocity.x = MAX_SPEED;
		if (this.velocity.x < -MAX_SPEED) this.velocity.x = -MAX_SPEED;

		// Cap Fall Speed
		if (this.velocity.y > MAX_FALL_SPEED) this.velocity.y = MAX_FALL_SPEED;

		// 5. Jump Logic
		if (this.inputs.up && this.grounded) {
			this.velocity.y = JUMP_FORCE;
			this.state = PlayerState.JUMPING;
			this.grounded = false;
		}

		// 6. Apply Velocity to Position
		this.position = this.position.add(this.velocity.scale(deltaFrames));

		// 7. Determine State for Animation
		if (this.velocity.y > 1) {
			// Small buffer so we don't flicker falling while standing
			this.state = PlayerState.FALLING;
		} else if (this.velocity.y < -1) {
			this.state = PlayerState.JUMPING;
		} else if (Math.abs(this.velocity.x) > 2) {
			this.state = PlayerState.RUNNING;
		} else if (this.grounded) {
			this.state = PlayerState.STANDING;
		}

		// this.grounded = false;
	}

	/**
	 * Centralized Key Handler
	 * @param {KeyboardEvent} event
	 * @param {boolean} isDown
	 */
	handleKey(event, isDown) {
		switch (event.code) {
			case 'ArrowUp':
			case 'Space':
			case 'KeyW':
				this.inputs.up = isDown;
				break;
			case 'ArrowLeft':
			case 'KeyA':
				this.inputs.left = isDown;
				break;
			case 'ArrowRight':
			case 'KeyD':
				this.inputs.right = isDown;
				break;
		}
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	render(ctx) {
		const currentSprite = this.sprites[this.state];
		// Save context to restore later (important for rotation/flipping)
		ctx.save();

		// Handle Image Flipping
		// We translate the canvas origin to the center of the player,
		// scale x by -1 if facing left, then draw at negative offsets.
		if (!this.facingRight) {
			ctx.translate(this.position.x + this.size.x, this.position.y);
			// After scaling, we draw at 0,0 relative to the translation
			ctx.scale(-1, 1);
		} else {
			// Standard translation
			ctx.translate(this.position.x, this.position.y);
		}

		// Draw Player (Local coordinates 0,0 because we translated)
		if (currentSprite && currentSprite.complete) {
			// Update size just in case sprite changed and wasn't loaded before
			this.size.x = currentSprite.width * this.scale;
			this.size.y = currentSprite.height * this.scale;

			// Note: Drawing at 0,0 because we used ctx.translate above
			ctx.drawImage(currentSprite, 0, 0, this.size.x, this.size.y);
		}

		ctx.restore(); // Restore context for the next entity

		// Draw Debug (Absolute coordinates)
		if (this.debug) {
			this.renderDebug(ctx);
		}
	}

	/**
	 * Renders debug information for the player.
	 * @param {CanvasRenderingContext2D} ctx
	 */
	renderDebug(ctx) {
		ctx.strokeStyle = 'red';
		ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
		ctx.fillStyle = 'black';
		ctx.font = '18px Arial';
		ctx.fillText(
			`Pos: (${this.position.x.toFixed(0)}, ${this.position.y.toFixed(0)})`,
			this.position.x,
			this.position.y - 20,
		);
		ctx.fillText(
			`Vel: (${this.velocity.x.toFixed(0)}, ${this.velocity.y.toFixed(0)})`,
			this.position.x,
			this.position.y - 35,
		);
		ctx.fillText(`Grounded: ${this.grounded}`, this.position.x, this.position.y - 50);
		ctx.fillText(`State: ${this.state.description}`, this.position.x, this.position.y - 65);

		// Visualize Velocity as a bar
		ctx.fillStyle = 'green';
		// X velocity goes sideways
		ctx.fillRect(this.position.x, this.position.y - 10, this.velocity.x * 5, 5);
		// Y velocity goes vertically
		ctx.fillRect(this.position.x - 5, this.position.y - 10, 5, this.velocity.y * 5);
	}

	/**
	 * Handles mouse click events to move the player.
	 * @param {MouseEvent} event
	 * @param {Vector} offset
	 */
	onMouseClick(event, offset) {
		const { clientX, clientY } = event;
		// Adjust for canvas position and game offset
		const adjustedX = clientX - offset.x;
		const adjustedY = clientY - offset.y;

		// Center player on click position
		this.position.x = adjustedX;
		this.position.y = adjustedY;
		this.velocity = new Vector(0, 0);
	}

	/**
	 * Handles keyboard events to make the player move.
	 * @param {KeyboardEvent} event
	 */
	/**
	 * Handles collision with another entity.
	 * @param {Entity} other
	 * @param {GameEngine} gameEngine
	 */
	onCollision(other, gameEngine) {
		if (other.type === 'platform' && this.velocity.y > 0) {
			// Use previous position to determine if we were above the platform.
			// This prevents clipping when falling fast (tunneling).
			const feetPrevious = this.previousPosition.y + this.size.y;
			const platformTop = other.position.y;
			const margin = 10; // Allow a small margin of error

			if (feetPrevious <= platformTop + margin) {
				this.position.y = other.position.y - this.size.y;
				this.velocity.y = 0;
				if (this.state !== PlayerState.STANDING && this.state !== PlayerState.RUNNING) {
					this.state = PlayerState.STANDING; // Force state to allow jumping again immediately
				}
				this.grounded = true;
			}
		}
	}
}

const PlayerState = Object.freeze({
	STANDING: Symbol('standing'),
	JUMPING: Symbol('jumping'),
	FALLING: Symbol('falling'),
	RUNNING: Symbol('running'),
});
