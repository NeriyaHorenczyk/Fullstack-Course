// @ts-check
import { Entity } from "../../../js/engine/Entity.js";
import { GameEngine } from "../../../js/engine/GameEngine.js";
import Vector from "../../../js/engine/Vector.js";
import FoodEntity from "./FoodEntity.js";
export default class Player extends Entity {
  type = "player";
  SNAKE_SPEED = 2;
  BODY_CELL_SIZE = 10;
  HEAD_CELL_SIZE = 15;

  constructor() {
    super();
    this.direction = new Vector(0, 1);
    this.eventListeners = new Map();
    this.bodyParts = [this.position.clone()]; // Initialize with head position
    this.hasEaten = false;
    this.size = new Vector(this.HEAD_CELL_SIZE, this.HEAD_CELL_SIZE);
    this.growthPending = 0;
  }

  onAdd() {
    // Add listeners for keyboard input to change direction
    /** @type {(event: KeyboardEvent) => void} */
    const keydownListener = (event) => {
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
    };
    window.addEventListener("keydown", keydownListener);
    this.eventListeners.set("keydown", keydownListener);
  }

  /**
   *
   * @param {GameEngine} gameEngine
   */
  onDestroy(gameEngine) {
    for (const [event, listener] of this.eventListeners) {
      if (event === "click")
        gameEngine.canvas.removeEventListener(event, listener);
      else window.removeEventListener(event, listener);
    }
    this.eventListeners.clear();
  }

  /**
   * Handles collision with another entity.
   * @param {Entity} other - The other entity involved in the collision.
   * @param {GameEngine} gameEngine - The game engine instance.
   */
  onCollision(other, gameEngine) {
    if (other instanceof FoodEntity) {
      const food = other;
      // Grow the snake by adding a new body part at the tail
      this.hasEaten = true;
      gameEngine.removeEntity(other);
      this.growthPending += other.value;
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
    this.position.x += this.direction.x * speed * deltaFrames;
    this.position.y += this.direction.y * speed * deltaFrames;
    this.bodyParts.unshift(this.position.clone()); // Add new head position to the front of the body parts array

    if (this.growthPending > 0) {
      this.growthPending--;
    } else {
      this.bodyParts.pop(); // Remove the last part if not growing
    }

    console.table({
      position: this.position,
      bodyParts: this.bodyParts,
    });
  }

  /**
   * Renders the entity on the provided canvas context.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @param {boolean} debug - Whether to render debug information.
   */
  render(ctx, debug) {
    for (let i = 0; i < this.bodyParts.length; i++) {
      const part = this.bodyParts[i];
      ctx.fillStyle = i === 0 ? "green" : "lightgreen";
      const size = i === 0 ? this.HEAD_CELL_SIZE : this.BODY_CELL_SIZE;
      ctx.fillRect(part.x, part.y, this.size.x, this.size.y);

    }
    if (!debug) return;
    // Draw debug info
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);

    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.fillText(
      `Pos: (${this.position.x.toFixed(1)}, ${this.position.y.toFixed(1)})`,
      this.position.x,
      this.position.y - 10
    );
    ctx.fillText(
      `Dir: (${this.direction.x}, ${this.direction.y})`,
      this.position.x,
      this.position.y - 22
    );
    ctx.fillText(
      `Body Length: ${this.bodyParts.length}`,
      this.position.x,
      this.position.y - 34
    );
  }
}
