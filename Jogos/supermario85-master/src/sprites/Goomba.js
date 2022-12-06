export default class Goomba extends Phaser.GameObjects.Sprite {

  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);
    config.scene.physics.world.setBounds(0,0,3392, 240);
    config.scene.physics.add.collider(this, config.layer);
    config.scene.add.existing(this);
    this.scene = config.scene;
    // é só no play q ele desenha
    this.createAnimations(config.scene);
    this.anims.play('goomba/walk');
    this.body.setSize(16, 16);
    //this.body.setSize(12, 12);
    //this.body.offset.set(10, 4);

    // coloca ele em movimento
    this.body.setVelocityX(30);
    this.body.setBounce(1, .4);
    this.alive = true;

  }

  update(time, delta) {
    // aqui o Goomba verifica os pontos um pouco abaixo dele para ver se existe um tile ou null
    // se for null é pq é um vazio, então ele inverte o movimento
    let tileLeft = this.scene.layer.getTileAtWorldXY(this.body.x, this.body.y + this.body.height + 2 );
    let tileRight = this.scene.layer.getTileAtWorldXY(this.body.x + this.body.width, this.body.y + this.body.height + 2 );

    if (!tileLeft && this.body.velocity.x < -5) {
      //console.log('abismo a esquerda');
      this.body.setVelocityX(this.body.velocity.x * -1);
    }
    else if (!tileRight && this.body.velocity.x > 5) {
      //console.log('abismo a direita');
      this.body.setVelocityX(this.body.velocity.x * -1);
    }
  }

  dieFlat() {
    this.alive = false;
    this.anims.play('goomba/flat');
    this.body.setVelocity(0);
    setTimeout(()=> {
      this.destroy();
    }, 300);
  }

  createAnimations(scene) {

    scene.anims.create({
      key: 'goomba/walk',
      repeat: -1,
      frameRate: 5,
      frames: scene.anims.generateFrameNames('mario-sprites', {prefix: 'goomba/walk', start: 1, end: 2 }),
    });

    scene.anims.create({
      key: 'goomba/flat',
      repeat: -1,
      frameRate: 10,
      frames: [{frame: 'goomba/flat', key: 'mario-sprites'}],
    });

  }

  // funcao para intervalo de tempo com contagem máxima
  setIntervalCount(callback, delay, repetitions) {
    var x = 0;
    callback(x);
    var intervalID = window.setInterval(function () {
      if (++x === repetitions-1) {
        window.clearInterval(intervalID);
      }
      callback(x);
    }, delay);
  }


}
