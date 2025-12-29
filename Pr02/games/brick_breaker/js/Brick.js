// @ts-check
import { Entity } from '../../../js/engine/Entity.js';
import Vector from '../../../js/engine/Vector.js';
import { Ball } from './Ball.js';
import BasePowerup from './BasePowerup.js';
import { BrickBreakerGameEngine } from './BrickBreakerGameEngine.js';

export class Brick extends Entity {
    type = 'brick';
    requiredToClearLevel = true;

    /**
     * @param {object} opts
     * @param {number} opts.x
     * @param {number} opts.y
     * @param {number} opts.width
     * @param {number} opts.height
     * @param {string} opts.color
     * @param {number} [opts.health=1]
     * @param {BasePowerup} [opts.powerup]
     */
    constructor({ x, y, width, height, color, health = 1, powerup }) {
        super();

        this.position = new Vector(x, y);
        this.size = new Vector(width, height);
        this.color = color;
        this.health = health;
        this.powerup = powerup;

        this.active = true;
    }

    /* -----------------------------
       Capabilities (Override Hooks)
    ------------------------------ */

    canTakeDamage() {
        return true;
    }

    /**
     * @param {BrickBreakerGameEngine} gameEngine
     */
    onDestroyed(gameEngine) {
        this.spawnPowerup(gameEngine);
        this.playDestroySound(gameEngine);
        gameEngine.removeEntity(this);
    }

    /* -----------------------------
       Collision Handling
    ------------------------------ */

    /**
     * @param {Entity} other
     * @param {BrickBreakerGameEngine} gameEngine
     */
    onCollision(other, gameEngine) {
        if (!this.active) return;
        if (!(other instanceof Ball)) return;
        if (!this.canTakeDamage()) return;

        this.applyDamage(1, gameEngine);
    }

    /**
     * Applies damage to the brick.
     * @param {number} amount The amount of damage to apply
     * @param {BrickBreakerGameEngine} gameEngine The game engine instance
     */
    applyDamage(amount, gameEngine) {
        this.health -= amount;

        if (gameEngine.addScore) {
            gameEngine.addScore(100);
        }

        if (this.health > 0) return;

        this.active = false;
        this.onDestroyed(gameEngine);
    }

    /* -----------------------------
       Utilities
    ------------------------------ */

    /**
     * Spawns the powerup associated with this brick, if any.
     * @param {BrickBreakerGameEngine} gameEngine The game engine instance
     */
    spawnPowerup(gameEngine) {
        if (!this.powerup) return;

        this.powerup.isFalling = true;
        this.powerup.position.x = this.position.x + this.size.x / 2 - this.powerup.size.x / 2;
        this.powerup.position.y = this.position.y + this.size.y / 2 - this.powerup.size.y / 2;

        gameEngine.addEntity(this.powerup);
    }

    /**
     * Plays the brick destruction sound effect.
     * @param {BrickBreakerGameEngine} gameEngine The game engine instance
     */
    playDestroySound(gameEngine) {
        const original = gameEngine.assets.getAudio('brick_explode');
        /** @type {HTMLAudioElement} */
        // @ts-ignore
        const sound = original.cloneNode(true);
        sound.play();
    }

    /* -----------------------------
       Rendering
    ------------------------------ */

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        if (!this.active) return;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

        if (this.health > 1) {
            ctx.fillStyle = '#000';
            ctx.font = '16px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const text = this.health === Infinity ? '∞' : String(this.health);
            ctx.fillText(text, this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);
        }

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}
