var gamejs = require('gamejs');
/*
 * Prepare a usable image for for a Sprite
 */
var SpriteSheet = exports.SpriteSheet = function(image, opts) {
    this.width = opts.width;
    this.height = opts.height;
    this.spacing = opts.spacing || 0;
    this.margin = opts.margin || 0;

    this.image = image;

    //this.image._context.imageSmoothingEnabled = false;
    this.surfaceCache = [];

    var imgSize = new gamejs.Rect([0,0],[this.width,this.height]);
    if (opts.scaleTo) {
        imgSize = new gamejs.Rect([0,0], opts.scaleTo);
    }

    // Extract the cells from the spritesheet image.
    for (var i = this.margin; i < this.image.rect.height; i += this.height + this.spacing) {
        for (var j = this.margin; j < this.image.rect.width; j += this.width + this.spacing) {
            var surface = new gamejs.graphics.Surface(imgSize);
            var rect = new gamejs.Rect(j, i, this.width, this.height);
            //surface._context.imageSmoothingEnabled = false;
            surface.blit(this.image, imgSize, rect);
            this.surfaceCache.push(surface);
        }
    }

    this.initialize.apply(this, arguments);
};

// An empty function by default. Override it with your own initialization logic.
SpriteSheet.prototype.initialize = function(options) {};

SpriteSheet.prototype.get = function(index) {
        return this.surfaceCache[index];
}

var Animation = exports.Animation = function(spriteSheet, initial, spec) {
    this.spec = spec;

    this.currentFrame = null;
    this.currentFrameDuration = 0;
    this.currentAnimation = null;
    this._isFinished = false;

    this.spriteSheet = spriteSheet;

    this.image = spriteSheet.get(0);
    this.start(initial);

    this.initialize.apply(this, arguments);
};

// An empty function by default. Override it with your own initialization logic.
Animation.prototype.initialize = function(options) {};

Animation.prototype.setFrame = function(frame) {
    this.frameIndex = frame;
};

Animation.prototype.start = function(name) {
    this._isFinished = false;
    this.setState(name);
    this.update(0);
    return;
};

Animation.prototype.getPortrait = function() {
    var downImg = this.spriteSheet.get(this.spec.down.frames[0]);
    var portrait = new gamejs.graphics.Surface([32, 20]);
    portrait.blit(downImg, [0,0]);
    return portrait;
}

Animation.prototype.setState = function(name) {
    if (this.currentAnimation === name) {
        return;
    }

    this.currentAnimation = name;
    this.currentFrame = this.spec[name].frames[0];
    this.frameIndex = 0;
    this.currentFrameDuration = 0;
    this.frameDuration = 1000 / this.spec[name].rate;
};

Animation.prototype.update = function(msDuration) {
    if (!this.currentAnimation) {
        throw new Error('No animation started.');
    }

    this.currentFrameDuration += msDuration;
    if (this.currentFrameDuration >= this.frameDuration && this._isFinished === false){
        var frames = this.spec[this.currentAnimation].frames;

        this.currentFrame = frames[this.frameIndex++];
        this.currentFrameDuration = 0;

        var length = this.spec[this.currentAnimation].frames.length - 1;
        if (this.frameIndex > length) {
            if (this.spec[this.currentAnimation].loop) {
                this.frameIndex = 0;
                this.currentFrame = frames[this.frameIndex];
            } else {
                this._isFinished = true;
                this.frameIndex--;
                this.currentFrame = frames[this.frameIndex];
            }
        }
        // @@ this is here for perfromance opt?
        this.image = this.spriteSheet.get(this.currentFrame);
        return true;
    }

    return false;
};

Animation.prototype.isFinished = function() {
    return this._isFinished;
};
