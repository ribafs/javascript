export default class PowerUp extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
        config.scene.physics.world.enable(this);
        config.scene.physics.world.setBounds(0,0,3392, 240);
        config.scene.add.existing(this);
        // coloca a colisao default da moeda com o mundo
        config.scene.physics.add.collider(this, config.tilemap);
        // é só no play q ele desenha a moeda animada
        this.anims.play('coin');
        this.body.setSize(16, 16);
    }

    update() {

    }
}
