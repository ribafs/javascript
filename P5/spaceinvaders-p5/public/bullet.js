var Bullet = function(x, y, type) {
    this.width = 5;
    this.height = 5;
    this.type = type;
    this.pos = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = 0.2;
}

Bullet.prototype.draw = function() {
    if (this.type === "player") {
        fill(0, 255, 0);
    } else {
        fill(255);
    }
    ellipse(this.pos.x, this.pos.y, this.width, this.height);
}

Bullet.prototype.playerHit = function() {
    if (player.alive) {
        var d = p5.Vector.dist(this.pos, player.pos);
        if (d < player.height || d < player.width) {
            return true;
        }
    }
}

Bullet.prototype.enemyHit = function() {
    for (i = 0; i < game.enemies.length; i++) {
        for (var y = 0; y < game.enemies[i].length; y++) {
            var d = p5.Vector.dist(this.pos, game.enemies[i][y].pos);
            if (d < game.enemies[i][y].height) {
                game.enemies[i].splice(y, 1);
                y--;
                player.bullets.splice(this, 1);
                game.enemiesLeft--;
                player.score += 10;
            }
        }
    }
}

Bullet.prototype.obstacleHit = function() {
    for (var i = 0; i < game.obstacles.length; i++) {
        if (this.pos.x < game.obstacles[i].pos.x + game.obstacles[i].width &&
            this.pos.x + this.width > game.obstacles[i].pos.x &&
            this.pos.y < game.obstacles[i].pos.y + game.obstacles[i].height &&
            this.height + this.pos.y > game.obstacles[i].pos.y) {
            if (this.type !== "player") {
                game.obstacles[i].life -= 0.5;
                if (game.obstacles[i].life === 0) {
                    game.obstacles.splice(i, 1);
                }
            }

            return true;
        }
    }
}
