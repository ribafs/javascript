export default class Turtle extends Phaser.GameObjects.Sprite {

  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);
    config.scene.physics.world.setBounds(0,0,3392, 240);
    config.scene.physics.add.collider(this, config.layer);
    config.scene.add.existing(this);
    this.scene = config.scene;
    // é só no play q ele desenha
    this.createAnimations(config.scene);
    this.anims.play('turtle/walk');
    this.body.setSize(16, 24);
    //this.body.setSize(12, 12);
    //this.body.offset.set(10, 4);

    // coloca ele em movimento
    this.body.setVelocityX(20);
    this.body.setBounce(1, .4);
    this.status = 'normal';

  }

  update(time, delta) {

    // aqui desenha o sprite de acordo com a direção que ele vai
    if (this.body.velocity.x > 5) {
      this.flipX = false;
    }
    else if (this.body.velocity.x < -5) {
      this.flipX = true;
    }
    // aqui o Goomba verifica os pontos um pouco abaixo dele para ver se existe um tile ou null
    // se for null é pq é um vazio, então ele inverte o movimento
    let tileLeft = this.scene.layer.getTileAtWorldXY(this.body.x, this.body.y + this.body.height + 2 );
    let tileRight = this.scene.layer.getTileAtWorldXY(this.body.x + this.body.width, this.body.y + this.body.height + 2 );

    if (!tileLeft && this.body.velocity.x < -5 && this.status == 'normal') {
      //console.log('abismo a esquerda');
      this.body.setVelocityX(this.body.velocity.x * -1);
    }
    else if (!tileRight && this.body.velocity.x > 5 && this.status == 'normal') {
      //console.log('abismo a direita');
      this.body.setVelocityX(this.body.velocity.x * -1);
    }

    // verifica se a tartaruga caiu para baixo da borda da tela
    if (this.body.position.y > this.scene.physics.world.bounds.bottom) {
      this.die();
    }

  }

  shell() {
    this.status = 'shell';
    this.anims.play('turtle/shell');
    this.body.setVelocity(0);
    this.reviveTimeout = setTimeout(() => {
      this.revive();
    }, 10000);
  }

  slip(signal) {
    this.status = 'slip';
    clearInterval(this.reviveTimeout);
    this.body.setVelocity(200 * signal);
  }

  revive() {
    this.status = 'normal';
    this.anims.play('turtle/walk', true);
    if (!this.flipX) {
      this.body.setVelocityX(20);
    }
    else {
      this.body.setVelocityX(-20);
    }

  }

  die() {
    console.log('A tartaruga caiu...');
    clearInterval(this.reviveTimeout);
    this.destroy();
  }

  createAnimations(scene) {

    scene.anims.create({
      key: 'turtle/walk',
      repeat: -1,
      frameRate: 5,
      frames: scene.anims.generateFrameNames('mario-sprites', {prefix: 'turtle/turtle', start: 0, end: 1 }),
    });

    scene.anims.create({
      key: 'turtle/shell',
      repeat: -1,
      frameRate: 10,
      frames: [{frame: 'turtle/shell', key: 'mario-sprites'}],
    });

  }

}
