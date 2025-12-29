// @ts-check
import TextEntity from '../../../js/engine/TextEntity.js';
import { GameEngine } from '../../../js/engine/GameEngine.js';

/**
 * Floating, fading world-space text (e.g. "+1 Life")
 * Frame-based animation (deltaFrames ≈ 1 per update)
 */
export class FloatingTextEntity extends TextEntity {
    /**
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {object} [opts]
     * @param {number} [opts.lifetimeFrames=60] // total frames alive
     * @param {number} [opts.pixelsPerFrame=0.5]
     */
    constructor(text, x, y, opts = {}) {
        super(text, x, y);

        this.STATIC_ON_SCREEN = false;

        this.lifetimeFrames = opts.lifetimeFrames ?? 60;
        this.remainingFrames = this.lifetimeFrames;

        this.pixelsPerFrame = opts.pixelsPerFrame ?? 0.5;

        this.alpha = 1;
    }

    /**
     * @param {number} deltaFrames
     * @param {GameEngine} gameEngine
     */
    update(deltaFrames, gameEngine) {
        this.y -= this.pixelsPerFrame * deltaFrames;
        this.remainingFrames -= deltaFrames;

        this.alpha = Math.max(0, this.remainingFrames / this.lifetimeFrames);

        if (this.remainingFrames <= 0) {
            gameEngine.removeEntity(this);
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;

        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'green';
        ctx.font = '16px "Press Start 2P"';
        ctx.textAlign = 'center';

        // Outline
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'white';
        ctx.strokeText(this.text, this.x, this.y);

        // Fill
        ctx.fillStyle = 'green';
        ctx.fillText(this.text, this.x, this.y);

        ctx.restore();
    }
}
