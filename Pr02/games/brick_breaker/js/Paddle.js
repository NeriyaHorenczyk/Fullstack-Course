import { Entity } from '../../../js/engine/Entity.js';
import Vector from '../../../js/engine/Vector.js';

export class Paddle extends Entity {
    type = 'paddle';
    constructor(x, y) {
        super();
        this.position = new Vector(x, y);
        this.initialPosition = this.position.clone();
        this.size = new Vector(100, 20);
        this.speed = 10;
        this.color = '#00f0ff';

        this.moveLeft = false;
        this.moveRight = false;

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    reset() {
        // Reset position to center bottom
        this.position = this.initialPosition.clone();
        this.speed = 10;
        this.color = '#00f0ff';
        this.moveLeft = false;
        this.moveRight = false;
    }

    handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') this.moveLeft = true;
        if (e.key === 'ArrowRight') this.moveRight = true;
    };

    handleKeyUp = (e) => {
        if (e.key === 'ArrowLeft') this.moveLeft = false;
        if (e.key === 'ArrowRight') this.moveRight = false;
    };

    update(deltaFrames, gameEngine) {
        if (gameEngine.gameOver) return;
        const canvasWidth = gameEngine.canvas.width;

        if (this.moveLeft) this.position.x -= this.speed * deltaFrames;

        if (this.moveRight) this.position.x += this.speed * deltaFrames;

        // Constraints
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.x + this.size.x > canvasWidth) {
            this.position.x = canvasWidth - this.size.x;
        }
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

        // Shine/Glare effect for "Pop"
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y / 2);
    }

    destroy() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }
}
