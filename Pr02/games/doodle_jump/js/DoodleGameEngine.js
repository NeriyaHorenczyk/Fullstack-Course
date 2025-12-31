// @ts-check

import { fetchCurrentUserData, storeCurrentUserData } from '../../../js/auth/userdata.js';
import { AssetLoader } from '../../../js/engine/AssetLoader.js';
import { GameEngine } from '../../../js/engine/GameEngine.js';
import TextEntity from '../../../js/engine/TextEntity.js';
/**
 * Doodle Jump–specific game engine.
 *
 * Responsibilities:
 * - Player-following camera behavior
 * - Game-over detection
 * - Doodle Jump–specific UI and rules
 *
 * Extends the generic GameEngine without modifying core behavior.
 */
export class DoodleJumpEngine extends GameEngine {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {boolean} [debug=false]
     */
    constructor(canvas, debug = false) {
        super(canvas, debug);

        /** Indicates whether the game has ended */
        this.gameIsOver = false;
        const userData = fetchCurrentUserData() || {};
        this.highScore = userData.doodleJump?.highScore || 0;
        this.score = 0;
        this.assets = new AssetLoader('games/doodle_jump/assets/');
    }

    async initEngine() {
        // Load sprites and sounds
        await this.assets.load({
            jump_1: { url: 'jump_1.ogg' },
            jump_2: { url: 'jump_2.ogg' },
            jump_3: { url: 'jump_3.ogg' },
            game_over: { url: 'game_over.ogg' },
        });
        await super.initEngine();
    }

    /**
     * Advances the game simulation.
     * Overrides the base update to inject game-specific rules.
     *
     * @param {number} deltaFrames
     */
    update(deltaFrames) {
        if (this.gameIsOver) return;

        super.update(deltaFrames);
        this.updateCamera();
        this.checkGameOver();
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
    }

    /**
     * Updates the camera to follow the player upward.
     * The camera never moves downward.
     */
    updateCamera() {
        const player = this.entities.find((e) => e.type === 'player');
        if (!player) return;

        const targetY = player.position.y - this.canvas.height * 0.4;
        this.cameraOffset.y = Math.min(this.cameraOffset.y, targetY);
    }

    /**
     * Checks whether the player has fallen below the visible world.
     * Triggers game over if so.
     */
    checkGameOver() {
        const player = this.entities.find((e) => e.type === 'player');
        if (!player) return;

        const bottomWorldY = this.canvas.height + this.cameraOffset.y;
        if (player.position.y > bottomWorldY) {
            this.gameOver();
        }
    }

    /**
     * Transitions the game into the game-over state.
     * Displays the GAME OVER message.
     */
    gameOver() {
        if (this.gameIsOver) return;
        this.gameIsOver = true;
        storeCurrentUserData({
            ...fetchCurrentUserData(),
            doodleJump: { highScore: this.highScore },
        });
        const gameOverSound = this.assets.getAudio('game_over');
        gameOverSound.play();
        this.addEntity(new TextEntity('GAME OVER', this.canvas.width / 2 - 50, this.canvas.height / 2));
    }

    /**
     * Renders the frame and optional debug overlays.
     */
    render() {
        super.render();

        if (!this.debug) return;

        const ctx = this.context;
        if (!ctx) return;

        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(`Camera Y: ${this.cameraOffset.y.toFixed(0)}`, 10, ctx.canvas.height - 10);
    }
}
