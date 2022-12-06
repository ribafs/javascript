import InputHandler from './input';
import Board from './board';
import Pill from './pill';

const COLORS = ["red", "yellow", "blue"];

export default class Game {

  constructor(gameWidth, gameHeight, margin, squareWidth, squareHeight, 
      spritesheet, level, speed) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.margin = margin;
    this.squareWidth = squareWidth;
    this.squareHeight = squareHeight;
    this.spritesheet = spritesheet;
    this.level = level ? level : 0;
    this.speed = speed ? speed : 1;

    this.paused = false;
    this.pillFalling = false;
    this.score = 0;

    this.board = new Board(this);
    this.viruses = this.board.populateViruses();

    this.fallenPills = [];
    this.singleDoses = [];

    this.currentPill = this.generatePill();
    this.nextPill = this.generatePill();
  }

  start() {
    let levelDisplay = document.getElementById('stage-level-display');
    levelDisplay.innerText = this.level;

    this.virusDisplay = document.getElementById('stage-viruses-display');
    this.virusDisplay.innerText = this.viruses.length;

    this.scoreDisplay = document.getElementById('stage-score-display');
    this.scoreDisplay.innerText = this.score;

    let stageInfo = document.getElementById('stage-info');
    stageInfo.classList.toggle('hidden');

    // let pauseButton = document.getElementById('pause-button');
    // pauseButton.addEventListener('click', () => {
    //   this.paused = !this.paused;
    // });

    this.gameObjects = [
      ...this.viruses,
      ...this.fallenPills,
      ...this.singleDoses,
      this.currentPill
    ];

    this.currentHandler = new InputHandler(this.currentPill);
  }

  generatePill() {
    let c0 = COLORS[Math.floor(Math.random() * 3)];
    let c1 = COLORS[Math.floor(Math.random() * 3)];

    let newPill = new Pill({
      colors: [c0, c1],
      game: this
    });

    return newPill;
  }

  loadNextPill() {
    const that = this;

    window.setTimeout(function(){
      that.currentPill = that.nextPill;
      that.gameObjects.push(that.currentPill);
      that.currentHandler = new InputHandler(that.currentPill);

      that.nextPill = that.generatePill();
      that.pillFalling = false;  // only for passive falling i.e. gravity (not using this currently)
    }, 100);
  }

  // game utility fxx

  // pause() {
  //   if (!this.pillFalling) {
  //     this.paused = !this.paused;
  //   }
  // }

  // re-reveal game options area upon clicking won-game or lost-game modal (pill.js)
  newGame(modalId) {
    let modal = document.getElementById(modalId);
    let gameOptions = document.getElementById('game-options');
    let startButton = document.getElementById('start-button');
    
    modal.classList.add('hidden');
    gameOptions.classList.remove('muted');
    startButton.innerText = "START";
  }

  update(timestamp) {
    this.virusDisplay.innerText = this.viruses.length;
    this.scoreDisplay.innerText = this.score;
    // if (this.paused) return;
    this.gameObjects.forEach(object => object.update(timestamp));
  }

  draw(ctx) {
    this.gameObjects.forEach(object => object.draw(ctx));
  }
}