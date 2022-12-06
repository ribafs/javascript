/* game_width = 202 (8sq.);   game_height = 354 (16sq.); */
/* sq_width = 23px (25);      sq_height = 20px (22); */

const COLOR_SPRITES = {
  top: {
    red: [0, 8, 7, 7],
    yellow: [8, 8, 7, 7],
    blue: [16, 8, 7, 7]
  },

  bottom: {
    red: [0, 16, 7, 7],
    yellow: [8, 16, 7, 7],
    blue: [16, 16, 7, 7]
  },

  left: {
    red: [0, 24, 7, 7],
    yellow: [8, 24, 7, 7],
    blue: [16, 24, 7, 7]
  },

  right: {
    red: [0, 32, 7, 7],
    yellow: [8, 32, 7, 7],
    blue: [16, 32, 7, 7]
  },

  single: {
    red: [0, 40, 7, 7],
    yellow: [8, 40, 7, 7],
    blue: [16, 40, 7, 7]
  },

  empty: {
    red: [0, 48, 7, 7],
    yellow: [8, 48, 7, 7],
    blue: [16, 48, 7, 7]
  }
}

export default class Pill {
  constructor(options) {
    this.gameWidth = options.game.gameWidth;
    this.gameHeight = options.game.gameHeight;
    this.width = options.game.squareWidth;
    this.height = options.game.squareHeight;
    this.margin = options.game.margin;
    this.totalWidth = this.width + this.margin;
    this.totalHeight = this.height + this.margin;
    this.spritesheet = options.game.spritesheet;
    this.board = options.game.board;
    this.game = options.game;

    this.c0 = options.colors[0];
    this.c1 = options.colors[1];

    this.coordinates = [0, 3];  // coordinates[0]= y/row, coordinates[1]= x/col
    this.position = this.board.getPosition(this.coordinates);

    this.rotation = 0;
    this.orientation = this.getOrientation();
    this.lastDrop = null;
    this.dropSpeed = options.game.speed;

    this.stationary = false;
    this.connected = true;
  }

  // methods involved in changing pill's instance variables/own state

  getOrientation() {
    switch (this.rotation) {
      case 0:
        return "horizontal";
      case 90:
        return "vertical";
      case 180:
        return "horizontal";
      case 270:
        return "vertical";
    }
  }

  canMoveLeft() {
    let [currRow, currCol] = this.coordinates;
    let prevRow = currRow - 1;
    let prevCol = currCol - 1;

    if (this.orientation === "horizontal") {
      if (this.board.isEmpty([currRow, prevCol])) {
        return true;
      } else {
        return false;
      }
    } else if (this.orientation === "vertical") {
      if (this.board.isEmpty([currRow, prevCol]) && 
        this.board.isEmpty([prevRow, prevCol])) {
          return true;
      } else {
        return false;
      }
    }
  }

  canMoveRight() {
    let [currRow, currCol] = this.coordinates;
    let prevRow = currRow - 1;
    let nextCol = currCol + 1;

    if (this.orientation === "horizontal") {
      if (this.board.isEmpty([currRow, nextCol]) &&
        this.board.isEmpty([currRow, nextCol + 1])) {
          return true;
      } else {
        return false;
      }
    } else if (this.orientation === "vertical") {
      if (this.board.isEmpty([currRow, nextCol]) &&
        this.board.isEmpty([prevRow, nextCol])) {
        return true;
      } else {
        return false;
      }
    }
  }

  moveLeft() {
    if (this.game.paused) return;

    if (!this.stationary && this.canMoveLeft()) {
      this.coordinates[1] -= 1;
      this.position = this.board.getPosition(this.coordinates);
    }
  }

  moveRight() {
    if (this.game.paused) return;

    if (!this.stationary && this.canMoveRight()) {
      if ((this.orientation === "horizontal" && this.coordinates[1] < 6) ||
        (this.orientation === "vertical" && this.coordinates[1] < 7)) {
        this.coordinates[1] += 1;
        this.position = this.board.getPosition(this.coordinates);
      }
    }
  }

  canFlip() {
    let [currRow, currCol] = this.coordinates;
    let prevRow = currRow - 1;
    let prevCol = currCol - 1;
    let nextRow = currRow + 1;
    let nextCol = currCol + 1;

    if (this.orientation === "horizontal") {
      if (!this.board.isEmpty([prevRow, currCol]) &&
        !this.board.isEmpty([prevRow, nextCol]) &&
        !this.board.isEmpty([nextRow, currCol]) &&
        !this.board.isEmpty([nextRow, nextCol])) {
          return false;
        } else {
          return true;
        }
    } else if (this.orientation === "vertical") {
      if (!this.board.isEmpty([prevRow, prevCol]) &&
        !this.board.isEmpty([currRow, prevCol]) &&
        !this.board.isEmpty([prevRow, nextCol]) &&
        !this.board.isEmpty([currRow, nextCol])) {
        return false;
      } else {
        return true;
      }
    }
  }

  adjustFlip() {
    let [currRow, currCol] = this.coordinates;
    let prevRow = currRow - 1;
    let prevCol = currCol - 1;
    let nextRow = currRow + 1;
    let nextCol = currCol + 1;

    if (this.orientation === "vertical") {
      if (!this.board.isEmpty([prevRow, currCol])) {
        if (!this.board.isEmpty([nextRow, currCol])) {
          if (!this.board.isEmpty([prevRow, nextCol])) {
            this.coordinates = [nextRow, nextCol];
            this.position = this.board.getPosition(this.coordinates);
          } else {
            this.coordinates = [currRow, nextCol];
            this.position = this.board.getPosition(this.coordinates);
          }
        } else {
          this.coordinates = [nextRow, currCol];
          this.position = this.board.getPosition(this.coordinates);
        }
      } 
    } else if (this.orientation === "horizontal") {
      if (!this.board.isEmpty([currRow, nextCol])) {
        if (!this.board.isEmpty([currRow, prevCol])) {
          if (!this.board.isEmpty([prevRow, nextCol])) {
            this.coordinates = [prevRow, prevCol];
            this.position = this.board.getPosition(this.coordinates);
          } else {
            this.coordinates = [prevRow, currCol];
            this.position = this.board.getPosition(this.coordinates);
          }
        } else {
          this.coordinates = [currRow, prevCol];
          this.position = this.board.getPosition(this.coordinates);
        }
      } 
    }
  }

  flipLeft() {
    if (this.game.paused) return;

    if (!this.stationary && this.canFlip()) {
      let newRotation = this.rotation - 90;
      this.rotation = (newRotation >= 0) ? 
        newRotation : 
        (((this.rotation - 90) % 360) + 360) % 360; // funkiness of % with negs
      this.orientation = this.getOrientation();

      this.adjustFlip();
    }
  }

  flipRight() {
    if (this.game.paused) return;

    if (!this.stationary && this.canFlip()) {
      this.rotation = (this.rotation + 90) % 360;
      this.orientation = this.getOrientation();

      this.adjustFlip();
    }
  }

  canDrop() {
    let [currRow, currCol] = this.coordinates;
    let nextRow = currRow + 1;
    let nextCol = currCol + 1;

    if (this.orientation === "horizontal") {
      if (this.board.isEmpty([nextRow, currCol]) && 
        this.board.isEmpty([nextRow, nextCol])) {
          return true;
        } else {
          return false;
        }
    } else if (this.orientation === "vertical") {
      if (this.board.isEmpty([nextRow, currCol])) {
        return true;
      } else {
        return false;
      }
    }
  }

  drop() {
    if (this.canDrop()) {
      this.coordinates[0] += 1;
      this.position = this.board.getPosition(this.coordinates);
    } else {
      this.freeze();
    }
  }

  applyGravity() {

    if (this.canDrop()) {
      let [currRow, currCol] = this.coordinates;
      let prevRow = currRow - 1;
      let nextCol = currCol + 1;

      this.coordinates[0] += 1;
      this.position = this.board.getPosition(this.coordinates);

      if (this.orientation === "horizontal") {
        this.board.grid[currRow][currCol] = null;
        this.board.grid[currRow][nextCol] = null;
      } else if (this.orientation === "vertical") {
        this.board.grid[prevRow][currCol] = null;
        this.board.grid[currRow][currCol] = null;
      }

      this.board.recordPill(this);
      return true;
    }
    return false;
  }

  speedDrop() {
    if (this.game.paused) return;
    this.drop();
  }

  freeze() {
    this.stationary = true;
    this.game.pillFalling = true;
    this.game.fallenPills.push(this);
    this.game.currentHandler.removeListener();

    this.board.recordPill(this);
    this.board.clearFours();

    // console.log(this.board.applyGravity());

    this.board.applyGravity()
      .then(() => {
        this.board.clearFours(500);
        return this.board.applyGravity()
      }).then(() => {
        this.board.clearFours(1000);
        return this.board.applyGravity()
      }).then(() => {
        if (this.game.viruses.length === 0) {
          let wonGame = document.getElementById('won-game');
          wonGame.classList.remove('hidden');

          let newStage = document.getElementById('new-stage');
          newStage.addEventListener('click', () => {
            this.game.newGame('won-game');
          })

        } else if (!this.board.boardFull()) {
          this.game.loadNextPill();
        } else {
          let lostGame = document.getElementById('lost-game');
          lostGame.classList.remove('hidden');

          let newGame = document.getElementById('new-game');
          newGame.addEventListener('click', () => {
            this.game.newGame('lost-game');
          })
        }
      })
  }

  deleteFromGame() {
    let fallenPillsIndex = this.game.fallenPills.indexOf(this);
    let gameObjectsIndex = this.game.gameObjects.indexOf(this);

    this.game.fallenPills.splice(fallenPillsIndex, 1);
    this.game.gameObjects.splice(gameObjectsIndex, 1);
  }

  // methods involved in displaying/drawing the pills

  getSprites() {
    let left, right, top, bottom;
    let c0 = this.c0;
    let c1 = this.c1;

    if (this.rotation === 0) {
      left = COLOR_SPRITES.left[c0];
      right = COLOR_SPRITES.right[c1];
      return { left: left, right: right };
    } else if (this.rotation === 180) {
      left = COLOR_SPRITES.left[c1];
      right = COLOR_SPRITES.right[c0];
      return { left: left, right: right };
    } else if (this.rotation === 90) {
      top = COLOR_SPRITES.top[c0];
      bottom = COLOR_SPRITES.bottom[c1];
      return { top: top, bottom: bottom };
    } else if (this.rotation === 270) {
      top = COLOR_SPRITES.top[c1];
      bottom = COLOR_SPRITES.bottom[c0];
      return { top: top, bottom: bottom};
    }
  }

  drawHorizontal(ctx) {
    let sprites = this.getSprites();
    ctx.drawImage(
      spritesheet,
      sprites.left[0],
      sprites.left[1],
      sprites.left[2],
      sprites.left[3],
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    ctx.drawImage(
      spritesheet,
      sprites.right[0],
      sprites.right[1],
      sprites.right[2],
      sprites.right[3],
      this.position.x + 25,
      this.position.y,
      this.width,
      this.height
    );
  }

  drawVertical(ctx) {
    let sprites = this.getSprites();
    ctx.drawImage(
      spritesheet,
      sprites.top[0],
      sprites.top[1],
      sprites.top[2],
      sprites.top[3],
      this.position.x,
      this.position.y - 22,
      this.width,
      this.height
    );
    ctx.drawImage(
      spritesheet,
      sprites.bottom[0],
      sprites.bottom[1],
      sprites.bottom[2],
      sprites.bottom[3],
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  drawNextPill(ctx) {
    let sprites = this.getSprites();
    ctx.drawImage(
      spritesheet,
      sprites.left[0],
      sprites.left[1],
      sprites.left[2],
      sprites.left[3],
      27,
      2,
      this.width,
      this.height
    );
    ctx.drawImage(
      spritesheet,
      sprites.right[0],
      sprites.right[1],
      sprites.right[2],
      sprites.right[3],
      27 + 25,
      2,
      this.width,
      this.height
    );
  }

  draw(ctx) {
    if (this.orientation === "horizontal") {
      this.drawHorizontal(ctx);
    } else if (this.orientation === "vertical") {
      this.drawVertical(ctx);
    }
  }

  update(timestamp) {
    if (!this.lastDrop) this.lastDrop = timestamp;

    if (!this.stationary) {
      let dropInterval = 1200 - (200 * this.dropSpeed);
  
      if ((timestamp - this.lastDrop) > dropInterval) {
        this.drop();
        this.lastDrop = timestamp;
      }
    }

  }
}