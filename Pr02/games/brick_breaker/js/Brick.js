import { Entity } from '../../../js/engine/Entity.js';
import Vector from '../../../js/engine/Vector.js';
import { Ball } from './Ball.js';

export class Brick extends Entity {
    constructor(x, y, width, height, color, health = 1) {
        super();
        this.position = new Vector(x, y);
        this.size = new Vector(width, height);
        this.color = color;
        this.active = true;
        this.health = health;
    }

    onCollision(other, gameEngine) {
        if (!this.active) return;

        if (other instanceof Ball) {
            this.health--;
            if (gameEngine.addScore) gameEngine.addScore(100);
            if (this.health > 0) return;
            this.active = false;
            // Remove self from engine
            gameEngine.removeEntity(this);
            // Add score
        }
    }

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
