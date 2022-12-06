import Mario from './sprites/Mario';
import Coin from './sprites/Coin';
import Mushroom from './sprites/Mushroom';

// enemies
import Goomba from './sprites/Goomba';
import Turtle from './sprites/Turtle';

import SMBTileSprite from './sprites/SMBTileSprite';
import Fire from './sprites/Fire';

//import makeAnimations from './helpers/animations';

class GameScene extends Phaser.Scene {

  constructor(test) {
    super({
      key: 'GameScene'
    });
  }

  preload() {

    // Music to play. It's not properly edited for an continous loop, but game play experience isn't really the aim of this repository either.
    this.load.audio('overworld', [
      'assets/audio/overworld.ogg',
      'assets/audio/overworld.mp3'
    ]);

    // Sound effects in a audioSprite.
    this.load.audioSprite('sfx', 'assets/audio/sfx.json', [
      'assets/audio/sfx.ogg',
      'assets/audio/sfx.mp3'
    ], {
      instances: 4
    });

    //this.load.image('blue-sky', 'assets/images/blue-sky.png'); // 16-bit later
    this.load.image('clouds', 'assets/images/clouds.png'); // 16-bit later

    // tilemap
    this.load.image('SuperMarioBros-World1-1', 'assets/tilemaps/tiles/super-mario.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/super-mario.json');

    // carrega os sprites
    // Support for switching between 8-bit and 16-bit tiles
    //this.load.spritesheet('tiles', 'assets/tilemaps/tiles/super-mario.png', {frameWidth: 16, frameHeight: 16, spacing: 2});
    //this.load.spritesheet('tiles-16bit', 'assets/tilemaps/tiles/super-mario-16bit.png', {frameWidth: 16, frameHeight: 16, spacing: 2});
    //this.load.spritesheet('mario', 'assets/sprites/mario-sprites.png', {frameWidth: 16,frameHeight: 32});
    // Beginning of an atlas to replace the spritesheets above. Always use spriteatlases. I use TexturePacker to prepare them.
    // Check rawAssets folder for the TexturePacker project I use to prepare these files.
    this.load.atlas('mario-sprites', 'assets/sprites/mario-sprites-full.png', 'assets/sprites/mario-sprites-full.json');

  }

  create() {

    // Add the background as an tilesprite.
    this.cameras.main.setBackgroundColor('#6888ff');
    // marca as bordas desse mapa com 212 x 15 blocos de 16x16 pixels
    this.physics.world.setBounds(0,0,16 * 212, 16 * 15);
    this.cameras.main.setRoundPixels(true);

    // Add and play the music
    this.music = this.sound.add('overworld');

    this.music.play({
      loop: true
    });

    const map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 });
    const tileset = map.addTilesetImage('SuperMarioBros-World1-1');
    this.layer = map.createDynamicLayer('world', tileset);

    //console.log(tileset.tileProperties);
    //console.log(this.objLayer);

    // marca a colisao com os blocos do mapa
    map.setCollision([14, 15, 16, 21, 22, 23, 24, 25, 27, 28, 40, 41]);

    // aqui coloca no array todos os tiles que são do tipo questionMark
    this.questionBlocks = map.filterTiles(tile => {
      if (tile.index == 41) {
        return true;
      }
    });

    this.questionBlocksDelta = 0;

    //coloca os inimigos no mapa
    this.goombaGroup = this.add.group();
    this.turtleGroup = this.add.group();
    map.getObjectLayer('enemies').objects.forEach((enemy) => {
      //console.log(enemy);
      // Goomba!!!
      if (enemy.name == 'goomba') {
        let goomba = new Goomba({
          scene: this,
          layer: this.layer,
          key: 'goomba',
          x: enemy.x,
          y: enemy.y
        });
        this.goombaGroup.add(goomba);
      }

      if (enemy.name == 'turtle') {
        let turtle = new Turtle({
          scene: this,
          layer: this.layer,
          key: 'goomba',
          x: enemy.x,
          y: enemy.y
        });
        this.turtleGroup.add(turtle);
      }

    });

    // aqui vou verificar a camada dos modificadores que veio do tileset
    // e vou colocar os mofificadores dentro das propriedades do tileset
    map.getObjectLayer('modifiers').objects.forEach((modifier) => {
      // pega o tile do mapa que tem esse modificador
      let tile = this.layer.getTileAt(modifier.x / 16, modifier.y / 16 - 1);
      // pega somente as proprieddades desse tile
      // e vai fazendo um merge dos objetos dentro do properties do tile
      if (tile) {
        Object.assign(tile.properties, tileset.tileProperties[modifier.gid - 1]);
        modifier.properties.forEach((item, i) => {
          Object.assign(tile.properties, {[item.name]: item.value});
        });
      }
    });

    //console.log(modifiers);

    this.add.tileSprite(0, 0, this.layer.width, 500, 'clouds');

    // An emitter for bricks when blocks are destroyed.
    this.blockEmitterManager = this.add.particles('mario-sprites');

    this.blockEmitter = this.blockEmitterManager.createEmitter({
      frame: {
        frames: ['brick'],
        cycle: true
      },
      gravityY: 1000,
      lifespan: 1000,
      speed: 400,
      angle: {
        min: -115,
        max: -70
      },
      frequency: -1
    });

    // Mario!!!
    this.mario = new Mario({
      scene: this,
      key: 'mario',
      x: 16 * 6,
      y: 16 * 9
    });

    // aqui informa as colisões do mario com os goombas
    this.physics.add.overlap(this.mario, this.goombaGroup, (mario, goomba) => {

      // aqui verifica no eixo y o quanto da parte de baixo do mario sobrepôe a parte de cima do inimigo
      let overlap = parseInt(mario.body.height + mario.body.y - goomba.body.y);

      // aqui testa se tem velocidade e posicao suficiente para amassar o goomba
      if (mario.body.velocity.y > 40 && overlap >= 3 && overlap <= 5 && goomba.alive) {
        console.log('velocidade e posicao suficiente para amassar');
        mario.body.setVelocityY(-200);
        goomba.dieFlat();
      }
    });

    // aqui informa as colisões do mario com os goombas
    this.physics.add.overlap(this.mario, this.turtleGroup, (mario, turtle) => {
      // aqui verifica no eixo y o quanto da parte de baixo do mario sobrepôe a parte de cima do inimigo
      let overlap = parseInt(mario.body.height + mario.body.y - turtle.body.y);

      // o sinal verifica se o casco vai correr para a esquerda ou direita
      let signal = Math.sign(turtle.body.x + (mario.body.width/2) - mario.body.x);

      // aqui testa se tem velocidade e posicao suficiente para amassar o goomba
      if (mario.body.velocity.y > 40 && overlap >= 8 && overlap <= 10 && turtle.status == 'normal') {
        console.log('velocidade e posicao suficiente para amassar');
        turtle.shell();
        mario.body.setVelocityY(-200);
      }

      if (mario.body.velocity.y > 50 && overlap >= 12 && overlap <= 14 && turtle.status == 'shell') {
        console.log('velocidade e posicao suficiente para correr');
        turtle.slip(signal);
        mario.body.setVelocityY(-200);
      }
    });

    // aqui informa as colisões do mario com o tilemap
    this.physics.add.collider(this.mario, this.layer, (mario, tile) => {
      // aqui testa se a cabeca do mari obateu em alguma coisa
      if (mario.body.blocked.up) {
        //console.log('houve colisao da cabeca do mario');
        //console.log(tile);
        // se ele bateu numa questionMark então verifica de qual tipo será o objeto
        if (tile.index == 41 || tile.index == 42 || tile.index == 43) {
          //console.log(tile);
          tile.index = 44;
          // liga um contador de tempo até 12
          this.setIntervalCount((count) => {
            if (count < 6) {
              tile.pixelY--;
            }
            else {
              tile.pixelY++;
            }

            //quando o questionMark estiver no alto, libera os sprites
            if (count == 6) {
              //console.log(tile.properties.powerUp)
              if (tile.properties.powerUp == "mushroom") {
                let mushroom = new Mushroom({
                  scene: mario.scene,
                  layer: this.layer,
                  key: 'mushroom',
                  x: tile.x * 16 + 8,
                  y: tile.y * 16 - 16,
                  action: 'move',
                });
                this.physics.add.overlap(mario, mushroom, (mario, mushroom) => {
                  // aqui detecta a colisão do mario com o cogumelo
                  console.log('colidiu com o cogumelo');
                  mario.grow();
                  mushroom.destroy();

                });
              } else {
                // se não é nenhuma das outras, é uma moeda
                // mostra a moeda na animação de sumir
                let coin = new Coin({
                  scene: this.mario.scene,
                  key: 'coin',
                  x: tile.x * 16 + 8,
                  y: tile.y * 16 - 16,
                  action: 'disapear'
                });

              }// else coin

            }
          }, 8, 12); // 8 milisegundos e 12 ciclos

        }// fim if questionMark

        //se ele bateu num bloco de tijolo, destrou ele ou desloca pra cima
        if (tile.index == 15 && !tile.properties.anim) {
          //console.log(tile);
          // se o mário está grande, explode o bloco
          if (mario.state == 'Super') {
            this.layer.tilemap.removeTileAt(tile.x, tile.y);
            this.blockEmitter.explode(6, tile.pixelX + 8, tile.pixelY);

          } else {

            // se o mário está pequeno, desloca o bloco
            tile.properties.anim = true;
            this.setIntervalCount((count) => {
              if (count < 6) {
                tile.pixelY--;
              }
              else {
                tile.pixelY++;
              }
              if (count == 11)
                tile.properties.anim = false;
            }, 8, 12);
          }

        }

      }// end if cabecada mario

    });



    // define o input do teclado
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    //console.log(Phaser.Input.Keyboard.KeyCodes);
  }

  update(time, delta) {

    if (this.keyA.isDown) {
      //console.log(this.mario.body.position);
    }

    if (this.keySPACE.isDown) {
      //console.log(this.mario.body.position);
    }

    if (this.mario.x >= 202 && this.mario.x <= 3192)
      this.cameras.main.centerOnX(this.mario.x);

    // Run the update method of Mario
    this.mario.update(this.cursorKeys, time, delta);

    // Run the update method of all enemies
    this.goombaGroup.children.entries.forEach((sprite) => {
      sprite.update(time, delta);
    });

    this.turtleGroup.children.entries.forEach((sprite) => {
      sprite.update(time, delta);
    });

    this.questionBlockAnimation(delta);

  }

  questionBlockAnimation(delta) {

    this.questionBlocksDelta += delta;

    let frame = 0;
    if (this.questionBlocksDelta > 1100)
      frame = 4;
    else if (this.questionBlocksDelta > 900)
      frame = 3;
    else if (this.questionBlocksDelta > 700)
      frame = 2;
    else if (this.questionBlocksDelta > 500)
      frame = 1;

    for (let tile of this.questionBlocks) {

      if (tile.index != 44) {
        if (frame == 4) {
          tile.index = 41;
        }
        else if (frame == 3) {
          tile.index = 42;
        }
        else if (frame == 2) {
          tile.index = 43
        }
        else if (frame == 1) {
          tile.index = 42;
        }
      }

      //console.log(this.questionBlocksDelta);
    }

    if (this.questionBlocksDelta > 1100) {
      this.questionBlocksDelta = 0;
      frame = 0;
    }

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

  copyObject(obj) {
		return JSON.parse(JSON.stringify(obj));
	}


}// end class

export default GameScene;
