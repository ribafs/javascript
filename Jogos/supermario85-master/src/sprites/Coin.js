export default class Coin extends Phaser.GameObjects.Sprite {

    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
        config.scene.physics.world.enable(this);
        config.scene.physics.world.setBounds(0,0,3392, 240);
        config.scene.add.existing(this);

        // é só no play q ele desenha a moeda animada
        this.createAnimations(config.scene);
        this.anims.play('spin');
        this.body.setSize(16, 16);

        if (config.action == 'disapear') {
          this.disapearMovement(config.scene);
        }
    }

    update() {

    }

    disapearMovement(scene) {
      // aqui é o movimento de subida da moeda
      scene.add.tween({
        targets: [this],
        y: (this.y - 38),
        alpha: 1,
        duration: 300,
        ease: 'Quad.easeOut',
        onComplete: () => {
          this.destroy()},
      });
    }

    createAnimations(scene) {

      scene.anims.create({
        key: 'coin',
        repeat: -1,
        frameRate: 5,
        frames: scene.anims.generateFrameNames('mario-sprites', {prefix: 'coin/coin', start: 1, end: 3 }),
      });

      scene.anims.create({
        key: 'spin',
        repeat: -1,
        frameRate: 20,
        frames: scene.anims.generateFrameNames('mario-sprites', {prefix: 'coin/spin', start: 1, end: 4 }),
      });

    }
}
