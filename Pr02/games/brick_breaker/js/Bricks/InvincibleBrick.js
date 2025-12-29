// @ts-check
import { Brick } from './Brick.js';

export class InvincibleBrick extends Brick {
    requiredToClearLevel = false;

    canTakeDamage() {
        return false;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        super.render(ctx);

        // Overlay to signal invincibility
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.position.x + 2, this.position.y + 2, this.size.x - 4, this.size.y - 4);
        // Draw diagonal lines
        ctx.beginPath();
        ctx.moveTo(this.position.x + 4, this.position.y + 4);
        ctx.lineTo(this.position.x + this.size.x - 4, this.position.y + this.size.y - 4);
        ctx.moveTo(this.position.x + this.size.x - 4, this.position.y + 4);
        ctx.lineTo(this.position.x + 4, this.position.y + this.size.y - 4);
        ctx.stroke();
    }
}
