class PowerUp {
    fallSpeed = 5;
    pickupRadius = 25;
    used = false;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        //this.behavior = fastFire;
    }

    display() {
        if (!this.used) {
            stroke(212,175,55);
            circle(this.x, this.y, 10);
        }
    }

    update() {
        this.y += this.fallSpeed;
        if(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2) <= Math.pow(this.pickupRadius, 2) && this.used == false) {
            behaviors[Math.floor(Math.random()*behaviors.length)]();
            this.used = true;
        }
    }
}