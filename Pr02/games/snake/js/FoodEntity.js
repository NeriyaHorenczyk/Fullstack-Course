import { Entity } from '../../../js/engine/Entity.js';
import Vector from '../../../js/engine/Vector.js';

export default class FoodEntity extends Entity {
    type = 'food';

    /**
     * @param {Vector[]} snakeBodyParts - The snake's body parts to avoid spawning on
     * @param {number} canvasWidth - The width of the canvas
     * @param {number} canvasHeight - The height of the canvas
     * @param {number} cellSize - The size of each grid cell
     */
    constructor(snakeBodyParts = [], canvasWidth = 500, canvasHeight = 500, cellSize = 20) {
        super();
        this.cellSize = cellSize;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.size = new Vector(cellSize, cellSize);
        this.value = 5;

        // Spawn at a position that doesn't overlap with the snake
        this.respawn(snakeBodyParts);
    }

    /**
     * Respawn the food at a new position that doesn't overlap with the snake
     * @param {Vector[]} snakeBodyParts - The snake's body parts to avoid
     */
    respawn(snakeBodyParts) {
        let validPosition = false;
        let newPosition;

        while (!validPosition) {
            // Generate a random position aligned to the grid
            const gridX = Math.floor(Math.random() * (this.canvasWidth / this.cellSize));
            const gridY = Math.floor(Math.random() * (this.canvasHeight / this.cellSize));
            newPosition = new Vector(gridX * this.cellSize, gridY * this.cellSize);

            // Check if this position overlaps with any part of the snake
            validPosition = !snakeBodyParts.some(
                (part) =>
                    Math.abs(part.x - newPosition.x) < this.cellSize && Math.abs(part.y - newPosition.y) < this.cellSize
            );
        }

        this.position = newPosition;
    }

    render(ctx, debug) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}
