// @ts-check
import { Entity } from '../../../js/engine/Entity.js';
import { BrickBreakerGameEngine } from './BrickBreakerGameEngine.js';

export default class BGandHUD extends Entity {
    NO_COLLISION = true;
    STATIC_ON_SCREEN = true;
    type = 'bg_and_hud';

    /**
     * @param {BrickBreakerGameEngine} gameEngine
     */
    constructor(gameEngine) {
        super();
        this.gameEngine = gameEngine;
    }

    /**
     * Renders the background and HUD elements.
     * @param {CanvasRenderingContext2D} ctx
     * @param {boolean} debug
     */
    render(ctx, debug) {
        // Background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // HUD
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px "Press Start 2P", monospace';
        ctx.fillText(`Score: ${this.gameEngine.score}`, 20, 30);
        ctx.fillText(`Lives: ${this.gameEngine.lives}`, 20, 50);
        ctx.textAlign = 'right';
        ctx.fillText(`Level: ${this.gameEngine.level}`, ctx.canvas.width - 20, 30);
        ctx.fillText(`High Score: ${this.gameEngine.highScore}`, ctx.canvas.width - 20, 50);
    }
}
