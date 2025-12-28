import { startGame as startWorm, stopGame as stopWorm } from '../games/snake/js/main.js';
import { startGame as startDoodle, stopGame as stopDoodle } from '../games/doodle_jump/js/main.js';

const gameConfig = {
    worm: {
        title: 'Worm',
        subtitle: 'A Worm Game',
        canvas: {
            width: 800,
            height: 600,
        },
        startScript: startWorm,
        stopScript: stopWorm,
    },
    doodle: {
        title: 'Sketch Hopper',
        subtitle: 'A Sketch Hopper Game',
        canvas: {
            width: 800,
            height: 900,
        },
        startScript: startDoodle,
        stopScript: stopDoodle,
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
