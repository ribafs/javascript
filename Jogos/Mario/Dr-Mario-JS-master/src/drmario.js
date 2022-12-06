import Game from './game';
import Mario from './mario';
import Soundboard from './soundboard';

const GAME_WIDTH = 250;
const GAME_HEIGHT = 492;
const MARGIN = 3;

const SQR_WIDTH = 25 - MARGIN;
const SQR_HEIGHT = 22 - MARGIN;

const BOTTLE = [153, 290, 78, 174];

// utility for ghost typing name under 'created by' field
const printName = function(input) {
  const name = "KEVIN MOCH";
  const timing = 100;
  setTimeout(function() {
    for (let i = 1; i <= name.length; i++) {
      (function(i) {
        setTimeout(function() {
          input.innerText = name.slice(0, i);
        }, timing * i)
      })(i);
    }
  }, 1000);
}

// utility for converting range slider number to a speed string
const getLevel = function(num) {
  switch (num) {
    case 1:
      return "Slow";
    case 2:
      return "Medium";
    case 3:
      return "Fast";
    case 4:
      return "Faster";
    case 5:
      return "Fastest";
  }
}

document.addEventListener('DOMContentLoaded', () => {

  // fade in elements while waiting for google font to load
  const jsLogo = document.getElementById("logo-js");
  const createdBy = document.getElementById('created-by');
  const myName = document.getElementById('kevin-moch');
  const menuSidebar = document.getElementById('menu-sidebar');

  window.setTimeout(()=> {
    jsLogo.style.color = "black";
    createdBy.style.opacity = 1;
    printName(myName);
    window.setTimeout(() => {
      menuSidebar.style.opacity = 1;
    }, 1000);
  }, 100);

  // listener to adjust the displayed game level
  const levelSlide = document.getElementById("level-slide");
  const levelOutput = document.getElementById("curr-level");
  levelOutput.innerHTML = levelSlide.value;

  levelSlide.oninput = function () {
    levelOutput.innerHTML = this.value;
  };

  // listener to adjust the displayed game speed
  const speedSlide = document.getElementById("speed-slide");
  const speedOutput = document.getElementById("curr-speed");
  speedOutput.innerHTML = getLevel(parseInt(speedSlide.value));

  speedSlide.oninput = function () {
    speedOutput.innerHTML = getLevel(parseInt(this.value));
  }

  // grabbing canvases and canvas contexts
  const canvas = document.getElementById("gameScreen");
  const ctx = canvas.getContext("2d");

  const marioCanvas = document.getElementById("dr-mario-canvas");
  const marioCtx = marioCanvas.getContext('2d');

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // grabbing spritesheets
  let miscellaneous = document.getElementById("miscellaneous");
  let spritesheet = document.getElementById("spritesheet");

  spritesheet.addEventListener("load", () => {
    ctx.drawImage(miscellaneous,
      BOTTLE[0], BOTTLE[1], BOTTLE[2], BOTTLE[3],
      0, 0, GAME_WIDTH, GAME_HEIGHT);

    let gameOptions = document.getElementById('game-options');
    let startButton = document.getElementById('start-button');

    const soundboard = new Soundboard();
    
    startButton.addEventListener('click', () => {
      let stageLevel = parseInt(levelSlide.value);
      let stageSpeed = parseInt(speedSlide.value);

      let game = new Game(
        GAME_WIDTH, 
        GAME_HEIGHT,
        MARGIN, 
        SQR_WIDTH, 
        SQR_HEIGHT, 
        spritesheet,
        stageLevel,
        stageSpeed
      );
  
      let mario = new Mario({
        spritesheet: miscellaneous,
        game: game
      });

      gameOptions.classList.add('muted');
      // startButton.innerText = "RESTART";
  
      game.start();

      function gameLoop(timestamp) {
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        ctx.drawImage(miscellaneous, 
          BOTTLE[0], BOTTLE[1], BOTTLE[2], BOTTLE[3], 
          0, 0, GAME_WIDTH, GAME_HEIGHT);
  
        game.update(timestamp);
        game.draw(ctx);
        mario.draw(marioCtx);
  
        requestAnimationFrame(gameLoop);
      }
      
      requestAnimationFrame(gameLoop);
    });
  });
  
});