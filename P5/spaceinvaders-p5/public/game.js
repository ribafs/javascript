var Game = function(currentAlienDelay, level) {
    this.level = level;

    this.enemies = this.generateEnemies([]);
    this.obstacles = this.generateObstacles([]);
    this.minX = width;
    this.maxX = 0;
    this.verticalMove = false;

    this.difficulty = level/50;

    this.alienDelay = this.setAlienDelay(currentAlienDelay);
    this.speedHasChanged = 0;
    this.nextAlienMove = 0;

    this.levelStart = false;
    this.enemiesLeft = COLS * ROWS;
    this.gameOver = false;

}


Game.prototype.update = function() {
    messageDelay = 30;
    this.drawObstacles();
    player.update();
    this.hud();
    //Handles when to move the enemies
    var isNeedToMove = this.nextAlienMove <= millis();
    if (isNeedToMove) {
        var speed;
        if (this.maxX >= width - (ENEMY_WIDTH * 1.5) && !this.verticalMove) {
            speed = -15;
            this.maxX = 0;
            this.verticalMove = true;
        } else if (this.minX <= 0 + (ENEMY_WIDTH * 0.5) && !this.verticalMove) {
            speed = 15;
            this.minX = width;;
            this.verticalMove = true;
        } else {
            this.verticalMove = false;
        }
    }



    for (var i = 0; i < this.enemies.length; i++) {

        //speed up enemies the fewer there are
        if(this.enemiesLeft < 15 && this.speedHasChanged === 0) {
            this.alienDelay <= 200 ? this.alienDelay -= 50 : this.alienDelay -= this.alienDelay -= 100;
            this.speedHasChanged++;
        } else if (this.enemiesLeft < 5 && this.speedHasChanged === 1) {
            this.alienDelay <= 200 ?this.alienDelay -= 50 : this.alienDelay -= 100;
            this.speedHasChanged++;
        }

        //move or end level
        if(this.enemiesLeft > 0) {
            for (var j = 0; j < this.enemies[i].length; j++) {
                // if time to move, then move
                if (isNeedToMove) {
                    // add speed for every enemy missing from array
                    this.enemies[i][j].move(speed, this.verticalMove);
                }
                this.enemies[i][j].update();
            }
        } else {
            this.levelStart = true; //start new level
        }

    }


    if (isNeedToMove) {
        this.nextAlienMove = millis() + this.alienDelay;
    }

}

Game.prototype.generateEnemies = function(enemies) {

    for (var i = 0; i < ROWS; i++) {
        var newRow = [];
        for (var y = 0; y < COLS; y++) {
            var randNo = random(0,2);
            var type;
            if(randNo > 1) {
                type = invader
            } else {
                type = invader2
            }
            newRow.push(new Enemy(y * 40 + 40, 40 + i * 35, type));
        }
        enemies.push(newRow);
    }
    return enemies;
}

Game.prototype.generateObstacles = function(obstacles) {

    obstacles.push(new Obstacle(75, height - 100))
    obstacles.push(new Obstacle(width-150, height - 100))

    return obstacles;
}

Game.prototype.playerDeath = function() {

    this.killBullets();
    if(player.lives > 0) {
        player.alive = false;
        player.lives -= 1;
    } else {
         this.gameOver = true;
    }


}

Game.prototype.hud = function() {
    textAlign(LEFT, LEFT);
    fill(255);
    textSize(16);
    text("score: " + player.score, 10, 15);
    text("lives: " + player.lives, width - 90, 15);
}

Game.prototype.nextLevel = function() {
    this.killBullets();
    player.lives = 3;
    this.level++;
    this.alienDelay += 200;
    game = new Game(this.alienDelay, this.level);

}

Game.prototype.killBullets = function() {
    for (var i = player.bullets.length - 1; i > 0; i--) {
        player.bullets.splice(i, 1);
    }

    for (var x = this.enemies.length - 1; x > 0; x--) {
        this.enemies[x].bullets = [];
    }
}

Game.prototype.setAlienDelay = function(currentAlienDelay) {
    if(currentAlienDelay > 250) {
        return currentAlienDelay - 100;
    } else {
        return 250;
    }
}

Game.prototype.drawObstacles = function() {
    for(var i = 0; i < this.obstacles.length; i++) {
        if(this.obstacles[i].life > 0) {
            fill(50, 255, 50);
            image(barrier, this.obstacles[i].pos.x, this.obstacles[i].pos.y - (this.obstacles[i].life * 10), this.obstacles[i].width , this.obstacles[i].height * this.obstacles[i].life);
        }
    }
}
