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
platforms.forEach((platform) => gameEngine.addEntity(platform));
// Put the player above the first platform
player.position = platforms[0].position.subtract(new Vector(0, 100));

gameEngine.onTick(() => {
	// Score is based on the y-offset of the game engine
	// const currentScore = Math.max(0, Math.floor(-gameEngine.gameOffset.y));
	header.score = player.score;

	platforms.forEach((platform, index) => {
		if (platform.position.y - gameEngine.gameOffset.y > canvas.height) {
			gameEngine.removeEntity(platform);
			platforms.splice(index, 1);
		}
	});
	// Add new platforms if needed
	while (platforms.length < 10) {
		// Pick a random x within the canvas width
		const platformX = Math.random() * (canvas.width - 60);
		// Position the new platform above the highest existing platform
		const highestPlatformY = Math.min(...platforms.map((p) => p.position.y));
		const platformY = highestPlatformY - Math.random() * 80 - 50;
		const newPlatform = new Platform(platformX, platformY, 'standard');
		platforms.push(newPlatform);
		gameEngine.addEntity(newPlatform);
	}
});
gameEngine.start();
