const MARIO_SPRITES = {
  armUp: [0, 201, 23, 39],
  armMid: [25, 201, 30, 39],
  armDown: [65, 201, 22, 39]
}

export default class Mario {
  constructor(options) {
    this.spritesheet = options.spritesheet
    this.stance = "armUp";
    this.game = options.game;
  }

  getSprite() {
    return MARIO_SPRITES[this.stance];
  }

  getXOffset() {
    switch (this.stance) {
      case "armMid":
        return 0;
      case "armUp":
        return 7;
      case "armDown":
        return 8;
    }
  }

  draw(ctx) {
    let sprite = this.getSprite();
    let offset = this.getXOffset() * 3;
    let nextPill = this.game.nextPill;
    ctx.drawImage(
      spritesheet,
      sprite[0],
      sprite[1],
      sprite[2],
      sprite[3],
      30 + offset,
      15,
      90 - offset,
      116
    );
    nextPill.drawNextPill(ctx);
  }
}