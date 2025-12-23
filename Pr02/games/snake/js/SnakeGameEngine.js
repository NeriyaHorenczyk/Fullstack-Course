// @ts-check

import ButtonEntity from '../../../js/engine/ButtonEntity.js';
import { GameEngine } from '../../../js/engine/GameEngine.js';
import Vector from '../../../js/engine/Vector.js';
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

        this.checkGameOver();
    }

    checkGameOver() {
        const player = this.entities.find((e) => e instanceof Player);
        if (player && player.isGameOver) {
            player.direction = new Vector(0, 0); // Stop the snake movement
            this.addEntity(
                new ButtonEntity(
                    'Restart',
                    new Vector(this.canvas.width / 2 - 100, this.canvas.height / 2 - 40),
                    new Vector(200, 80),
                    () => {
                        this.removeEntity(player);
                        debugger;
                        this.addEntity(new Player(this));
                        this.entities = this.entities.filter((e) => e.type !== 'food');
                        this.removeEntity(
                            //@ts-ignore
                            this.entities.find((e) => e instanceof ButtonEntity)
                        );
                    }
                )
            );
        }
    }
}
