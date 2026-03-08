// @ts-check
import Vector from './Vector.js';
import { Entity } from './Entity.js';

/**
 * Generic 2D game engine with a fixed-timestep update loop.
 *
 * Responsibilities:
 * - Fixed timestep game loop
 * - Entity lifecycle management
 * - Collision detection (AABB)
 * - World-to-screen camera transform
 * - Rendering orchestration
 *
 * This class is intentionally game-agnostic.
 * Game-specific rules should be implemented in subclasses.
 */
export class GameEngine {
    /** Target simulation frames per second */
    FPS_TARGET = 60;

    /** Duration of a single simulation frame in milliseconds */
    FRAME_TIME = 1000 / this.FPS_TARGET;

    /**
     * @param {HTMLCanvasElement} canvas - Canvas used for rendering
     * @param {boolean} [debug=false] - Enables debug rendering
     */
    constructor(canvas, debug = false) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;

        /** @type {boolean} */
        this.debug = debug;

        /** @type {CanvasRenderingContext2D | null} */
        this.context = canvas.getContext('2d');
        if (!this.context) {
            throw new Error('Failed to acquire 2D rendering context');
        }

        /** @type {Entity[]} */
        this.entities = [];

        /** Indicates whether the engine loop is currently running */
        this.running = false;

        /** Timestamp of the previous frame (ms) */
        this.lastUpdateTime = 0;

        /** Accumulated unprocessed time for fixed timestep updates (ms) */
        this.accumulator = 0;

        /**
         * Camera offset in world coordinates.
         * This value is subtracted from all rendered entities.
         * @type {Vector}
         */
        this.cameraOffset = new Vector(0, 0);

        /**
         * Callbacks executed once per rendered frame.
         * @type {Array<() => void>}
         */
        this.tickCallbacks = [];

        // Ensure correct `this` binding for requestAnimationFrame
        this.gameLoop = this.gameLoop.bind(this);

        /** @type {Array<() => void>} */
        this.cleanupCallbacks = [];
    }

    /**
     * Initializes game-specific assets and state.
     * Override in subclasses to implement custom initialization logic.
     */
    async initEngine() {}

    /**
     * Starts the game loop.
     * Has no effect if already running.
     */
    start() {
        if (this.running) return;
        this.initEngine().then(() => {
            this.running = true;
            this.lastUpdateTime = performance.now();
            requestAnimationFrame(this.gameLoop);
        });
    }

    /**
     * Stops the game loop.
     * Rendering and updates cease immediately.
     */
    stop() {
        this.running = false;
    }

    /**
     * Main game loop callback.
     * Uses a fixed timestep update with time accumulation.
     *
     * @param {number} timestamp - High-resolution timestamp from requestAnimationFrame
     */
    gameLoop(timestamp) {
        if (!this.running) return;

        this.accumulator += timestamp - this.lastUpdateTime;
        this.lastUpdateTime = timestamp;

        while (this.accumulator >= this.FRAME_TIME) {
            this.update(1);
            this.accumulator -= this.FRAME_TIME;
        }

        this.render();
        requestAnimationFrame(this.gameLoop);

        this.tickCallbacks.forEach((cb) => cb());
    }

    /**
     * Updates all entities and processes collisions.
     *
     * @param {number} deltaFrames - Number of fixed simulation frames to advance
     */
    update(deltaFrames) {
        for (const entity of this.entities) {
            entity.update?.(deltaFrames, this);
        }

        this.handleCollisions();
    }

    /**
     * Performs pairwise AABB collision detection between entities.
     */
    handleCollisions() {
        for (let i = 0; i < this.entities.length; i++) {
            const a = this.entities[i];
            if (a.NO_COLLISION) continue;

            for (let j = i + 1; j < this.entities.length; j++) {
                const b = this.entities[j];
                if (b.NO_COLLISION) continue;

                if (this.checkCollision(a, b)) {
                    a.onCollision?.(b, this);
                    b.onCollision?.(a, this);
                }
            }
        }
    }

    /**
     * Renders the current world state to the canvas.
     */
    render() {
        const ctx = this.context;
        if (!ctx) return;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.save();
        ctx.translate(-this.cameraOffset.x, -this.cameraOffset.y);

        for (const entity of this.entities) {
            ctx.save();

            if (entity.STATIC_ON_SCREEN) {
                ctx.translate(this.cameraOffset.x, this.cameraOffset.y);
            }

            entity.render(ctx, this.debug);
            ctx.restore();
        }

        ctx.restore();
    }

    /**
     * Adds an entity to the engine.
     *
     * @param {Entity} entity - Entity to add
     */
    addEntity(entity) {
        this.entities.push(entity);
        entity.onAdd?.(this);
    }

    /**
     * Removes an entity from the engine.
     *
     * @param {Entity} entity - Entity to remove
     */
    removeEntity(entity) {
        this.entities = this.entities.filter((e) => e !== entity);
        entity.destroy?.(this);
    }

    /**
     * Registers a callback executed once per rendered frame.
     *
     * @param {() => void} callback
     */
    onTick(callback) {
        this.tickCallbacks.push(callback);
    }

    /**
     * Axis-Aligned Bounding Box collision test.
     *
     * @param {Entity} a
     * @param {Entity} b
     * @returns {boolean} True if the entities overlap
     */
    checkCollision(a, b) {
        return (
            a.position.x < b.position.x + b.size.x &&
            a.position.x + a.size.x > b.position.x &&
            a.position.y < b.position.y + b.size.y &&
            a.position.y + a.size.y > b.position.y
        );
    }

    /**
     * Destroys the engine and all its entities.
     */
    destroy() {
        this.stop();
        for (const entity of this.entities) {
            entity.destroy?.(this);
        }
        this.cleanupCallbacks.forEach((cb) => cb());
    }

    /**
     * Registers a callback to be executed when the engine is destroyed.
     *
     * @param {() => void} callback
     */
    registerCleanupCallback(callback) {
        this.cleanupCallbacks.push(callback);
    }
}
