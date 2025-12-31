import { Entity } from '../../../js/engine/Entity.js';
import Vector from '../../../js/engine/Vector.js';
import { Paddle } from './Paddle.js';
import { Brick } from './Bricks/Brick.js';

export class Ball extends Entity {
    constructor(x, y) {
        super();
        this.position = new Vector(x, y);
        this.initialPosition = this.position.clone();
        this.size = new Vector(15, 15); // Treated as a square for AABB, rendered as circle
        this.velocity = new Vector(5, -5);
        this.speed = 7;
        this.color = '#ffffff';
        this.stuckToPaddle = true; // Starts on the paddle
        this.paddleOffset = 0; // Relative X position on paddle when stuck
    }

    reset() {
        this.position = this.initialPosition.clone();
        this.velocity = new Vector(5, -5);
        this.stuckToPaddle = true;
        this.speed = 7;
        this.paddleOffset = 0;
    }

    attachToPaddle(paddle) {
        this.stuckToPaddle = true;
        this.paddleOffset = this.position.x - paddle.position.x;
    }

    launch() {
        if (this.stuckToPaddle) {
            this.stuckToPaddle = false;
            // Launch upwards with some random horizontal variation if desired,
            // but for now simple 45 degree launch is fine or keep current velocity
            this.velocity = new Vector(this.speed, -this.speed);
            // Randomize X direction
            if (Math.random() > 0.5) this.velocity.x *= -1;
        }
    }

    update(deltaFrames, gameEngine) {
        if (gameEngine.gameOver) return;
        if (this.stuckToPaddle) {
            // Find the paddle
            const paddle = gameEngine.entities.find((e) => e instanceof Paddle);
            if (paddle) {
                // Keep ball centered on paddle for initial launch looks better
                this.position.x = paddle.position.x + paddle.size.x / 2 - this.size.x / 2;
                this.position.y = paddle.position.y - this.size.y - 1;
            }
        } else {
            // Move
            this.position.x += this.velocity.x * deltaFrames;
            this.position.y += this.velocity.y * deltaFrames;

            // Wall collisions
            if (this.position.x <= 0) {
                this.position.x = 0;
                this.velocity.x *= -1;
            }
            if (this.position.x + this.size.x >= gameEngine.canvas.width) {
                this.position.x = gameEngine.canvas.width - this.size.x;
                this.velocity.x *= -1;
            }
            if (this.position.y <= 0) {
                this.position.y = 0;
                this.velocity.y *= -1;
            }

            // Floor collision (Death)
            if (this.position.y > gameEngine.canvas.height) {
                // Die
                gameEngine.lives--;
                if (gameEngine.lives > 0) {
                    this.stuckToPaddle = true;
                }
            }
        }
    }

    onCollision(other, gameEngine) {
        if (this.stuckToPaddle) return;

        if (other instanceof Paddle) {
            // Bounce up
            // Calculate hit position relative to paddle center to change angle
            const centerPaddle = other.position.x + other.size.x / 2;
            const centerBall = this.position.x + this.size.x / 2;
            const hitPoint = centerBall - centerPaddle;

            // Normalize hit point (-1 to 1)
            const normalizedHit = hitPoint / (other.size.x / 2);

            // Adjust velocity x based on hit point
            this.velocity.x = normalizedHit * this.speed * 1.5;

            // Always bounce up
            this.velocity.y = -Math.abs(this.velocity.y);

            // Ensure min vertical speed so it doesn't get too flat
            // Note: Simplistic physics
        } else if (other instanceof Brick) {
            // Basic bounce.
            // Determine side of collision using previous position or overlap amounts
            // For simple AABB:
            // Overlap amounts
            const overlapLeft = this.position.x + this.size.x - other.position.x;
            const overlapRight = other.position.x + other.size.x - this.position.x;
            const overlapTop = this.position.y + this.size.y - other.position.y;
            const overlapBottom = other.position.y + other.size.y - this.position.y;

            // Find smallest overlap
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

            if (minOverlap === overlapLeft || minOverlap === overlapRight) {
                this.velocity.x *= -1;
            } else {
                this.velocity.y *= -1;
            }
        }
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, this.size.x / 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}
