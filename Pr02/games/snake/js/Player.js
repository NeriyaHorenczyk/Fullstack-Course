// @ts-check
import { Entity } from "../../../js/engine/Entity.js";
import { GameEngine } from "../../../js/engine/GameEngine.js";
import Vector from "../../../js/engine/Vector.js";
export default class Player extends Entity {
    
    SNAKE_SPEED = 2; //pixels per frame
    
    constructor() {
        super();
        this.direction = new Vector(0, 1);
    }

    onAdd() {
        // Add listeners for keyboard input to change direction
        window.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowUp":
                    this.direction = new Vector(0, -1);
                    break;
                case "ArrowDown":
                    this.direction = new Vector(0, 1);
                    break;
                case "ArrowLeft":
                    this.direction = new Vector(-1, 0);
                    break;
                case "ArrowRight":
                    this.direction = new Vector(1, 0);
                    break;
            }
        });
    }

    onDestroy() {
        // Clean up event listeners if necessary
        //TODO: Remove event listeners
    }

    /**
     * Handles collision with another entity.
     * @param {Entity} other - The other entity involved in the collision.
     * @param {GameEngine} gameEngine - The game engine instance.
     */
    onCollision(other, gameEngine) {
        if (other.type === "food") {
            // Handle collision with food entity
            console.log("Player collided with food!");
            // For example, increase score or grow the snake
        }
    }

    /**
     * Updates the entity's state.
     * @param {number} deltaFrames - Time elapsed since the last update in frames.
     * @param {GameEngine} gameEngine - The game engine instance.
     */
    update(deltaFrames, gameEngine) {
        // Update player position based on direction
        const speed = this.SNAKE_SPEED; // Adjust speed as necessary
        this.position.x += this.direction.x * speed;
        this.position.y += this.direction.y * speed;
    }

    /**
     * Renders the entity on the provided canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {boolean} debug - Whether to render debug information.
     */
    render(ctx, debug) {
        ctx.fillStyle = '#356859';
        ctx.fillRect(this.position.x, this.position.y, 10, 10); // Draw player as a green square
    }

}