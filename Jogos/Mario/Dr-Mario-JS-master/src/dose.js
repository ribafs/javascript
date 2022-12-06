const DOSE_SPRITES = {
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

export default class Dose {
  constructor(options) {
    this.color = options.color;
    this.coordinates = options.coordinates;
    this.pill = options.pill || null;
    this.otherHalf = options.otherHalf || null;
    this.single = options.single || false;

    this.game = options.game;
    this.spritesheet = this.game.spritesheet;

    this.position = this.game.board.getPosition(this.coordinates);
    this.width = options.game.squareWidth;
    this.height = options.game.squareHeight;
  }

  addToGame() {
    this.game.singleDoses.push(this);
    this.game.gameObjects.push(this);
  }

  deleteFromGame() {
    let singleDoseIndex = this.game.singleDoses.indexOf(this);
    let gameObjectsIndex = this.game.gameObjects.indexOf(this);

    this.game.singleDoses.splice(singleDoseIndex, 1);
    this.game.gameObjects.splice(gameObjectsIndex, 1);
  }
  
  canDrop() {
    if (!this.single) {
      console.log('this method is not for pills!!!!');
      return null;
    }

    let [currRow, currCol] = this.coordinates;
    let nextRow = currRow + 1;

    if (this.game.board.isEmpty([nextRow, currCol])) {
      return true;
    } else {
      return false;
    }
  }
  
  applyGravity() {
    if (!this.single) {
      console.log('this method is not for pills!!!!');
      return null;
    }
    
    if (this.canDrop()) {
      let [currRow, currCol] = this.coordinates;
      let nextRow = currRow + 1;

      this.coordinates[0] += 1;
      this.position = this.game.board.getPosition(this.coordinates);

      this.game.board.grid[currRow][currCol] = null;
      this.game.board.grid[nextRow][currCol] = this;

      return true;
    }
    return false;
  }

  // display for single doses only

  getSprite() {
    let color = this.color;
    return DOSE_SPRITES.single[color];
  }

  update(timestamp) {

  }

  draw(ctx) {
    const sprite = this.getSprite();
    ctx.drawImage(
      this.spritesheet,
      sprite[0],
      sprite[1],
      sprite[2],
      sprite[3],
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }
}