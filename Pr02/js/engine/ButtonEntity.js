//@ts-check

import { Entity } from './Entity.js';
/** @type {(event: MouseEvent) => {correctedMouseX: number, correctedMouseY: number}} */
const correctMousePosition = (event) => {
    const target = /** @type {HTMLElement} */ (event.target);
    const rect = target?.getBoundingClientRect();
    const correctedMouseX = event.clientX - rect.left;
    const correctedMouseY = event.clientY - rect.top;
    return { correctedMouseX, correctedMouseY };
};

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
            const { correctedMouseX, correctedMouseY } = correctMousePosition(event);
            this.isHovered =
                correctedMouseX >= this.position.x &&
                correctedMouseX <= this.position.x + this.size.x &&
                correctedMouseY >= this.position.y &&
                correctedMouseY <= this.position.y + this.size.y;
        };

        /** @type {(event: MouseEvent) => void} */
        this.mouseClickListener = (event) => {
            const { correctedMouseX, correctedMouseY } = correctMousePosition(event);
            if (
                correctedMouseX >= this.position.x &&
                correctedMouseX <= this.position.x + this.size.x &&
                correctedMouseY >= this.position.y &&
                correctedMouseY <= this.position.y + this.size.y
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
        // If we're hovered, draw a shadow
        if (this.isHovered) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(this.position.x + 5, this.position.y + 5, this.size.x, this.size.y);
        }
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
