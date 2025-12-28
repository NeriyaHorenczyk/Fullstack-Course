// @ts-check
import FoodEntity from './FoodEntity.js';
import Player from './Player.js';
import SnakeGameEngine from './SnakeGameEngine.js';
import ButtonEntity from '../../../js/engine/ButtonEntity.js';
import Vector from '../../../js/engine/Vector.js';

/** @type {SnakeGameEngine} */
let engine;

/**
 * @param {HTMLCanvasElement} canvas
 */
export function startGame(canvas) {
    if (engine) engine.destroy();

    // sync canvas size and screen size
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;

    // const resizeListener = () => {
    //     canvas.width = window.innerWidth;
    //     canvas.height = window.innerHeight;
    // };
    // window.addEventListener('resize', resizeListener);

    // Attach resize listener clean up to engine destruction if possible,
    // or we can handle it in stopGame.
    // Since GameEngine doesn't seem to generic "on destroy" for the engine itself,
    // we might need to handle it.
    // BUT, we can just save it to remove it later.
    engine = new SnakeGameEngine(canvas, false);
    engine.registerCleanupCallback(() => {
        // window.removeEventListener('resize', resizeListener);
    });

    engine.addEntity(new FoodEntity());
    engine.addEntity(new Player(engine));
    engine.start();
}

export function stopGame() {
    if (engine) {
        engine.destroy();
    }
    // @ts-expect-error cleanup
    engine = null;
}
