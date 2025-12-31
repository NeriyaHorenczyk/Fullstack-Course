// @ts-check

import { fetchCurrentUserData, storeCurrentUserData } from '../../../js/auth/userdata.js';
import ButtonEntity from '../../../js/engine/ButtonEntity.js';
import { GameEngine } from '../../../js/engine/GameEngine.js';
import TextEntity from '../../../js/engine/TextEntity.js';
import Vector from '../../../js/engine/Vector.js';
import FoodEntity from './FoodEntity.js';
import Player from './Player.js';

export default class SnakeGameEngine extends GameEngine {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {boolean} [debug=false]
     */
    constructor(canvas, debug = false) {
        super(canvas, debug);
        const userData = fetchCurrentUserData() || {};
        this.highScore = userData.snake?.highScore || 0;
        this.score = 0;
    }
    /**
     *
     * @param {number} deltaTime
     */
    update(deltaTime) {
        super.update(deltaTime);
        if (this.score > this.highScore) {
            this.highScore = this.score;
            storeCurrentUserData({
                ...fetchCurrentUserData(),
                snake: { highScore: this.highScore },
            });
        }

        // Find the player (snake)
        const player = this.entities.find((e) => e instanceof Player);

        // Spawn food if none exists, passing the snake's body parts
        if (!this.entities.find((e) => e.type === 'food')) {
            const snakeBodyParts = player ? player.bodyParts : [];
            this.addEntity(new FoodEntity(snakeBodyParts, this.canvas.width, this.canvas.height, 20));
        }

        this.checkGameOver();
    }

    checkGameOver() {
        const player = this.entities.find((e) => e instanceof Player);
        if (player && player.isGameOver) {
            player.direction = new Vector(0, 0); // Stop the snake movement
            this.addEntity(new TextEntity('Game Over', this.canvas.width / 2, this.canvas.height / 2 - 50));
            // Only add one restart button while game over
            const hasButton = this.entities.some((e) => e.type === 'button');
            if (!hasButton) {
                this.addEntity(
                    new ButtonEntity(
                        'Restart',
                        new Vector(this.canvas.width / 2 - 100, this.canvas.height / 2 - 40),
                        new Vector(200, 80),
                        () => {
                            // Remove all buttons to detach window listeners
                            this.entities.filter((e) => e.type === 'button').forEach((btn) => this.removeEntity(btn));

                            // Reset entities
                            for (const entity of this.entities) {
                                if (entity.type === 'player' || entity.type === 'food' || entity.type === 'text') {
                                    this.removeEntity(entity);
                                }
                            }

                            // Add a fresh player
                            this.addEntity(new Player(this));
                            this.score = 0;
                        }
                    )
                );
            }
        }
    }
}
