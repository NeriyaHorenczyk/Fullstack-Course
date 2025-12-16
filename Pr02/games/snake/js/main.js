// @ts-check
import FoodEntity from "./FoodEntity.js";
import SnakeGameEngine from "./SnakeGameEngine.js";

const canvas = document.getElementById('game-canvas');
if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error('Failed to acquire game canvas element');
}

const engine = new SnakeGameEngine(canvas, false);

const foodEnt = new FoodEntity();
engine.addEntity(foodEnt);
engine.render();
