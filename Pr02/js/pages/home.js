import { startGame as startWorm, stopGame as stopWorm } from '../../games/snake/js/main.js';
import { startGame as startDoodle, stopGame as stopDoodle } from '../../games/doodle_jump/js/main.js';
import { startGame as startBrick, stopGame as stopBrick } from '../../games/brick_breaker/js/main.js';

const gameConfig = {
    worm: {
        title: 'Worm',
        subtitle: 'No legs, no mercy.',
        canvas: {
            width: 800,
            height: 600,
        },
        startScript: startWorm,
        stopScript: stopWorm,
    },

    doodle: {
        title: 'Sketch Hopper',
        subtitle: 'A classic.',
        canvas: {
            width: 800,
            height: 900,
        },
        startScript: startDoodle,
        stopScript: stopDoodle,
    },

    marlo: {
        title: 'Meh Marlo Cousins',
        subtitle: 'Family gatherings, but competitive.',
    },

    lunk: {
        title: 'Adventures of Lunk',
        subtitle: 'Heroism through poor decisions.',
    },

    punchy: {
        title: 'Really Punchy Fellows',
        subtitle: 'Friendship ended with fists.',
    },

    jabbimon: {
        title: 'Jabbímon',
        subtitle: 'Or Pokébowl. We never decided.',
    },

    plumber: {
        title: "Plumber's Ghost House",
        subtitle: 'Fix pipes. Fear ghosts.',
    },

    dong: {
        title: 'Dong',
        subtitle: 'Ding Dong Ping Pong.',
    },

    monkey: {
        title: 'Monkey Smash',
        subtitle: 'Advanced problem-solving via chaos.',
    },

    speedy: {
        title: 'Speedy the Dog',
        subtitle: 'Fast. Loyal. Zero brakes.',
    },

    quickminute: {
        title: 'Quick Minute',
        subtitle: 'Stress, but efficiently.',
    },

    salmon: {
        title: 'Salmon Sways',
        subtitle: 'This is cursed.',
    },

    peepers: {
        title: 'Peepers Creepers',
        subtitle: 'They were watching first.',
    },

    rail: {
        title: 'Rail Rush',
        subtitle: 'Dodge the trains, embrace the chaos.',
    },

    vegetable: {
        title: 'Vegetable Samurai',
        subtitle: 'Honor. Steel. Produce.',
    },

    block: {
        title: 'Block Smasher',
        subtitle: 'Subtlety not included.',
        canvas: {
            width: 800,
            height: 600,
        },
        startScript: startBrick,
        stopScript: stopBrick,
    },
};

const defaultConfig = {
    title: 'GameBox',
    subtitle: 'by Nintetra',
};

export function launchGame(gameId) {
    const game = gameConfig[gameId] || defaultConfig;

    const projectorScreenContent = document.getElementById('projector-screen-content');
    const projectorTitle = document.getElementById('projector-title');
    const projectorSubtitle = document.getElementById('projector-subtitle');

    if (projectorTitle) projectorTitle.textContent = game.title;
    if (projectorSubtitle) projectorSubtitle.textContent = game.subtitle;

    // Delete the game canvas, if it exists
    const existingCanvas = document.getElementById('game-canvas');
    if (existingCanvas) existingCanvas.remove();

    if (!game.canvas) {
        return () => {};
    }

    return () => {
        // Add a canvas, start the appropriate game engine
        const canvas = document.createElement('canvas');
        canvas.id = 'game-canvas';
        canvas.width = game.canvas.width;
        canvas.height = game.canvas.height;
        // Draw the canvas
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (projectorScreenContent) {
            projectorScreenContent.appendChild(canvas);
            if (game.startScript) {
                game.startScript(canvas);
            }
        }

        return () => {
            if (game.stopScript) {
                game.stopScript();
            }
            canvas.remove();
        };
    };
}
