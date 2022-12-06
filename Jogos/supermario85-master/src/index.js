import Phaser from "phaser";
import GameScene from './GameScene';

const config = {
  type: Phaser.AUTO,
  pixelArt: true,
  roundPixels: true,
  parent: "phaser-example",
  width: 400,
  height: 240,
  zoom: 2.5,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 800
      },
      debug: false
    }
  },
  scene: [
    GameScene
  ]
};

const game = new Phaser.Game(config);
