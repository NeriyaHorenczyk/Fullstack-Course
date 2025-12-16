import { Entity } from "../../../js/engine/Entity.js";
import Vector from "../../../js/engine/Vector.js";

export default class FoodEntity extends Entity {
  type = "food";

  constructor() {
    super();
    const xPos = Math.random() * 500;
    const yPos = Math.random() * 500;
    this.position = new Vector(xPos, yPos);
    this.size = new Vector(10, 10);
    this.value = 10;
  }

  render(ctx, debug) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
  }
}
