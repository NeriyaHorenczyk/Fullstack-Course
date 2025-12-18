// @ts-check

import { GameEngine } from '../../../js/engine/GameEngine.js';
import FoodEntity from './FoodEntity.js';
export default class SnakeGameEngine extends GameEngine {
    /**
     *
     * @param {number} deltaTime
     */
    update(deltaTime) {
        super.update(deltaTime);
        if (!this.entities.find((e) => e.type === 'food')) this.addEntity(new FoodEntity());
    }
}
