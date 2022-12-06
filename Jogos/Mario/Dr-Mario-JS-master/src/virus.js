const VIRUS_SPRITES = {
  red: {
    0: [0, 88, 7, 7],
    1: [0, 96, 7, 7]
  },

  yellow: {
    0: [0, 112, 7, 7],
    1: [0, 120, 7, 7]
  },

  blue: {
    0: [0, 136, 7, 7],
    1: [0, 144, 7, 7]
  },

  none: {
    0: [108, 260, 8, 8]
  }
}

export default class Virus {
  constructor(options) {
    this.color = options.color;
    this.coordinates = options.coordinates;
    this.spritesheet = options.game.spritesheet;
    this.width = options.game.squareWidth;
    this.height = options.game.squareHeight;
    this.margin = options.game.margin;
    this.board = options.game.board;
    this.game = options.game;

    this.position = this.board.getPosition(this.coordinates);

    this.frame = 0;
    this.lastUpdated = null;
    this.frameLength = 250;
  }

  deleteFromGame() {
    let gameVirusesIndex = this.game.viruses.indexOf(this);
    let gameObjectsIndex = this.game.gameObjects.indexOf(this);

    this.game.viruses.splice(gameVirusesIndex, 1);
    this.game.gameObjects.splice(gameObjectsIndex, 1);
  }

  getSprite() {
    const frame = this.frame;
    switch(this.color) {
      case "red":
        return VIRUS_SPRITES.red[frame];
      case "yellow":
        return VIRUS_SPRITES.yellow[frame];
      case "blue":
        return VIRUS_SPRITES.blue[frame];
      default:
        return VIRUS_SPRITES.none[frame];
    }
  }

  update(timestamp) {
    if (!this.lastUpdated) this.lastUpdated = timestamp;

    if ((timestamp - this.lastUpdated) > this.frameLength) {
      this.frame = (this.frame + 1) % 2;
      this.lastUpdated = timestamp;
    }
  }

  draw(ctx){
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