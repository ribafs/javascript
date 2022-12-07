import Enemy from "./Enemy"

class Enemies extends Phaser.Physics.Arcade.Group{
    constructor(world, scene, children, spriteArray){
        super(world, scene, children, {})
        this.scene = scene

        this.createEnemies(scene, spriteArray)
    }

createEnemies(scene, spriteArray) {

    spriteArray.forEach(sprite => {
      //create an enemy
      const enemy = new Enemy(scene, sprite.x, sprite.y)
      //add it to the group
      this.add(enemy)
      //destroy the sprite
      sprite.destroy()
    })
  }
    
}

export default Enemies