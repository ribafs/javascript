export default class Mushroom extends Phaser.GameObjects.Sprite {

    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
        config.scene.physics.world.enable(this);
        config.scene.physics.world.setBounds(0,0,3392, 240);
        config.scene.physics.add.collider(this, config.layer);
        config.scene.add.existing(this);

        // é só no play q ele desenha a moeda animada
        this.createAnimations(config.scene);
        this.anims.play('mushroom/show');
        this.body.setSize(16, 16);
        // coloca ele em movimento
        if (config.action == 'move') {
          this.body.setVelocityX(60);
          this.body.setBounce(1, .4);
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
        key: 'mushroom/show',
        repeat: -1,
        frameRate: 5,
        frames: [{frame: 'powerup/super', key: 'mario-sprites'}],
      });

    }
}
