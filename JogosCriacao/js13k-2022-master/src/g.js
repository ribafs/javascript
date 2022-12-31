function randArb(min, max) {
    return Math.random() * (max - min) + min;
}

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

(function(global){
    var module = global.noise = {};
  
    function Grad(x, y, z) {
      this.x = x; this.y = y; this.z = z;
    }
    
    Grad.prototype.dot2 = function(x, y) {
      return this.x*x + this.y*y;
    };
  
    Grad.prototype.dot3 = function(x, y, z) {
      return this.x*x + this.y*y + this.z*z;
    };
  
    var grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
                 new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
                 new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];
  
    var p = [151,160,137,91,90,15,
        131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
        190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
        88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
        77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
        102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
        135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
        5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
        223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
        129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
        251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
        49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
        138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
    
    /*
    for (let i = 0; i < 256; i++) {
        let newPerm = randInt(1, 256);

        while (p.includes(newPerm)) {
            newPerm = randInt(1, 256);
        }
        p.push(newPerm);
    }*/
    
    // To remove the need for index wrapping, double the permutation table length
    var perm = new Array(512);
    var gradP = new Array(512);
  
    // This isn't a very good seeding function, but it works ok. It supports 2^16
    // different seed values. Write something better if you need more seeds.
    module.seed = function(seed) {
      if(seed > 0 && seed < 1) {
        // Scale the seed out
        seed *= 65536;
      }
  
      seed = Math.floor(seed);
      if(seed < 256) {
        seed |= seed << 8;
      }
  
      for(var i = 0; i < 256; i++) {
        var v;
        if (i & 1) {
          v = p[i] ^ (seed & 255);
        } else {
          v = p[i] ^ ((seed>>8) & 255);
        }
  
        perm[i] = perm[i + 256] = v;
        gradP[i] = gradP[i + 256] = grad3[v % 12];
      }
    };
  
    module.seed(0);
  
    /*
    for(var i=0; i<256; i++) {
      perm[i] = perm[i + 256] = p[i];
      gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
    }*/
  
  
    // ##### Perlin noise stuff
  
    function fade(t) {
      return t*t*t*(t*(t*6-15)+10);
    }
  
    function lerp(a, b, t) {
      return (1-t)*a + t*b;
    }
  
    // 2D Perlin Noise
    module.perlin2 = function(x, y) {
      // Find unit grid cell containing point
      var X = Math.floor(x), Y = Math.floor(y);
      // Get relative xy coordinates of point within that cell
      x = x - X; y = y - Y;
      // Wrap the integer cells at 255 (smaller integer period can be introduced here)
      X = X & 255; Y = Y & 255;
  
      // Calculate noise contributions from each of the four corners
      var n00 = gradP[X+perm[Y]].dot2(x, y);
      var n01 = gradP[X+perm[Y+1]].dot2(x, y-1);
      var n10 = gradP[X+1+perm[Y]].dot2(x-1, y);
      var n11 = gradP[X+1+perm[Y+1]].dot2(x-1, y-1);
  
      // Compute the fade curve value for x
      var u = fade(x);
  
      // Interpolate the four results
      return lerp(
          lerp(n00, n10, u),
          lerp(n01, n11, u),
         fade(y));
    };
  
  })(this);



var canvas = document.getElementsByTagName('canvas')[0];
canvas.width = 240;
canvas.height = 160;
let cwidth = canvas.width;
let cheight = canvas.height;
var ctx = canvas.getContext('2d');

let canvasCenter = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

let camX = 0;
let camY = 0;

let worldLength = 0;

let score = 0;

ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;



let screens = {
    MMENU: 0,
    MAIN: 1,
    GOVER: 2
};
let screen = 0;

let ext = '.webp';
let textures = {};

let keysDown = [];

let tilesBg = [];
let tilesFg = [];
let entities = [];
let particles = [];

function getPlayerTugboat() {
    for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        if (entity.key === 'PTUG') {
            return entity;
        }
    }
}

function getPlayerBarge() {
    for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];

        if (entity.key == 'PBARGE') {
            return entity;
        }
    }
}

function getDistance(x1, y1, x2, y2) {
    var a = x1 - x2;
    var b = y1 - y2;
    
    var c = Math.sqrt( a*a + b*b );

    return c;
}

let tileGenTick = 0;
let tileGenDelay = 15;

let safeChannelSize = randInt(8, 12);
let safeChannelMin = randInt(0, cheight/8) - safeChannelSize;
let safeChannelMax = safeChannelMin + safeChannelSize;
let safeChannelChangeTick = 0;
let safeChannelChangeDelay = 100;

let airTileDistances = []; // an array of values down the Y direction
for (let i = 0; i < 20; i++) {
    airTileDistances.push(1000);
}

let enemySpawnTick = 0;
let enemySpawnDelay = 10; // in tiles

let hasHighlightedFirstFactory = false;
let endCrateTrailing = null;
let deadTimer = -1;


async function loadContent() {
    await (async () => {
        textures['title'] = 'title';
        textures['copyright'] = 'copyright';
        textures['entities'] = 'entities';
        textures['tiles'] = 'tiles';
        textures['smoke'] = 'smoke';
        textures['btnplay'] = 'btnplay';
        textures['gameover'] = 'gameover';
        textures['yousunk'] = 'yousunk';

        for (const [key, val] of Object.entries(textures)) {
            let promises = [];

            promises.push( new Promise((resolve, reject) => {
                textures[key] = new Image();
                textures[key].src = './images/' + val + ext;

                textures[key].addEventListener('load', () => {
                    console.log('Loaded texture "' + key + '".');
                    resolve();
                });
            }));

            await Promise.all(promises);
        }
    })();
}

function drawLine(context, from, to, width = 1) { // Fall back to original bresenham algorihm in case we got a too thin line
    function callback(x, y) {
        context.fillRect(x, y, 1, 1);
    }

    
    let x0 = Math.round(from[0]), y0 = Math.round(from[1]),
        x1 = Math.round(to[0]), y1 = Math.round(to[1]),
        deltaX = Math.abs(x1-x0),
        stepX = x0 < x1 ? 1 : -1,
        deltaY = Math.abs(y1-y0),
        stepY = y0 < y1 ? 1 : -1,
        err = deltaX-deltaY,
        ed = deltaX+deltaY === 0 ? 1 : Math.sqrt(deltaX*deltaX+deltaY*deltaY),
        e2, x2, y2;

    //  width = (width+1)/2;


    while(true) {
        callback(x0, y0);
        e2 = err,
        x2 = x0;

        // loop over all horizontal parts
        if (2*e2 >= -deltaX) {
            e2 += deltaY;
            y2 = y0;
            while (e2 < ed*width && (y1 != y2 || deltaX > deltaY)) {
                callback(x0, y2 += stepY);
                e2 += deltaX;
            }
            if (x0 === x1) {
                break;
            }
            e2 = err;
            err -= deltaY;
            x0 += stepX;
        }

        // loop over all vertical parts
        if (2*e2 <= deltaY) {
            e2 = deltaX-e2;
            while (e2 < ed*width && (x1 != x2 || deltaX < deltaY)) {
                callback(x2 += stepX, y0);
                e2 += deltaY;
            }
            if (y0 === y1) {
                break;
            }
            err += deltaX;
            y0 += stepY;
        }
    };
}

function drawImageCenter(image, x, y, cx, cy, scaleX, scaleY, rotation){
    //clr();
    ctx.rotate(rotation);
    ctx.drawImage(image, -cx, -cy);
} 

function clr() {
    ctx.setTransform(1,0,0,1,0,0);
}

function clamp(val, min, max) {
    if (val < min) {
        return min;
    }
    else if (val > max) {
        return max;
    }
    return val;
}

function hasCollided(rect1, rect2) {
    if (
        rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.h + rect1.y > rect2.y
    ) {
        return true;
    } else {
        return false;
    }
}

function canPlaceLand(x, y) {
    let canPlace = true;

    let perlin = noise.perlin2(x/10, y/10);

    if ( perlin <= 0 ) {
        canPlace = false;
    }

    if ( y >= safeChannelMin && y <= safeChannelMax ) {
        canPlace = false;
    }

    return {
        canPlace: canPlace,
        perlin: perlin
    };
}

function isKeyDown(key) {
    return keysDown[key] ?? false;
}

class Sprite {
    constructor(args = {}) {
        this.texture = args.texture;
        this.x = args.x;
        this.y = args.y;
        this.frame = args.frame ?? 0;
        this.maxFrames = args.maxFrames ?? 1;
        this.frameOffsetX = args.frameOffsetX ?? 0;
        this.frameOffsetY = args.frameOffsetY ?? 0;
        this.frameWidth = args.frameWidth ?? 8;
        this.frameHeight = args.frameHeight ?? 8;
        this.sheetOffsetX = args.sheetOffsetX ?? 0;
        this.sheetOffsetY = args.sheetOffsetY ?? 0;
        this.isAnimated = args.isAnimated ?? false;
        this.isPlaying = true;
        this.loop = args.loop ?? false;
        this.animTick = 0;
        this.animDelay = args.animDelay ?? 100;

        this.hasAnimationCompleted = false;
    }

    update() {
        if (this.isAnimated && this.isPlaying) {
            if (this.animTick < this.animDelay) {
                this.animTick++;
            }
            else {
                if (this.frame < this.maxFrames - 1) {
                    this.frame++;
                }
                else {
                    if ( this.loop ) {
                        this.frame = 0;
                    }
                    else {
                        this.hasAnimationCompleted = true;
                    }
                }

                this.frameOffsetX = this.sheetOffsetX + (this.frame * this.frameWidth);
                this.frameOffsetY = this.sheetOffsetY;

                this.animTick = 0;
            }
        }
    }

    render(c) {
        c.drawImage(this.texture, this.sheetOffsetX + this.frameOffsetX, this.sheetOffsetY + this.frameOffsetY, this.frameWidth, this.frameHeight, Math.round(this.x), Math.round(this.y), this.frameWidth, this.frameHeight);
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 0;
        this.hitboxOffsetX = 0;
        this.hitboxOffsetY = 0;
        this.hitbox = new Rectangle(0, 0, 0, 0);
        this.canDestroy = false;
    }

    baseUpdate() {
        this.x += this.velX;
        this.y += this.velY;

        this.hitbox.x = this.x + this.hitboxOffsetX;
        this.hitbox.y = this.y + this.hitboxOffsetY;
    }
}

class Tile extends Entity {
    constructor(spriteArgs) {
        super(spriteArgs.x, spriteArgs.y);
        spriteArgs.x = spriteArgs.x ?? x;
        spriteArgs.y = spriteArgs.y ?? y;
        this.sprite = new Sprite(spriteArgs);
        this.key = spriteArgs.key ?? '';

        this.hitbox.w = this.sprite.frameWidth;
        this.hitbox.h = this.sprite.frameHeight;

        this.shouldRenderLast = spriteArgs.shouldRenderLast ?? false;

        this.canHighlight = spriteArgs.canHighlight ?? false;
        this.highlightRect = new Rectangle(0, 0, this.sprite.frameWidth, this.sprite.frameHeight);
        this.highlightState = 'growing';
    }

    update() {
        this.baseUpdate();

        this.sprite.x = this.x;
        this.sprite.y = this.y;

        this.sprite.update();

        this.highlightRect.x = this.x - ((this.highlightRect.w - this.sprite.frameWidth) * 0.5);
        this.highlightRect.y = this.y - ((this.highlightRect.h - this.sprite.frameHeight) * 0.5);

        if (this.canHighlight) {
            if (this.highlightState === 'i') { // increase
                if (this.highlightRect.w < this.sprite.frameWidth + 6) {
                    this.highlightRect.w += 0.1;
                    this.highlightRect.h += 0.1;
                }
                else {
                    this.highlightState = 'd';
                }
            }
            else {
                if (this.highlightRect.w > this.sprite.frameWidth) {
                    this.highlightRect.w -= 0.1;
                    this.highlightRect.h -= 0.1;
                }
                else {
                    this.highlightState = 'i';
                }
            }
        }
    }

    render(c) {
        if (this.canHighlight && this.highlightRect.x > 0 && this.highlightRect.y > 0) {
            c.fillStyle = '#a0cf0a';
            c.fillRect(Math.round(this.highlightRect.x), Math.round(this.highlightRect.y), Math.round(this.highlightRect.w), Math.round(this.highlightRect.h));
        }

        this.sprite.render(c);
    }
}

class Particle extends Entity {
    constructor(args) {
        super(args.x, args.y);

        this.destroyOnComplete = args.destroyOnComplete ?? false;

        this.sprite = new Sprite({
            texture: args.texture,
            isAnimated: args.isAnimated ?? false,
            maxFrames: args.maxFrames ?? 1,
            animDelay: args.animDelay ?? 100,
            x: args.x,
            y: args.y
        });

        this.hitbox.w = this.sprite.frameWidth;
        this.hitbox.h = this.sprite.frameHeight;
    }

    update() {
        this.baseUpdate();
        
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        this.sprite.update();

        if (this.destroyOnComplete) {
            if (this.sprite.hasAnimationCompleted) {
                this.canDestroy = true;
            }
        }
    }

    render(c) {
        this.sprite.render(c);
    }
}

class PlayerTug extends Entity {
    constructor(x, y) {
        super(x, y);
        this.key = 'PTUG';
        this.sprite = new Sprite({
            texture: textures['entities'],
            x: x,
            y: y
        });

        this.isDead = false;

        this.smokeTick = 0;
        this.smokeDelay = 15;

        this.hitboxOffsetX = 2;
        this.hitboxOffsetY = 2;
        this.hitbox.w = this.sprite.frameWidth - 4;
        this.hitbox.h = 4;
    }

    hit() {
        if ( ! this.isDead ) {
            deadTimer = 180;
            this.isDead = true;
            this.canDestroy = true;
        }
    }

    update() {
        this.baseUpdate();

        this.x = clamp(this.x, 0, cwidth - 8);
        this.y = clamp(this.y, 0, cheight - 8);

        this.sprite.x = this.x;
        this.sprite.y = this.y;

        if ( ! this.isDead ) {
            if (this.smokeTick < this.smokeDelay) {
                this.smokeTick++;
            }
            else {
                for (let i = 0; i < 3; i++) {
                    let part = new Particle({
                        texture: textures['smoke'],
                        isAnimated: true,
                        maxFrames: 5,
                        animDelay: 4,
                        destroyOnComplete: true,
                        x: this.x,
                        y: this.y
                    });
                    part.velX = -randInt(1, 2);
                    particles.push(part);
                }

                this.smokeTick = 0;
            }
        }
    }

    render(c) {
        if ( ! this.isDead ) {
            this.sprite.render(c);
        }
    }
}

class PlayerBarge extends Entity {
    constructor(x, y) {
        super(x, y);
        this.key = 'PBARGE';
        this.sprite = new Sprite({
            texture: textures['entities'],
            sheetOffsetX: 8,
            frameWidth: 16,
            x: x,
            y: y
        });

        this.isDead = false;

        this.hitboxOffsetX = 2;
        this.hitboxOffsetY = 2;
        this.hitbox.w = this.sprite.frameWidth - 4;
        this.hitbox.h = this.sprite.frameHeight - 4;
    }

    hit() {
        if ( ! this.isDead ) {
            deadTimer = 180;
            this.isDead = true;
            this.canDestroy = true;
        }
    }

    update() {
        this.baseUpdate();

        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    render(c) {
        if ( ! this.isDead ) {
            this.sprite.render(c);
        }
    }
}

class Crate extends Entity {
    constructor(args = {}) {
        super(args.x, args.y);
        this.key = 'CRATE';

        this.sprite = new Sprite({
            texture: args.texture,
            sheetOffsetX: args.sheetOffsetX ?? 0,
            sheetOffsetY: args.sheetOffsetY ?? 0,
            frameWidth: args.frameWidth ?? 8,
            frameHeight: args.frameHeight ?? 8,
            isAnimated: args.isAnimated ?? false,
            maxFrames: args.maxFrames ?? 1,
            animDelay: args.animDelay ?? 100,
            x: args.x,
            y: args.y
        });

        this.velX = args.velX ?? 0;
        this.velY = args.velY ?? 0;

        this.hitboxOffsetX = 2;
        this.hitboxOffsetY = 2;
        this.hitbox.w = this.sprite.frameWidth - 4;
        this.hitbox.h = 4;

        this.entityInFront = null;
        this.cratePosition = 1;

        this.canHighlight = true;
        this.highlightRect = new Rectangle(0, 0, this.sprite.frameWidth, this.sprite.frameHeight);
        this.highlightState = 'growing';
    }

    update() {
        this.baseUpdate();

        this.sprite.x = this.x;
        this.sprite.y = this.y;

        this.sprite.update();

        this.highlightRect.x = this.x - ((this.highlightRect.w - this.sprite.frameWidth) * 0.5);
        this.highlightRect.y = this.y - ((this.highlightRect.h - this.sprite.frameHeight) * 0.5);

        if (this.canHighlight) {
            if (this.highlightState === 'i') { // increase
                if (this.highlightRect.w < this.sprite.frameWidth + 6) {
                    this.highlightRect.w += 0.1;
                    this.highlightRect.h += 0.1;
                }
                else {
                    this.highlightState = 'd';
                }
            }
            else {
                if (this.highlightRect.w > this.sprite.frameWidth) {
                    this.highlightRect.w -= 0.1;
                    this.highlightRect.h -= 0.1;
                }
                else {
                    this.highlightState = 'i';
                }
            }
        }
    }

    render(c) {
        if (this.canHighlight && this.highlightRect.x > 0 && this.highlightRect.y > 0) {
            c.fillStyle = '#a0cf0a';
            c.fillRect(Math.round(this.highlightRect.x), Math.round(this.highlightRect.y), Math.round(this.highlightRect.w), Math.round(this.highlightRect.h));
        }

        this.sprite.render(c);
    }
}

class BasicEnemy extends Entity {
    constructor(args = {}) {
        super(args.x, args.y);
        this.sprite = new Sprite({
            texture: args.texture,
            sheetOffsetX: args.sheetOffsetX ?? 0,
            sheetOffsetY: args.sheetOffsetY ?? 0,
            frameWidth: args.frameWidth ?? 8,
            frameHeight: args.frameHeight ?? 8,
            isAnimated: args.isAnimated ?? false,
            maxFrames: args.maxFrames ?? 1,
            animDelay: args.animDelay ?? 100,
            x: args.x,
            y: args.y
        });

        this.velX = args.velX ?? 0;
        this.velY = args.velY ?? 0;

        this.hitbox.w = this.sprite.frameWidth;
        this.hitbox.h = this.sprite.frameHeight;
    }

    update() {
        this.baseUpdate();

        this.sprite.x = this.x;
        this.sprite.y = this.y;

        this.sprite.update();
    }

    render(c) {
        this.sprite.render(c);
    }
}




function init() {
    window.addEventListener('keydown', function(e) {
        const key = e.key;

        keysDown[key] = true;
    });

    window.addEventListener('keyup', function(e) {
        const key = e.key;

        keysDown[key] = false;

        if (key == 'Enter') {
            if (screen == 0 || screen == 2) {
                screen = 1;
                initScene();
            }
        }

        if (screen == 1) {
            if (key == ' ') {
                let playerTug = getPlayerTugboat();
                let playerBarge = getPlayerBarge();

                console.log('key: ', key);
                for (let i = 0; i < tilesFg.length; i++) {
                    let tile = tilesFg[i];

                    if (tile.shouldRenderLast) {
                        if (playerTug) {
                            if (getDistance(playerTug.x, playerTug.y, tile.x, tile.y) < 24) {
                                console.log('unload');

                                for (let j = 0; j < entities.length; j++) {
                                    let entity = entities[j];

                                    if (entity.key == 'CRATE_TRAILING') {
                                        score += 100;
                                        entity.canDestroy = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    function deadTimerComplete() {
        switch (screen) {
            case 0:
            case 1: {

                if (screen == 1) {
                    screen = 2;
                }
                initScene();
    
                break;
            }
        }
    }

    function initScene() {
        switch (screen) {
            case 0:
            case 1: {
                score = 0;
                tilesBg.length = 0;
                tilesFg.length = 0;
                entities.length = 0;
                particles.length = 0;

                for (let x = 0; x < (cwidth/8) + 1; x++) {
                    for (let y = 0; y < cheight/8; y++) {
                        let t = new Tile({
                            texture: textures['tiles'],
                            x: x * 8,
                            y: y * 8,
                            frame: randInt(0, 3),
                            maxFrames: 4,
                            animDelay: randInt(15, 30),
                            isAnimated: true,
                            loop: true
                        });

                        tilesBg.push(t);
                    }
                }
            
            
                let playerTug = new PlayerTug(cwidth/2, cheight/2);
                entities.push(playerTug);

                let playerBarge = new PlayerBarge(cwidth/2 - 16, cheight/2);
                entities.push(playerBarge);

                break;
            }

            case 2: {
                tilesBg.length = 0;
                tilesFg.length = 0;
                entities.length = 0;
                particles.length = 0;

                for (let x = 0; x < (cwidth/8) + 1; x++) {
                    for (let y = 0; y < cheight/8; y++) {
                        let t = new Tile({
                            texture: textures['tiles'],
                            x: x * 8,
                            y: y * 8,
                            frame: randInt(0, 3),
                            maxFrames: 4,
                            animDelay: randInt(15, 30),
                            isAnimated: true,
                            loop: true
                        });

                        tilesBg.push(t);
                    }
                }

                break;
            }
        }
    }

    function update() {
        switch (screen) {
            case 0:
            case 1: {
                let playerTug = getPlayerTugboat();
                let playerBarge = getPlayerBarge();

                if (deadTimer > 0) {
                    deadTimer--;
                }
                else if (deadTimer == 0) {
                    deadTimerComplete();
                    deadTimer = -1;
                }

                for (let i = 0; i < tilesBg.length; i++) {
                    let tile = tilesBg[i];
                    tile.x -= 0.5;

                    if (tile.update) {
                        tile.update();
                    }

                    if (tile.x < -16) {
                        tilesBg.splice(i, 1);
                        i--;
                    }
                }

                for (let i = 0; i < tilesFg.length; i++) {
                    let tile = tilesFg[i];
                    tile.x -= 0.5;

                    if (tile.update) {
                        tile.update();
                    }

                    if (playerTug) {
                        if (! Object.is(playerTug, tile)) {
                            if (hasCollided(playerTug.hitbox, tile.hitbox)) {
                                playerTug.hit();
                            }
                        }
                    }

                    if (playerBarge) {
                        if (! Object.is(playerBarge, tile)) {
                            if (hasCollided(playerBarge.hitbox, tile.hitbox)) {
                                playerBarge.hit();
                            }
                        }
                    }

                    for (let j = 0; j < entities.length; j++) {
                        let entity = entities[j];

                        if (['CRATE', 'CRATE_TRAILING'].includes(entity.key)) {
                            if (hasCollided(entity.hitbox, tile.hitbox)) {
                                entity.canDestroy = true;
                            }
                        }
                    }

                    if (tile.x < -16) {
                        tilesFg.splice(i, 1);
                        i--;
                    }
                }
                
                for (let i = 0; i < entities.length; i++) {
                    let entity = entities[i];


                    if (entity.key === 'CRATE_TRAILING' && playerBarge) {
                        let entityInFront = entity.entityInFront;


                        if (entityInFront == null) {
                            let lastCrateTrailing = null;
                            let cratesTrailing = [];
                            for (let j = 0; j < entities.length; j++) {
                                let thisEntity = entities[j];

                                if (thisEntity.key == 'CRATE_TRAILING') {
                                    cratesTrailing.push(thisEntity);

                                    if (lastCrateTrailing) {
                                        if (thisEntity.cratePosition > lastCrateTrailing.cratePosition && ! thisEntity.canDestroy ) {
                                            lastCrateTrailing = thisEntity;
                                        }
                                    }
                                    else {
                                        lastCrateTrailing = thisEntity;
                                    }
                                }
                            }

                            entity.cratePosition = cratesTrailing.length;

                            entity.entityInFront = lastCrateTrailing ?? (playerBarge ?? null);
                        }


                        console.log('CRATE TRAILING: ', entity, entityInFront);

                        // X
                        entity.x = entityInFront.x - 12;


                        console.log(entityInFront);
    
    
                        // Y
                        if (entity.y < entityInFront.y - 2) {
                            entity.y += 0.1;
                        }
                        else if (entity.y < entityInFront.y) {
                            entity.velY = 0.25;
                        }
    
    
                        if (entity.y > entityInFront.y + 2) {
                            entity.y -= 0.1;
                        }
                        else if (entity.y > entityInFront.y) {
                            entity.velY = -0.25;
                        }
                    }
    

                    if (entity.update) {
                        entity.update();
                    }

                    let friendlyEntities = [
                        'CRATE',
                        'CRATE_TRAILING'
                    ];

                    if ( friendlyEntities.includes( entity.key ) ) {

                        function onCollideCrate() {
                            let lastCrateTrailing = null;
                            let cratesTrailing = [];
                            for (let j = 0; j < entities.length; j++) {
                                let thisEntity = entities[j];

                                if (thisEntity.key == 'CRATE_TRAILING') {
                                    cratesTrailing.push(thisEntity);

                                    if (lastCrateTrailing) {
                                        if (thisEntity.cratePosition > lastCrateTrailing.cratePosition && ! thisEntity.canDestroy) {
                                            lastCrateTrailing = thisEntity;
                                        }
                                    }
                                    else {
                                        lastCrateTrailing = thisEntity;
                                    }
                                }
                            }

                            entity.cratePosition = cratesTrailing.length;

                            entity.entityInFront = lastCrateTrailing ?? (playerBarge ?? null);

                            if ( entity.entityInFront && 
                                entity.key == 'CRATE') {
                                entity.key = 'CRATE_TRAILING';
                                entity.canHighlight = false;
                                entity.velX = 0;

                                entity.x = entity.entityInFront.x - 12;
                                entity.y = entity.entityInFront.y;

                                endCrateTrailing = entity;
                            }
                        }


                        if (playerTug) {
                            if (! Object.is(playerTug, entity)) {
                                if (hasCollided(playerTug.hitbox, entity.hitbox)) {
                                    if (entity.key == 'CRATE') {
                                        onCollideCrate();
                                    }
                                }
                            }
                        }

                        if (playerBarge) {
                            if (! Object.is(playerBarge, entity)) {
                                if (hasCollided(playerBarge.hitbox, entity.hitbox)) {
                                    if (entity.key == 'CRATE') {
                                        onCollideCrate();
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if (playerTug) {
                            if (! Object.is(playerTug, entity)) {
                                if (hasCollided(playerTug.hitbox, entity.hitbox)) {
                                    playerTug.hit();
                                    console.log('tug collided with ' + entity.key, entity);
                                }
                            }
                        }

                        if (playerBarge) {
                            if (! Object.is(playerBarge, entity)) {
                                if (hasCollided(playerBarge.hitbox, entity.hitbox)) {
                                    playerBarge.hit();
                                    console.log("barge collided with " + entity.key, entity);
                                }
                            }
                        }
                    }

                    for (let j = 0; j < entities.length; j++) {
                        let thisEntity = entities[j];

                        if (['CRATE', 'CRATE_TRAILING'].includes(thisEntity.key)) {
                            if ( ! Object.is(thisEntity, entity) &&
                                ! Object.is(entity, playerTug) &&
                                ! Object.is(entity, playerBarge)) {
                                if (hasCollided(thisEntity.hitbox, entity.hitbox)) {
                                    console.log('crate collided with entity', entity);
                                    thisEntity.canDestroy = true;
                                }
                            }
                        }
                    }

                    if (entity.destroyOnComplete !== undefined) {
                        if (entity.hasAnimationCompleted) {
                            entity.canDestroy = true;
                        }
                    }

                    if (entity.canDestroy) {
                        entities.splice(i, 1);
                        i--;
                    }
                }

                for (let i = 0; i < particles.length; i++) {
                    let particle = particles[i];

                    particle.update();

                    if (particle.canDestroy) {
                        particles.splice(i, 1);
                    }
                }


                if ( playerTug ) {
                    if ( isKeyDown('w') ) {
                        playerTug.velY = -0.5;
                    }
                    else if (isKeyDown('s') ) {
                        playerTug.velY = 0.5;
                    }
                    else {
                        playerTug.velY = 0;
                    }


                    if ( isKeyDown('a') ) {
                        playerTug.velX = -1;
                    }
                    else if (isKeyDown('d') ) {
                        playerTug.velX = 1;
                    }
                    else {
                        playerTug.velX = 0;
                    }
                }


                if (playerTug && playerBarge) {
                    // X
                    if (playerBarge.x < playerTug.x - 22) {
                        playerBarge.velX = 0.75;
                        playerTug.velX /= 3;
                    }
                    else if (playerBarge.x < playerTug.x - 22) {
                        playerBarge.velX = 0.1;
                    }


                    if (playerBarge.x > playerTug.x + 22) {
                        playerBarge.velX = -1;
                        playerTug.velX /= 3;
                    }
                    else if (playerBarge.x > playerTug.x - 22) {
                        playerBarge.velX = -0.75;
                    }

                    playerTug.velX -= 0.25;



                    // Y
                    if (playerBarge.y < playerTug.y - 16) {
                        playerBarge.y += 0.75;
                        playerTug.velY /= 3;
                    }
                    else if (playerBarge.y < playerTug.y) {
                        playerBarge.velY = 0.25;
                    }


                    if (playerBarge.y > playerTug.y + 16) {
                        playerBarge.y -= 0.75;
                        playerTug.velY /= 3;
                    }
                    else if (playerBarge.y > playerTug.y) {
                        playerBarge.velY = -0.25;
                    }

                    playerBarge.velX -= 0.25;
                }



                if (safeChannelChangeTick < safeChannelChangeDelay) {
                    safeChannelChangeTick++;
                }
                else {
                    if (safeChannelSize > 3) {
                        safeChannelSize -= randInt(0, 1);
                    }


                    safeChannelMin += randInt(-1, 1);
                    if (safeChannelMin < 0) {
                        safeChannelMin = 0;
                    }
                    else if (safeChannelMin > (cheight/8) - safeChannelSize) {
                        safeChannelMax = (cheight/8) - safeChannelSize;
                    }

                    safeChannelMax = safeChannelMin + safeChannelSize;

                    safeChannelChangeTick = 0;
                    safeChannelChangeDelay = randInt(80, 120);
                }



                if (tileGenTick < tileGenDelay) {
                    tileGenTick++;
                }
                else {
                    for (let i = 0; i < airTileDistances.length; i++) {
                        if (airTileDistances[i] < 1000) {
                            airTileDistances[i]++;
                        }
                    }

                    for (let y = 0; y < (cheight/8); y++) {
                        let hasPlacedFg = false;

                        let n = canPlaceLand(worldLength, y);
                        let nu = canPlaceLand(worldLength, y - 1);
                        let nr = canPlaceLand(worldLength + 1, y);
                        let nd = canPlaceLand(worldLength, y + 1);
                        let nl = canPlaceLand(worldLength - 1, y);

                        if ( n.canPlace ) {
                            let sox = 8;
                            let soy = 48;
                            let frameWidth = 8;
                            let frameHeight = 8;
                            let shouldRenderLast = false;
                            let canHighlight = false;

                            let isPlacingUpFacing = false;
                            let isPlacingRightFacing = false;
                            let isPlacingDownFacing = false;
                            let isPlacingLeftFacing = false;

                            if ( ! nu.canPlace) {
                                soy -= 8;
                                isPlacingUpFacing = true;
                            }

                            if ( ! nd.canPlace) {
                                soy += 8;

                                isPlacingDownFacing = true;
                            }

                            if ( ! nl.canPlace) {
                                sox -= 8;

                                isPlacingLeftFacing = true;
                            }

                            if ( ! nr.canPlace) {
                                sox += 8;

                                isPlacingRightFacing = true;
                            }


                            // Sparse trees
                            if (n.perlin >= 0.2 && n.perlin < 0.5) {
                                sox = 32;

                                if ( nu.canPlace && nu.perlin < 0.2 ) {
                                    soy -= 8;
                                }
        
                                if ( nd.canPlace && nd.perlin < 0.2 ) {
                                    soy += 8;
                                }
        
                                if ( nl.canPlace && nl.perlin < 0.2 ) {
                                    sox -= 8;
                                }
        
                                if ( nr.canPlace && nr.perlin < 0.2 ) {
                                    sox += 8;
                                }
                            }


                            // Trees
                            if (n.perlin >= 0.5) {
                                sox = 64;

                                if ( nu.canPlace && nu.perlin < 0.2 ) {
                                    soy -= 8;
                                }
        
                                if ( nd.canPlace && nd.perlin < 0.2) {
                                    soy += 8;
                                }
        
                                if ( nl.canPlace && nl.perlin < 0.2 ) {
                                    sox -= 8;
                                }
        
                                if ( nr.canPlace && nr.perlin < 0.2 ) {
                                    sox += 8;
                                }
                            }


                            // Place special tiles
                            if (randInt(0, 100) > 90) {
                                if (randInt(0, 100) > 50) {
                                    if (isPlacingDownFacing) {
                                        if ( y * 8 < cheight/2) {
                                            sox = (randInt(0, 2) * 16);
                                            soy = 16;
                                            frameWidth = 16;
                                            frameHeight = 16;
                                            shouldRenderLast = true;
                                            if ( ! hasHighlightedFirstFactory ) {
                                                canHighlight = true;
                                                hasHighlightedFirstFactory = true;
                                            }

                                            if (y + 1 < 20) {
                                                airTileDistances[y + 1] = 0;
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (isPlacingUpFacing) {
                                        if ( y * 8 > cheight/2) {
                                            sox = (randInt(0, 2) * 16);
                                            soy = 16;
                                            frameWidth = 16;
                                            frameHeight = 16;
                                            shouldRenderLast = true;
                                            if ( ! hasHighlightedFirstFactory ) {
                                                canHighlight = true;
                                                hasHighlightedFirstFactory = true;
                                            }

                                            if (y + 1 < 20) {
                                                airTileDistances[y + 1] = 0;
                                            }
                                        }
                                    }
                                }
                            }


                            let t = new Tile({
                                texture: textures['tiles'],
                                sheetOffsetX: sox,
                                sheetOffsetY: soy,
                                frameWidth: frameWidth,
                                frameHeight: frameHeight,
                                shouldRenderLast: shouldRenderLast,
                                canHighlight: canHighlight,
                                x: cwidth,
                                y: y * 8
                            });

                            tilesFg.push(t);

                            airTileDistances[y] = 0;

                            hasPlacedFg = true;
                        }

                        if ( ! hasPlacedFg ) {
                            let t = new Tile({
                                texture: textures['tiles'],
                                x: cwidth,
                                y: y * 8,
                                frame: randInt(0, 3),
                                maxFrames: 4,
                                animDelay: randInt(15, 30),
                                isAnimated: true,
                                loop: true
                            });
            
                            tilesBg.push(t);
                        }
                    }

                    if (enemySpawnTick < enemySpawnDelay) {
                        enemySpawnTick++;
                    }
                    else {
                        let possibleYs = [];

                        airTileDistances.forEach((dist) => {
                            if (dist > 22) {
                                possibleYs.push(dist);
                            }
                        });

                        let spawnY = airTileDistances.indexOf( possibleYs[randInt(0, possibleYs.length - 1)] ) * 8;

                        if (randInt(0, 100) > 50) {
                            let sox = randInt(0, 2) * 8;
                            let soy = 8;
                            let fwidth = 8;
                            let bekey = 'SAILBOAT'; // basic enemy key


                            if (randInt(0, 100) > 50) {
                                sox = 0;
                                soy = randInt(2, 4) * 8;                                

                                if (soy == 16) {
                                    fwidth = 32;
                                    bekey = 'FREIGHT_S';
                                }
                                else if (soy == 24) {
                                    fwidth = 40;
                                    bekey = 'FREIGHT_M';
                                }
                                else if (soy == 32) {
                                    fwidth = 48;
                                    bekey = 'FREIGHT_L';
                                }
                            }

                            // spawn sailboats
                            let enemy = new BasicEnemy({
                                texture: textures['entities'],
                                sheetOffsetX: sox,
                                sheetOffsetY: soy,
                                frameWidth: fwidth,
                                x: cwidth,
                                y: spawnY,
                                velX: -randArb(0.8, 1.2)
                            });
                            enemy.key = bekey;
                            entities.push(enemy);
                            enemySpawnTick = 0;
                        }
                        else {
                            let sox = 24 + (randInt(0, 3) * 8);
                            let soy = 0;
                            let fwidth = 8;

                            console.log(cwidth);

                            // spawn crates
                            let crate = new Crate({
                                texture: textures['entities'],
                                sheetOffsetX: sox,
                                sheetOffsetY: soy,
                                frameWidth: fwidth,
                                x: cwidth,
                                y: spawnY,
                                velX: -0.5
                            });
                            entities.push(crate);
                        }
                    }

                    worldLength++;

                    tileGenTick = 0;
                }
                
                break;
            }

            case 2: {
                for (let i = 0; i < tilesBg.length; i++) {
                    let tile = tilesBg[i];

                    tile.update();
                }

                break;
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, cwidth, cheight);
        clr();

        let playerTug = getPlayerTugboat();
        let playerBarge = getPlayerBarge();

        switch (screen) {
            case 0:
            case 1: {
                // Draw bg tiles
                tilesBg.forEach((tile) => {
                    tile.render(ctx);
                });

                if ( playerTug && playerBarge ) {
                    ctx.fillStyle = '#2e7320';
                    drawLine(ctx, [playerTug.x, playerTug.y + 4], [playerBarge.x + 16, playerBarge.y + 4], 1);
                }

                for (let i = 0; i < entities.length; i++) {
                    let entity = entities[i];
                    
                    if (entity.key == 'CRATE_TRAILING') {
                        if (entity.entityInFront !== null && ! entity.entityInFront.canDestroy) {
                            ctx.fillStyle = '#2e7320';
                            drawLine(ctx, [entity.x + 8, entity.y + 4], [entity.entityInFront.x, entity.entityInFront.y + 4], 1);
                        }
                    }

                    if (entity.render) {
                        entity.render(ctx);

                        ctx.fillRect(entity.hitbox.x, entity.hitbox.y, entity.hitbox.w, entity.hitbox.height);
                    }
                }

                // Draw particles
                for (let i = 0; i < particles.length; i++) {
                    let particle = particles[i];

                    if (particle.render) {
                        particle.render(ctx);
                    }
                }

                // Draw fg tiles
                tilesFg.forEach((tile) => {
                    if ( ! tile.shouldRenderLast ) {
                        tile.render(ctx);
                    }
                });

                tilesFg.forEach((tile) => {
                    if (tile.shouldRenderLast) {
                        tile.render(ctx);

                        if (playerTug) {
                            if (getDistance(playerTug.x, playerTug.y, tile.x, tile.y) < 24) {
                                ctx.fillStyle = '#a0cf0a';
                                ctx.fillText('SPACE TO UNLOAD', playerTug.x - 34, playerTug.y - 16);
                            }
                        }
                    }
                });

                break;
            }

            case 2: {
                // Draw bg tiles
                tilesBg.forEach((tile) => {
                    if ( ! tile.shouldRenderLast ) {
                        tile.render(ctx);
                    }
                });
                
                break;
            }
        }

        // for extra main menu draw items
        if (screen == 0) {
            ctx.drawImage(textures['title'], (cwidth/2) - 66, 8, textures['title'].width * 3, textures['title'].height * 3);

            ctx.drawImage(textures['copyright'], (cwidth/2) - 66, 68);

            ctx.drawImage(textures['btnplay'], (cwidth/2) - 30, 112, 60, 15);

            ctx.fillStyle = '#a0cf0a';
            ctx.fillText('MADE FOR JS13K22', 4, cheight - 6);
        }
        else if (screen == 1) {
            ctx.fillStyle = '#a0cf0a';
            ctx.fillText('SCORE: ' + score, 4, 8);
        }
        else if (screen == 2) {
            ctx.drawImage(textures['gameover'], (cwidth/2) - 105, 16, textures['gameover'].width * 3, textures['gameover'].height * 3);

            ctx.drawImage(textures['yousunk'], (cwidth/2) - 65, 48, textures['yousunk'].width * 2, textures['yousunk'].height * 2);

            ctx.drawImage(textures['btnplay'], (cwidth/2) - 30, 112, 60, 15);

            ctx.fillStyle = '#a0cf0a';
            ctx.fillText('FINAL SCORE: ' + score, (cwidth/2) - 38, 90);
        }
    }

    function loop() {
        update();

        draw();

        requestAnimationFrame(loop);
    }

    (async function() {
        await loadContent();
        initScene();
        loop();
    })();
}
    
init();

