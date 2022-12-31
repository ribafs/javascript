var Player = function() {

    this.pos = createVector(width/2, height - 40);
    this.height = 20;
    this.width = 30;
    this.bullets = [];
    this.shotDelay = 300;
    this.nextShotAt = 0;
    this.lives = 3;
    this.score = 0;
    this.alive = true;
    this.flashes = 0;
}

Player.prototype.update = function() {
    this.pos.x = mouseX;
    var maxRange = constrain(this.pos.x, 0, width - this.width);
    if(this.alive){
        image(ship, maxRange, this.pos.y, this.width, this.height);
        this.fire();
    } else {
        this.hitAnimation(maxRange);
    }

}

Player.prototype.fire = function() {

    //draws each bullet and checks to see if they are hitting an enemy
    for (var i = this.bullets.length - 1; i > 0; i--) {
        if(this.bullets[i] !== undefined) {
            this.bullets[i].velocity.y += this.bullets[i].acceleration;
            this.bullets[i].pos.y -= this.bullets[i].velocity.y;
        }

        if (this.bullets[i].pos.y <= 0 || this.bullets[i] > height) {
            this.bullets.splice(i, 1);
        }

        if(this.bullets[i].obstacleHit()) {
            this.bullets.splice(i, 1);
        }

        this.bullets[i].draw();
        this.bullets[i].enemyHit();

    }
    // checks to see if its time to shoot another shot
    if (this.nextShotAt > millis()) {
        return;
    }
    this.nextShotAt = millis() + this.shotDelay;
    this.bullets.push(new Bullet(this.pos.x + this.width / 2, this.pos.y - this.height / 2, "player"));
}

Player.prototype.hitAnimation = function(maxRange) {
    if(this.flashes !== 60) {
        if(this.flashes % 10 === 0) {
            image(ship, maxRange, this.pos.y, this.width, this.height);
        }
        this.flashes++;
    } else {
        this.alive = true;
        this.flashes = 0;
    }
}
