export default class Mario extends Phaser.GameObjects.Sprite {

  constructor(config) {

    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);
    config.scene.physics.world.setBounds(0,0,3392, 240);
    config.scene.add.existing(this);
    this.scene = config.scene;
    this.body.setMaxVelocity(150, 250);
    this.body.setDrag(500);
    this.state = '';

    this.createAnimations(config.scene);
    this.anims.play('stand');
    this.body.setSize(16, 16);
    this.jumpCount = 0;
    this.body.collideWorldBounds = true;
    //this.setCollideWorldBounds(true);

    // evento que testa se o sprite chegou na borda da tela
    this.body.onWorldBounds = true;
    this.scene.physics.world.on('worldbounds', (body) => {
      console.log('mario bateu na borda da fase');
    });


    //this.onWorldBounds = true;
    //this.body.onCollide = new Phaser.Signal();
    //this.body.onCollide.add(hitSprite, this);
    /*
    this.on('animationcomplete', () => {
      console.log('animation complete');
      if (this.anims.currentAnim.key == 'grow') {
        this.state = 'super';
        //this.scene.physics.world.resume();
      }

    }, this);
    */
  }

  update(keys, time, delta) {

    // se ele estiver encolhendo ou crescendo, não faz update de teclas
    if (this.state == 'growing' || this.state == 'shrinking')
      return;

    // aqui testa se o movimento de jumping pode acorrer
    if (keys.up.isDown &&
        this.body.blocked.down &&
        this.body.velocity.y == 0 &&
        this.jumpCount == 0
        ) {

      this.anims.play('jump' + this.state);
      this.jumpCount = 10;
      this.body.setAccelerationY(-2500);

      // aqui liga um intervalo que funciona enquanto ele está no ar
      this.jumpInterval = setInterval(()=>{
        if (keys.up.isDown)
          this.body.setAccelerationY(-2500);
        else
          this.body.setAccelerationY(0);
        this.jumpCount--;
        if (this.jumpCount == 0 || this.body.blocked.down) {
          clearInterval(this.jumpInterval);
          this.body.setAccelerationY(0);
          this.jumpCount = 0;
        }
      }, 25);
    }

    if (keys.right.isDown) {
      //console.log('seta direita');
      this.flipX = false;
      if (!this.body.blocked.down) {
        this.body.setAccelerationX(150);
      }
      else {
        this.body.setAccelerationX(700);
        if (!this.jumpCount) {
          if (this.body.velocity.x < 0)
            this.anims.play('turn' + this.state, true);
          else
            this.anims.play('walk' + this.state, true);
        }

      }
    }
    else if (keys.left.isDown) {
      this.flipX = true;
      if (!this.body.blocked.down) {
        this.body.setAccelerationX(-150);
      }
      else {
        this.body.setAccelerationX(-700);
        if (!this.jumpCount) {
          if (this.body.velocity.x > 0)
            this.anims.play('turn' + this.state, true);
          else {
            this.anims.play('walk' + this.state, true);
          }

        }
      }
    }
    else if (keys.down.isDown) {
      this.body.setAccelerationY(1000);
      //this.anims.play('walk-down', true);
    }

    // se nenhuma das teclas estão pressionadas
    if (!keys.left.isDown && !keys.right.isDown) {
      this.body.setAccelerationX(0);
    }

    // se nenhuma das teclas estão pressionadas
    if (!keys.up.isDown && !keys.down.isDown) {
      this.body.setAccelerationY(0);
    }

    // aqui fica na posicao de stand se ele está parado, está no chao e nao está pulando
    if (this.body.speed < 6 && this.body.blocked.down && this.jumpCount == 0) {
      this.anims.play('stand' + this.state, true);
    }

  }

  createAnimations(scene) {
    // animacao para o hero
    scene.anims.create({
      key: 'walk',
      repeat: -1,
      frameRate: 10,
      frames: scene.anims.generateFrameNames('mario-sprites', {prefix: 'mario/walk', start: 1, end: 3 }),
    });

    scene.anims.create({
      key: 'walkSuper',
      repeat: -1,
      frameRate: 10,
      frames: scene.anims.generateFrameNames('mario-sprites', {prefix: 'mario/walkSuper', start: 1, end: 3 }),
    });

    scene.anims.create({
      key: 'swim',
      repeat: -1,
      frameRate: 10,
      frames: scene.anims.generateFrameNames('mario-sprites', {prefix: 'mario/swim', start: 1, end: 6 }),
    });

    scene.anims.create({
      key: 'climb',
      repeat: -1,
      frameRate: 10,
      frames: scene.anims.generateFrameNames('mario-sprites', {prefix: 'mario/swin', start: 1, end: 2 }),
    });

    scene.anims.create({
      key: 'stand',
      repeat: -1,
      frameRate: 10,
      frames: [{frame: 'mario/stand', key: 'mario-sprites'}],
    });

    scene.anims.create({
      key: 'standSuper',
      repeat: -1,
      frameRate: 10,
      frames: [{frame: 'mario/standSuper', key: 'mario-sprites'}],
    });

    scene.anims.create({
      key: 'half',
      repeat: -1,
      frameRate: 10,
      frames: [{frame: 'mario/half', key: 'mario-sprites'}],
    });

    scene.anims.create({
      key: 'turn',
      repeat: -1,
      frameRate: 10,
      frames: [{frame: 'mario/turn', key: 'mario-sprites'}],
    });

    // turn não tem para o modo grande
    scene.anims.create({
      key: 'turnSuper',
      repeat: -1,
      frameRate: 10,
      frames: [{frame: 'mario/turnSuper', key: 'mario-sprites'}],
    });

    scene.anims.create({
      key: 'jump',
      repeat: -1,
      frameRate: 10,
      frames: [{frame: 'mario/jump', key: 'mario-sprites'}],
    });

    scene.anims.create({
      key: 'jumpSuper',
      repeat: -1,
      frameRate: 10,
      frames: [{frame: 'mario/jumpSuper', key: 'mario-sprites'}],
    });

    scene.anims.create({
        key: 'grow',
        frames: [
          {frame: 'mario/half', key: 'mario-sprites'},
          {frame: 'mario/stand', key: 'mario-sprites'},
          {frame: 'mario/half', key: 'mario-sprites'},
          {frame: 'mario/standSuper', key: 'mario-sprites'},
          {frame: 'mario/half', key: 'mario-sprites'},
          {frame: 'mario/standSuper', key: 'mario-sprites'},
        ],
        frameRate: 1,
        repeat: 0,
        repeatDelay: 0
    });


  }

  grow() {
    //console.log('grow');
    if (this.state == 'Super')
      return;

    this.state = 'growing';
    this.scene.physics.world.pause();
    //this.anims.play('grow', true);
    this.scene.setIntervalCount((count) => {
      if(count == 0) {
        this.y -= 8;
        this.anims.play('half', true);
      } else if (count == 1) {
        this.y += 8;
        this.anims.play('stand', true);
      } else if (count == 2) {
        this.y -= 8;
        this.anims.play('half', true);
      } else if (count == 3) {
        this.anims.play('standSuper', true);
      } else if (count == 4) {
        this.anims.play('half', true);
      } else if (count == 5) {
        this.anims.play('standSuper', true);
      } else if (count == 6) {
        this.body.setSize(this.width, this.height);
        this.scene.physics.world.resume();
        this.state = 'Super';
      }
    }, 180, 7);

  }

}// end class
