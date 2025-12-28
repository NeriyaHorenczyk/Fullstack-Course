//@ts-check

import { Entity } from './Entity.js';
import Vector from './Vector.js';

export default class ButtonEntity extends Entity {
    type = 'button';

    /**
     *
     * @param {string} label - The text label of the button
     * @param {import('./Vector.js').default} position - The position of the button
     * @param {import('./Vector.js').default} size - The size of the button
     * @param {() => void} onClick - The callback function to execute on button click
     */
    constructor(label, position, size, onClick) {
        super();
        this.label = label;
        this.position = position;
        this.size = size;
        this.onClick = onClick;
        this.isHovered = false;
        this.STATIC_ON_SCREEN = true;
        this.NO_COLLISION = true;
    }

    onAdd() {
        /** @type {(event: MouseEvent) => void} */
        this.mouseMoveListener = (event) => {
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            this.isHovered =
                mouseX >= this.position.x &&
                mouseX <= this.position.x + this.size.x &&
                mouseY >= this.position.y &&
                mouseY <= this.position.y + this.size.y;
        };

        /** @type {(event: MouseEvent) => void} */
        this.mouseClickListener = (event) => {
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            if (
                mouseX >= this.position.x &&
                mouseX <= this.position.x + this.size.x &&
                mouseY >= this.position.y &&
                mouseY <= this.position.y + this.size.y
            ) {
                this.onClick();
            }
        };

        window.addEventListener('click', this.mouseClickListener);
        window.addEventListener('mousemove', this.mouseMoveListener);
    }

    destroy() {
        // @ts-expect-error shhh
        window.removeEventListener('mousemove', this.mouseMoveListener);
        // @ts-expect-error shhh
        window.removeEventListener('click', this.mouseClickListener);
    }

    /**
     * Renders the button on the canvas.
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        // Draw button background
        ctx.fillStyle = this.isHovered ? '#AAAAAA' : '#CCCCCC';
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        // Draw button border
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
        // Draw button label
        ctx.fillStyle = '#000000';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.label, this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);
    }
}
