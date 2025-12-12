// @ts-check
import { GameEngine } from '../../../js/engine/GameEngine.js';
import Player from './Player.js';
import Platform from './Platform.js';
import Wallpaper from './Background.js';
import Header from './Header.js';
import Vector from '../../../js/engine/Vector.js';
const canvas = document.getElementById('gameCanvas');
if (!(canvas instanceof HTMLCanvasElement)) {
	throw new Error('Canvas element not found');
}
const gameEngine = new GameEngine(canvas);
const player = new Player('assets/player');
const bg = new Wallpaper();
const header = new Header();

gameEngine.addEntity(bg); // Background should be added first to render behind other entities
gameEngine.addEntity(header);
gameEngine.addEntity(player);

// Put down the initial platforms. They will be the same every time.
const platforms = [new Platform(50, canvas.height - 100, 'standard')];
for (let i = 0; i < 10; i++) {
	const platformX = Math.random() * (canvas.width - 60);
	const platformY = i * -60 + 100;
	platforms.push(new Platform(platformX, platformY, 'standard'));
}
platforms.forEach((platform) => gameEngine.addEntity(platform));
// Put the player above the first platform
player.position = platforms[0].position.add(new Vector(10, -400));

gameEngine.onTick((deltaFrames) => {
	// Score is based on the y-offset of the game engine
	const currentScore = Math.max(0, Math.floor(gameEngine.gameOffset.y));
	header.score = currentScore;
});
gameEngine.start();
