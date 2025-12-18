// @ts-check

import { GameEngine } from '../../../js/engine/GameEngine.js';
import FoodEntity from './FoodEntity.js';
import Player from './Player.js';

export default class SnakeGameEngine extends GameEngine {
    /**
     *
     * @param {number} deltaTime
     */
    update(deltaTime) {
        super.update(deltaTime);

        // Find the player (snake)
        const player = this.entities.find((e) => e instanceof Player);

        // Spawn food if none exists, passing the snake's body parts
        if (!this.entities.find((e) => e.type === 'food')) {
            const snakeBodyParts = player ? player.bodyParts : [];
            this.addEntity(new FoodEntity(snakeBodyParts, this.canvas.width, this.canvas.height, 20));
        }
    }
}
