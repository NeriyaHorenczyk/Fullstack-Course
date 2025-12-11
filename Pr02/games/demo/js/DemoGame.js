import { GameEngine } from '../../../js/engine/GameEngine.js';
import Player from './Player.js';
import Platform from './Platform.js';

// @ts-check
const canvas = document.getElementById('gameCanvas');
const gameEngine = new GameEngine(canvas);
const ground = new Platform(0, canvas.height - 5, canvas.width, 5);
const player = new Player(100, 100, 'assets/player');
gameEngine.addEntity(ground);
gameEngine.addEntity(player);
gameEngine.start();
