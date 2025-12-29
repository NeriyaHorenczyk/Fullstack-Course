// @ts-check
import { Entity } from '../../../js/engine/Entity.js';
import Vector from '../../../js/engine/Vector.js';
import { Ball } from './Ball.js';
import BasePowerup from './BasePowerup.js';
import { BrickBreakerGameEngine } from './BrickBreakerGameEngine.js';

export class Brick extends Entity {
    type = 'brick';
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {string} color
     * @param {number} health
     * @param {BasePowerup | undefined} powerup
     */
    constructor(x, y, width, height, color, health = 1, powerup = undefined) {
        super();
        this.position = new Vector(x, y);
        this.size = new Vector(width, height);
        this.color = color;
        this.active = true;
        this.health = health;
        this.powerup = powerup;
    }

    /**
     * @param {Entity} other
     * @param {BrickBreakerGameEngine} gameEngine
     * @returns
     */
    onCollision(other, gameEngine) {
        if (!this.active) return;

        if (other instanceof Ball) {
            this.health--;
            if (gameEngine.addScore) gameEngine.addScore(100);
            if (this.health > 0) return;
            this.active = false;
            // Spawn power-up if available
            if (this.powerup) {
                this.powerup.isFalling = true;
                this.powerup.position.x = this.position.x + this.size.x / 2 - this.powerup.size.x / 2;
                this.powerup.position.y = this.position.y + this.size.y / 2 - this.powerup.size.y / 2;
                gameEngine.addEntity(this.powerup);
            }
            // Remove self from engine
            gameEngine.removeEntity(this);
            // Add score
        }
    }

    /**
     * Renders the brick on the canvas.
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        if (!this.active) return;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

        // If health > 1, draw health number
        if (this.health > 1) {
            ctx.fillStyle = '#000';
            ctx.font = '16px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.health.toString(), this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);
        }

        // Bevel/Border
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}
