const gameConfig = {
    worm: {
        title: 'Worm',
        subtitle: 'A Worm Game',
        canvas: {
            width: 800,
            height: 600,
        },
        startScript: () => {},
    },
    ['sketch-hopper']: {
        title: 'Sketch Hopper',
        subtitle: 'A Sketch Hopper Game',
        canvas: {
            width: 800,
            height: 600,
        },
        startScript: () => {},
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

    projectorTitle.textContent = game.title;
    projectorSubtitle.textContent = game.subtitle;
    // Delete the game canvas, if it exists
    const canvas = document.getElementById('game-canvas');
    if (canvas) canvas.remove();

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

        projectorScreenContent.appendChild(canvas);
        game.startScript(canvas);
    };
}
