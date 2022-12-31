var Enemy = function(x, y, type) {
    this.height = ENEMY_HEIGHT;
    this.width = ENEMY_WIDTH;
    this.pos = createVector(x, y);
    this.speed = 15;
    this.bullets = [];
    this.type = type;
}

Enemy.prototype.draw = function() {

    image(this.type, this.pos.x, this.pos.y, this.width, this.height);

}

Enemy.prototype.update = function() {

    this.draw();
    this.fire();
}

Enemy.prototype.fire = function() {

    this.loadBullet();
    for (var i = this.bullets.length - 1; i > 0; i--) {
        var eBullet = this.bullets[i];
        eBullet.draw();
        eBullet.velocity.y += eBullet.acceleration;
        eBullet.pos.y += eBullet.velocity.y;

        if (eBullet.pos.y >= height) {
            this.bullets.splice(i, 1);
        }

        if (eBullet.playerHit()) {
            this.bullets.splice(i, 1);
            game.playerDeath();
        }

        if (eBullet.obstacleHit()) {
            this.bullets.splice(i, 1);
        }
    }
}


Enemy.prototype.move = function(speed, verticalMove) {

    if (speed) {
        this.speed = speed;
    }
    /*
    // Move horizontal if can't move vertically
    */
    if (this.pos.y < height - 175) { //if aliens have reached player, game over
        if (verticalMove) {
            if (this.speed > 0) {
                this.pos.y += this.speed;
            } else {
                this.pos.y -= this.speed;
            }
        } else {
            this.pos.x += this.speed;
            game.minX = Math.min(game.minX, this.pos.x);
            game.maxX = Math.max(game.maxX, this.pos.x);
        }
    } else {
        game.gameOver = true;
    }
}

Enemy.prototype.loadBullet = function() {

    var randNo = random(0, 100);
    if (randNo >= 100 - game.difficulty) {
        this.bullets.push(new Bullet(this.pos.x + this.width / 2, this.pos.y + this.height / 2, "enemy"));
    }

}
