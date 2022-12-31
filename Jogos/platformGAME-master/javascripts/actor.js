var actorChars = {
    '@': Player,
    'o': Coin,
    '=': Lava,
    '|': Lava,
    'v': Lava
};

/*
 * Player part
 */

function Player(pos) {
    this.pos = pos.plus(new Vector(0, -0.5));
    this.size = new Vector(0.8, 1.5);
    this.speed = new Vector(0, 0);
}

Player.prototye.type = 'player';

var playerXSpeed = 7;

Player.prototype.moveX = function(step, level, keys) {
    this.speed.x = 0;

    if (keys.left) {
        this.speed.x = -playerXSpeed;
    }

    if (keys.right) {
        this.speed.x = playerXSpeed;
    }

    var motion = new Vector(this.speed.x * step, 0),
        newPos = this.pos.plus(motion),
        obstacle = level.obstacleAt(newPos, this.size);

    if (obstacle) {
        level.playerTouched(obstacle);
    } else {
        this.pos = newPos;
    }
};

var gravity = 30,
    jumpSpeed = 17;

Player.prototype.moveY = function(step, level, keys) {
    this.speed.y += gravity * step;
    var motion = new Vector(0, this.speed.y * step),
        newPos = this.pos.plus(motion),
        obstacle = level.obstacleAt(newPos, this.size);

    if (obstacle) {
        level.playerTouched(obstacle);

        if (keys.up && this.speed.y > 0) {
            this.speed.y = -jumpSpeed;
        } else {
            this.speed.y = 0;
        }
    } else {
        this.pos = newPos;
    }
};

Player.prototype.act = function(step, level, keys) {
    this.moveX(step, level, keys);
    this.moveY(step, level, keys);

    var otherActor = level.actorAt(this);

    if (otherActor) {
        level.playerTouched(otherActor.type, otherActor);
    }

    if (level.status === 'lost') {
        this.pos.y += step;
        this.size.y -= step;
    }
};

/*
 * Lava part
 */

function Lava(pos, ch) {
    this.pos = pos;
    this.size = new Vector(1, 1);

    if (ch === '=') {
        this.speed = new Vector(2, 0);
    } else if (ch === '|') {
        this.speed = new Vector(0, 2);
    } else if (ch === 'v') {
        this.speed = new Vector(0, 3);
        this.repeatPos = pos;
    }
}

Lava.prototype.type = 'lava';

Lava.prototype.act = function(step, level) {
    var newPos = this.pos.plus(this.speed.times(step));

    if (!level.obstacleAt(newPos, this.size)) {
        this.pos = newPos;
    } else if (this.repeatPos) {
        this.pos = this.repeatPos;
    } else {
        this.speed = this.speed.times(-1);
    }
};

/*
 * Coin part
 */

function Coin(pos) {
    this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1));
    this.size = new Vector(0.6, 0.6);
    this.wobble = Math.random() * Math.PI * 2;
}

Coin.prototype.type = 'coin';

var wobbleSpeed = 8,
    wobbleDist = 0.07;

Coin.prototype.act = function(step) {
    this.wobble += wobbleSpeed * step;
    var wobblePos = Math.sin(this.wobble) * wobbleDist;
    this.pos = this.basePos.plus(new Vector(0, wobblePos));
};
