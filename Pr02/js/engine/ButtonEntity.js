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
        window.addEventListener('mousemove', this.mouseMoveListener);
    }

    onRemove() {
        // @ts-expect-error shhh
        window.removeEventListener('mousemove', this.mouseMoveListener);
    }

    /**
     * Renders the button on the canvas.
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        // Draw button background
        ctx.fillStyle = this.isHovered ? '#AAAAAA' : '#CCCCCC';
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}
