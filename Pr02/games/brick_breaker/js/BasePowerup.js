// @ts-check
import { Entity } from '../../../js/engine/Entity.js';
import Vector from '../../../js/engine/Vector.js';
import { BrickBreakerGameEngine } from './BrickBreakerGameEngine.js';

/**
 * Base class for power-up entities in the Brick Breaker game.
 * Power-ups spawn from destroyed bricks and fall towards the floor.
 * They can be collected by the paddle to gain various effects.
 * Subclasses should implement specific power-up behaviors.
 * @extends {Entity}
 */
export default class BasePowerup extends Entity {
    type = 'powerup';
    /**
     * @param {string} name
     * @param {number} x
     * @param {number} y
     * @param {number} speed
     * @param {ImageBitmap} sprite
     */
    constructor(name, x, y, speed, sprite) {
        super();
        this.sprite = sprite;
        this.size = new Vector(sprite.width, sprite.height);
        this.name = name;
        this.position = new Vector(x, y);
        this.speed = speed;
        this.isFalling = false;
    }

    /**
     * Draws the power-up on the canvas.
     * @param {CanvasRenderingContext2D} ctx
     * @param {boolean} debug
     */
    render(ctx, debug) {
        if (!this.isFalling || !this.sprite) return; // If it's hidden in a brick or sprite not ready, don't render
        ctx.drawImage(this.sprite, this.position.x, this.position.y);
        if (debug) {
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
            ctx.fillStyle = 'red';
            ctx.font = '12px Arial';
            ctx.fillText(this.name, this.position.x, this.position.y - 5);
        }
    }

    /**
     * Updates the power-up's position.
     * @param {number} deltaFrames
     * @param {BrickBreakerGameEngine} gameEngine
     */
    update(deltaFrames, gameEngine) {
        if (!this.isFalling) return; // If it's hidden in a brick, don't update
        this.position.y += this.speed * deltaFrames;
        // Remove if it goes off the bottom of the screen
        if (this.position.y > gameEngine.canvas.height) {
            gameEngine.removeEntity(this);
        }
    }

    /**
     * Activates the power-up effect when collected by the paddle.
     * This method should be overridden by subclasses to implement specific effects.
     * @param {BrickBreakerGameEngine} gameEngine
     */
    activatePowerup(gameEngine) {
        // To be implemented by subclasses
    }

    /**
     * Handles collision with other entities.
     * @param {Entity} otherEntity
     * @param {BrickBreakerGameEngine} gameEngine
     */
    onCollision(otherEntity, gameEngine) {
        if (otherEntity.type === 'paddle') {
            this.activatePowerup(gameEngine);
            gameEngine.removeEntity(this);
        }
    }
}
