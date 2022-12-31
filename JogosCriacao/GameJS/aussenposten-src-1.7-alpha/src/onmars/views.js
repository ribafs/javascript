var gamejs = require('gamejs');
var buildings = require('./building');
var Unit = require('./unit').Unit;
var $v = require('gamejs/math/vectors');
var $r = require('gamejs/math/random');
var animate = require('./animate');
var Enemy = require('./enemy').Enemy;
var bodybuilder = require('./bodybuilder');

var TILESIZE = exports.TILESIZE = 16;

var storageFont = new gamejs.font.Font("15px 'Hammersmith One', monospace");
var resourceFont = new gamejs.font.Font("13px 'Hammersmith One', monospace ");

exports.getPreloadAssets = function() {
   return [
      "./images/fire_icon.png",
      "./images/hunger_icon.png",
      "./images/happiness_icon.png",
      "./images/idle_icon.png",

      "./imagesoga/lpc-skorpios-scifi-sprite-pack/Mechs/Mech2/Mech2Walk.png",
      "./imagesoga/lpc-skorpios-scifi-sprite-pack/Mechs/Mech2/Mech2Muzzleflash.png",
      "./imagesoga/lpc-skorpios-scifi-sprite-pack/Characters/Armor1/ArmorWalk.png",
      "./imagesoga/lpc-skorpios-scifi-sprite-pack/Characters/Armor2/Armor2Walk.png",
      "./imagesoga/lpc-skorpios-scifi-sprite-pack/Laserfence.png",
      "./imagesoga/lpc-skorpios-scifi-sprite-pack/Characters/Character 1/Hurt/Character1Hurt.png",

       './imagesoga/1-hour-lpc-enemy/1hoursheet.png',

      "./images/nutrition.png",
      "./images/ore.png",
      "./images/stone.png",
      "./images/money.png",
      "./images/drugs.png",

      "./images/shadows/unit.png",


      // map.tmx
      "./maps/map.tmx",
      // cached file
      "./images/map.tmx.png",
      "./imagesoga/tiled-terrains/terrain.png",
      "./imagesoga/lpc-skorpios-scifi-sprite-pack/Objects.png",
      "./imagesoga/lpc-skorpios-scifi-sprite-pack/Building.png",
      "./imagesoga/lpc-tile-atlas2/build_atlas.png",
      "./imagesoga/lpc-tile-atlas2/obj_misk_atlas.png",
      "./imagesoga/lpc-skorpios-scifi-sprite-pack/Pipes-RustyWalls.png",
      "./imagesoga/lpc-beetle/beetlespawn.PNG"

   ];
}

var icons = {};
var laserFenceSheet = null;
var fenceSheet = null;
var armorWalkSpriteSheet = null;
var whiteArmorWalkSpriteSheet = null;
var enemyWalkSpriteSheet = null;
var dieSpriteSheet = null;
var resources = null;
var shadows = [];

exports.preload = function() {
    icons = {
        happiness: gamejs.image.load('./images/happiness_icon.png'),
        hunger: gamejs.image.load('./images/hunger_icon.png'),
        fire: gamejs.image.load('./images/fire_icon.png'),
        idle: gamejs.image.load('./images/idle_icon.png'),
    };
    var unitSize = TILESIZE * 2;

    var fenceImage = gamejs.image.load('./imagesoga/lpc-skorpios-scifi-sprite-pack/Laserfence.png');
    fenceSheet = new animate.SpriteSheet(fenceImage, {width: 32, height: 32});

    var armorImage = gamejs.image.load('./imagesoga/lpc-skorpios-scifi-sprite-pack/Characters/Armor1/ArmorWalk.png');
    armorWalkSpriteSheet = new animate.SpriteSheet(armorImage, {width: 64, height: 64, scaleTo: [unitSize, unitSize]});

    var whiteArmorImage = gamejs.image.load('./imagesoga/lpc-skorpios-scifi-sprite-pack/Characters/Armor2/Armor2Walk.png');
    whiteArmorWalkSpriteSheet = new animate.SpriteSheet(whiteArmorImage, {width: 64, height: 64, scaleTo: [unitSize, unitSize]});


    var enemyImage = gamejs.image.load('./imagesoga/1-hour-lpc-enemy/1hoursheet.png');
    enemyWalkSpriteSheet = new animate.SpriteSheet(enemyImage, {width: 64, height: 64, spacing: 1, margin: 1, scaleTo: [unitSize, unitSize]});

    var dieImage = gamejs.image.load("./imagesoga/lpc-skorpios-scifi-sprite-pack/Characters/Character 1/Hurt/Character1Hurt.png");
    dieSpriteSheet = new animate.SpriteSheet(dieImage, {width: 64, height: 64, scaleTo: [unitSize, unitSize]});

    var authorityImage = gamejs.image.load("./imagesoga/lpc-skorpios-scifi-sprite-pack/Mechs/Mech2/Mech2Walk.png");
    authoritySpriteSheet = new animate.SpriteSheet(authorityImage, {width: 96, height: 96, scaleTo: [unitSize, unitSize]});

    var authorityMuzzleImage = gamejs.image.load("./imagesoga/lpc-skorpios-scifi-sprite-pack/Mechs/Mech2/Mech2Muzzleflash.png");
    authorityMuzzleSpriteSheet = new animate.SpriteSheet(authorityMuzzleImage, {width: 96, height: 96, scaleTo: [unitSize, unitSize]});

    resources = {
        money: gamejs.image.load('./images/money.png').scale([16, 16]),
        nutrition: gamejs.image.load('./images/nutrition.png').scale([16, 16]),
        ore: gamejs.image.load('./images/ore.png').scale([16, 16]),
        stone: gamejs.image.load('./images/stone.png').scale([16, 16]),
        drugs: gamejs.image.load('./images/drugs.png').scale([16, 16])
    };

    shadows = {}
    shadows.unit = gamejs.image.load("./images/shadows/unit.png");

}

var pixelToTile = exports.pixelToTile = function(pos) {
      if (pos === undefined) { return undefined};

      return [
         Math.round(pos[0] / TILESIZE),
         Math.round(pos[1] / TILESIZE)
      ]
   };

var tileToPixel = exports.tileToPixel = function(pos) {
      if (pos === undefined) { return undefined};

      return [
         pos[0] * TILESIZE,
         pos[1] * TILESIZE
      ]
   }

/**
 * PlanetView
 */
var PlanetView = exports.PlanetView = function(planet) {
    this.planet = planet;

    this.domeViews = this.planet.domes.map(function(d) {
        return new DomeView(d);
    });

    this.enemyViews = this.planet.enemies.map(function(e) {
        return new EnemyView(e);
    })

    this.timeout = 0;

    this.isDragging = false;
    this.planet.subscribe(this);
    var map = planet.map;
    var mapSize = [map.width * TILESIZE, map.height*TILESIZE];
    this.viewRect = new gamejs.Rect([0, 0], mapSize);
    this.origViewRect = this.viewRect.clone();
    this.image = new gamejs.graphics.Surface(mapSize);
    try {
        // @@ make dependend on loaded planet.planetTmx
        this.mapImage = gamejs.image.load('./images/map.tmx.png');
        console.log('Loaded map.tmx.png from cache');
    } catch (e) {
        console.log('Failed to load cached map.tmx.png. Generating now...');
        this.mapImage = this.image.clone();
        var layerViews = map.layers.map(function(layer) {
          return new LayerView(layer, {
             tileWidth: TILESIZE,
             tileHeight: TILESIZE,
             width: map.width,
             height: map.height,
             tiles: map.tiles
          });
        });
        layerViews.forEach(function(layer) {
            layer.draw(this.mapImage);
        }, this);
    }


    return this;
}

PlanetView.prototype.emit = function(modifiedObj) {
    // @@ circular dep
    var Dome = require('./dome').Dome;
    if (modifiedObj instanceof Enemy) {
        if (modifiedObj.health <= 0) {
            // kill enemy
            this.enemyViews.some(function(ev) {
                if (ev.enemy.guid === modifiedObj.guid) {
                    foundView = ev;
                    foundView.animation.setState('die');
                    gamejs.logging.log('Started die enemy animation', ev.enemy.guid);
                    return true;
                }
            });
        } else {
            this.enemyViews.push(new EnemyView(modifiedObj));
        }
    } else if (modifiedObj instanceof Dome) {
        this.domeViews.push(new DomeView(modifiedObj));
    } else {
        gamejs.logging.log('Unknown emit object ', modifiedObj);
    }
}

PlanetView.keyToScroll = {};
PlanetView.keyToScroll[gamejs.event.K_LEFT] = [-1,0];
PlanetView.keyToScroll[gamejs.event.K_UP] = [0, -1];
PlanetView.keyToScroll[gamejs.event.K_DOWN] = [0, 1];
PlanetView.keyToScroll[gamejs.event.K_RIGHT] = [1, 0];
PlanetView.prototype.onEvent = function(event) {
    if (event.type === gamejs.event.MOUSE_UP){
        this.isDragging = false;
        document.body.style.cursor = 'auto';
    } else if (event.type === gamejs.event.MOUSE_DOWN) {
        this.isDragging = true;
        document.body.style.cursor = 'move';
    } else if (event.type === gamejs.event.MOUSE_MOTION) {
        if (this.isDragging) {
            var tl = this.viewRect.topleft;
            this.viewRect.topleft = [
                Math.max(tl[0] + event.rel[0], 0),
                Math.max(tl[1] + event.rel[1], 0),
            ];
        }
    } else if (event.type === gamejs.event.KEY_DOWN) {
        this.scrollDir = PlanetView.keyToScroll[event.key];
    } else if (event.type === gamejs.event.KEY_UP) {
        this.scrollDir = null;
    }
}

PlanetView.prototype.inView = function(pos) {
  var displaySize = gamejs.display.getSurface().getSize();
  var viewRect = this.viewRect.clone();
  viewRect.width = displaySize[0];
  viewRect.height = displaySize[1];
  return viewRect.collidePoint(pos);
}

PlanetView.prototype.zoomIn = function() {
    if (this.viewRect.width !== this.origViewRect.width) {
        this.viewRect = this.origViewRect;
    }
}
PlanetView.prototype.zoomOut = function() {
    this.viewRect = new gamejs.Rect([0,0], [this.origViewRect.width * 6, this.origViewRect.height * 6]);
}
PlanetView.prototype.zoomFactor = function() {
    return this.viewRect.width / this.origViewRect.width;
}

PlanetView.prototype.getDomeInView = function() {
    var centerTile = this.pixelToTile(this.viewRect.topleft);
    return this.planet.getClosestDome(centerTile);
}

PlanetView.prototype.pixelToTile = function(pos) {
    if (pos === undefined) { return undefined};

      var tl = this.viewRect.topleft;
      var cpos = [
        pos[0] + tl[0],
        pos[1] + tl[1]
      ];
      return pixelToTile(pos);
}

PlanetView.prototype.canvasToAbsolute = function(pos) {
  // [left, top]
    var offset = gamejs.display._getCanvasOffset();
    var tl = this.viewRect.topleft;
    return [
       pos[0] + offset[0] - tl[0],
       pos[1] + offset[1] - tl[1]
    ];
}
PlanetView.prototype.tileToPixel = function(pos) {
      if (pos === undefined) { return undefined};

      var cpos = tileToPixel(pos);
      var tl = this.viewRect.topleft;
      return [
        cpos[0] - tl[0],
        cpos[1] - tl[1]
      ];
}

PlanetView.prototype.draw = function(display) {
    this.image.blit(this.mapImage);
    this.domeViews.forEach(function(dv) {
        dv.draw(this.image);
    }, this);

    this.enemyViews.forEach(function(ev) {
        ev.draw(this.image);
    }, this);
    display.blit(this.image, [0,0], this.viewRect);
}

/// @@ PERFORMANCE TUNE HERE
PlanetView.origTimeout = 400;
PlanetView.prototype.update = function(msDuration) {
    if (this.scrollDir) {
        this.viewRect.moveIp($v.multiply(this.scrollDir, 10));
    }
    this.domeViews.forEach(function(dv) {
        dv.update(msDuration);
    });
    this.enemyViews = this.enemyViews.filter(function(ev) {
        ev.update(msDuration);
        // remove dead units
        if (ev.animation.isFinished() && ev.animation.currentAnimation === 'die') {
            gamejs.logging.log('Removed enemy view', ev.enemy.guid);
            return false;
        }
        return true;
    })
    // @@ PERFORMANCE
    // stop updating the images if we are out of view
    this.timeout -= msDuration;
    if (this.timeout < 0) {
        this.domeViews.forEach(function(dv) {
            dv.updateImage();
        });
        this.timeout = PlanetView.origTimeout;
    }
}

/**
 * LayerView
 * Renders the layer to a big surface.
 */
var LayerView = function(layer, opts) {

   this.draw = function(display) {
      display.blit(this.surface);
   }
   /**
    * constructor
    */
   this.surface = new gamejs.graphics.Surface(opts.width * opts.tileWidth, opts.height * opts.tileHeight);
   this.surface.setAlpha(layer.opacity);
   /**
    * Note how below we look up the "gid" of the tile images in the TileSet from the Map
    * ('opt.tiles') to get the actual Surfaces.
    */
   layer.gids.forEach(function(row, i) {
      row.forEach(function(gid, j) {
         if (gid ===0) return;

         var tileSurface = opts.tiles.getSurface(gid);
         if (tileSurface) {
            tileSurface = tileSurface.scale([TILESIZE, TILESIZE]);
            this.surface.blit(tileSurface,
               new gamejs.Rect([j * opts.tileWidth, i * opts.tileHeight], [opts.tileWidth, opts.tileHeight])
            );
         } else {
            gamejs.logging.log('no gid ', gid, i, j, 'layer', i);
         }
      }, this);
   }, this);
   return this;
};


/*
fence sprite idx
2  0   0    2
11 16  16   11
11          11
11  0  0  0 11
18 16 16    18
*/
var fenceSpriteIdx = {
    "default": {
        startend: 11,
        middle: null
    },
    0: {
        startend: 2,
        middle: 0
    },
    1: {
        startend: 11,
        middle: 16
    },
    "-2": {
        startend: 11,
        middle: 0
    },
    "-1": {
        startend: 18,
        middle: 16
    }
}

/**
 * DomeView
 */
var DomeView = exports.DomeView = function(dome) {
    var wh = dome.width * TILESIZE;
    this.image = new gamejs.graphics.Surface([wh, wh]);
    this.dome = dome;
    this.drawArray = [];
    this.buildingViews = dome.buildings.map(function(b) {
        var bv = new BuildingView(b);
        return bv;
    }, this);
    this.unitViews = dome.units.map(function(u) {
        return new UnitView(u);
    })

    this.dome.subscribe(this);

    /** draw fence on own images **/
    var minI = dome.topleft[1] - 1;
    for (var i = minI; i < dome.topleft[1] + dome.width; i++) {
        var idx = (i - minI).toString();
        var nidx = i - dome.topleft[1] - dome.width + 1;
        if (nidx === 0){
            continue;
        }
        if (nidx > -3 && nidx < 0) {
            idx = (nidx).toString();
        }
        var spriteConfig = fenceSpriteIdx[idx] || fenceSpriteIdx['default'];
        for (var j = dome.topleft[0]; j < dome.topleft[0] + dome.width; j++) {
            var pos = spriteConfig.middle;
            if (j == dome.topleft[0] || j == dome.topleft[0] + dome.width - 2) {
                pos = spriteConfig.startend;
            }
            var img = fenceSheet.get(pos);
            if (img) {
                this.image.blit(img, [(j - dome.topleft[0]) * TILESIZE, (i - dome.topleft[1]) * TILESIZE]);;
            }
        }
    }
    return this;
}

/**
 * model emits to domeview when objs are created or destroy.
 */
DomeView.prototype.emit = function(modifiedObj) {
    if (modifiedObj instanceof buildings.Building) {
        if (modifiedObj.damage >= 1) {
            this.buildingViews = this.buildingViews.filter(function(bv) {
                if (bv.building.guid !== modifiedObj.guid ) {
                  return true;
                } else {
                  // don nothing
                }
            }, this);
        } else {
            var bv = new BuildingView(modifiedObj);
            this.buildingViews.push(bv);
        }
    } else if (modifiedObj instanceof Unit) {
        // unit death or new?
        if (modifiedObj.fullness <= 0) {
            this.unitViews.some(function(uv) {
                if (uv.unit.guid === modifiedObj.guid) {
                    uv.animation = uv.dieAnimation;
                    gamejs.logging.log('Started unit die', uv.unit.guid);
                    return true;
                }
            });
        } else {
            this.unitViews.push(new UnitView(modifiedObj))
        }
    } else {
        gamejs.logging.log('Unknown emit object ', modifiedObj);
    }
}

DomeView.prototype.draw = function(display) {
    display.blit(this.image, this.dome.pixelPosition);

    this.drawArray.forEach(function(uv) {
        uv.draw(display);
    }, this);
}

DomeView.prototype.update = function(msDuration) {
    this.unitViews = this.unitViews.filter(function(uv) {
        uv.update(msDuration);
        // remove dead units
        if (uv.animation.isFinished() && uv.animation.currentAnimation === 'die') {
            gamejs.logging.log('Removed dead unit ', uv.unit.guid);
            return false;
        }
        return true;
    })
}


DomeView.prototype.updateImage = function() {

    // delegate down
    this.buildingViews.forEach(function(bv) {
        bv.updateImage();
    });
    this.unitViews.forEach(function(uv) {
        uv.updateImage();
    });

    this.drawArray = this.buildingViews.concat(this.unitViews)
    this.drawArray.sort(function(a, b) {
        var aY = a.unit ? a.unit.pixelPosition[1] + TILESIZE  : a.rect.bottomleft[1];
        var bY = b.unit ? b.unit.pixelPosition[1] + TILESIZE : b.rect.bottomleft[1];
        return aY - bY;
    }, this);
}
/**
 * BuildingView
 */
var BuildingView = function(building) {
    this.building = building;
    this.widthHeight = tileToPixel([building.width, building.height]);
    this.rect = new gamejs.Rect(this.building.pixelPosition, this.widthHeight);
    this.image = new gamejs.graphics.Surface(this.rect);
    this.spriteImage = gamejs.image.load('./images/' + this.building.type + '.png');

    // sacle
    this.rotation = 0;
    if (this.building.rotation == 1) {
        this.rotation = 90;
    } else if (this.building.rotation == 2) {
        this.rotation = 180;
    } else if (this.building.rotation === 3) {
        this.rotation = 270;
    }
    this.spriteImage = this.spriteImage.rotate(this.rotation).scale(this.widthHeight)
    return this;
}

BuildingView.prototype.draw = function(display) {
    display.blit(this.image, this.building.pixelPosition);
}

BuildingView.prototype.updateImage = function() {
    this.image.clear();
    this.image.blit(this.spriteImage);

    var fakeImage = new gamejs.graphics.Surface(tileToPixel([this.building.typeInfo.width, this.building.typeInfo.height]));
    var building = this.building;
    var rect = this.rect.clone();
    rect.topleft = [0,0]

    var maxPerStack = 8;
    // damage
    if (building.damage > 0.2) {
        var maxWidth = 50;
        var w = maxWidth * building.damage;
        var h = 5;
        var chart = new gamejs.Rect($v.add(rect.topright, [-maxWidth, 0]), [w, h]);
        gamejs.graphics.rect(fakeImage, 'red', chart, 0);
        if (building.damage > 0.9) {
            chart.topleft = $v.add(chart.topleft, [-1,-1]);
            chart.height +=1;
            chart.width =maxWidth;
            gamejs.graphics.rect(fakeImage, 'black', chart, 1);
            fakeImage.blit(icons.fire, $v.add(rect.topright, [-30, 15]));
        }
    }
    // multi storage
    if (['storage', 'teleport'].indexOf(building.type) > -1) {
        var startX = 5;
        var maxX = rect.width - 16;
        var diffX = 17;
        var diffY = 17;
        var r = $v.add(rect.topleft, [startX, 25]);
        Object.keys(building.storage).forEach(function(key) {
            var c = Math.floor(building.storage[key]);
            while (c > 0) {
                fakeImage.blit(resources[key], r);
                // @@ performance: prerender all numbers (0 - maxPerStack)
                var renderNumber = c < maxPerStack ? (c).toFixed(0) : maxPerStack;
                var number = resourceFont.render(renderNumber, 'white');
                fakeImage.blit(number, $v.add(r, [4,4]));
                r[0] += diffX;
                if (r[0] >= maxX) {
                    r[0] = startX;
                    r[1] += diffY;
                }
                c -= maxPerStack;
            }
        });
    } else if (building.outputStorageFactor() > 0) {
        var startX = 48;
        var maxX = rect.width - 16;
        var diffX = 17;
        var diffY = -17;
        var r = $v.add(rect.bottomleft, [startX, -17]);
        var c = Math.floor(building.outputStorage);
        var key = building.typeInfo.output.resource;
        while (c > 0) {
            fakeImage.blit(resources[key], r);
            // @@ performance: prerender all numbers (0 - maxPerStack)
            var renderNumber = c < maxPerStack ? (c).toFixed(0) : maxPerStack;
            var number = resourceFont.render(renderNumber, 'white');
            fakeImage.blit(number, $v.add(r, [4,4]));
            r[0] += diffX;
            if (r[0] >= maxX) {
                r[0] = startX;
                r[1] += diffY;
            }
            c -= maxPerStack;
        }
    }

    // unit places
    var center = [12,12];
    for (var i = 0; i < this.building.typeInfo.maxWorkers; i++) {
        var color = '#999999';
        if (i < this.building.workers.length) {
            worker = this.building.workers[i];
            fakeImage.blit(worker.view.walkAnimation.getPortrait(), $v.subtract(center, [16, 12]));
        } else {
            if (this.building.typeInfo.maxWorkers - i - 1 < this.building.typeInfo.maxWorkers - this.building.userMaxWorkers) {
                color = 'black';
            }
            gamejs.graphics.circle(fakeImage, color, center, 4, 0);
            gamejs.graphics.circle(fakeImage, 'black', center, 5, 1);
        }
        center = $v.add(center, [14, 0]);
    };

    if (this.rotation !== 0) {
        this.image.blit(fakeImage.rotate(this.rotation));
    } else {
        this.image.blit(fakeImage);
    }
}

/**
 * UnitView
 */
var UnitView = function(unit) {
    this.unit = unit;
    this.unit.view = this;
    this.image = new gamejs.graphics.Surface([TILESIZE * 2, TILESIZE * 2]);

    var rate = 20;
    var lpcWalkConfig = {
        idle: {frames: [0], rate: rate, loop: true},
        up: {frames: [0,1,2,3,4,5,6,7,8], rate: rate, loop: true},
        left: {frames: [9,10,11,12,13,14,15,16,17], rate: rate, loop: true},
        down: {frames: [18,19,20,21,22,23,24,25,26], rate: rate, loop: true},
        right: {frames: [27,28,29,30,31,32,33,34,35], rate: rate, loop:true}
    };
    this.walkAnimation = bodybuilder.getAnimation(this.unit.guid, this.unit.unitType);
    this.armorWalkAnimation = new animate.Animation(armorWalkSpriteSheet, "down", lpcWalkConfig);
    this.whiteArmorWalkAnimation = new animate.Animation(whiteArmorWalkSpriteSheet, "down", lpcWalkConfig);
    this.dieAnimation = new animate.Animation(dieSpriteSheet, "die", {
        die: {frames: [0,1,2,3,4,5], rate: 10, loop: false}
    })
    this.authorityAnimation = new animate.Animation(authoritySpriteSheet, "down", {
        idle: {frames: [0], rate: rate, loop: true},
        up: {frames: [0,1,2,3,4,5,6,7], rate: rate, loop: true},
        left: {frames: [8, 9,10,11,12,13,14,15], rate: rate, loop: true},
        down: {frames: [16,17, 18,19,20,21,22,23], rate: rate, loop: true},
        right: {frames: [24,25,26, 27,28,29,30,31], rate: rate, loop:true}
    })
    this.animation = this.walkAnimation;

    this.maxMuzzleTimeout = 1000;
    this.muzzleTimeout = this.maxMuzzleTimeout;

    return this;
}

UnitView.directionToAnimation = [];
UnitView.directionToAnimation[-1] = [];
UnitView.directionToAnimation[-1][0] = 'left';
UnitView.directionToAnimation[-1][1] = 'down';
UnitView.directionToAnimation[-1][-1] = 'up';
UnitView.directionToAnimation[+1] = [];
UnitView.directionToAnimation[+1][0] = 'right';
UnitView.directionToAnimation[+1][1] = 'down';
UnitView.directionToAnimation[+1][-1] = 'up';
UnitView.directionToAnimation[0] = [];
UnitView.directionToAnimation[0][1] = 'down';
UnitView.directionToAnimation[0][-1] = 'up';


UnitView.prototype.update = function(msDuration) {
    if (this.muzzleTimeout < -this.maxMuzzleTimeout) {
        this.muzzleTimeout = this.maxMuzzleTimeout;
    } else {
        this.muzzleTimeout -= msDuration;
    }
    // dont cancel death
    var d = this.unit.direction;
    if (this.animation.currentAnimation !== 'die') {
        if (this.unit.dayState.building && this.unit.dayState.building.type === 'maintenance'
            && this.unit.dayState.routeFinished === true) {
            this.animation = this.armorWalkAnimation;
        } else if (this.unit.jobState && ['fetch', 'store'].indexOf(this.unit.jobState.type) > -1
            && this.unit.dayState.routeFinished === true) {
            this.animation = this.whiteArmorWalkAnimation;
        } else if (this.unit.dayState.building && this.unit.dayState.building.type === 'authority'
            && this.unit.dayState.routeFinished === true) {
            this.animation = this.authorityAnimation;
        } else {
            this.animation = this.walkAnimation;
        }

        if (d !== null) {
            d = [
                Math.round(d[0]),
                Math.round(d[1])
            ];
            var newState = UnitView.directionToAnimation[d[0]][d[1]];
            if (newState !== this.animation.currentAnimation) {
                this.animation.setState(newState);
            }
        } else if (this.unit.jobState && this.unit.jobState.type !== 'incident') {
            this.animation.setState('idle');
        }
    }
    if( d !== null || ['die', 'idle'].indexOf(this.animation.currentAnimation) > -1) {
        var didUpdate = this.animation.update(msDuration) === true
        if (didUpdate) {
            this.updateImage();
        }
    }
}

UnitView.prototype.updateImage = function() {
    this.image.clear();

    var rect = this.image.getRect().clone();
    rect.topleft = $v.add(rect.topleft, [5, 5]);
    rect.width -= 10;
    rect.height -= 10;
    var unit = this.unit;
    var center = rect.center;
    var maxH = 10;
    if (unit.happiness < 0.8 || unit.dayState.type === 'relax') {
        this.image.blit(icons.happiness, rect.topleft);
    }
    if (unit.fullness < 0.8 || unit.dayState.type === 'eat') {
        this.image.blit(icons.hunger, $v.add(rect.topright, [-10, 1]));
    }

    this.image.blit(this.animation.image);

    if (unit.dayState.type === 'idle') {
        this.image.blit(icons.idle, rect.topleft);
    }
}

UnitView.shadowOffset = $v.divide(tileToPixel([-0.5, 0.8]), 2);
UnitView.prototype.draw = function(display) {
    // if inside building: do not draw yourself
    if (this.unit.dayState.route && this.unit.dayState.routeFinished == true) {
        if (this.unit.jobState == null && (['maintenance', 'authority'].indexOf(this.unit.dayState.building.type) == -1 || this.unit.dayState.hadJob == false)) {
            return;
        }
    }

    display.blit(shadows.unit, $v.add(this.unit.pixelPosition, UnitView.shadowOffset));

    var unitTopLeft = $v.subtract(this.unit.pixelPosition, [16, 16]);
    display.blit(this.image, unitTopLeft);

    if (this.unit.jobState && this.unit.jobState.type === 'incident' && this.unit.jobState.routeFinished === true && this.muzzleTimeout <= 0) {
        display.blit(authorityMuzzleSpriteSheet.get(this.animation.currentFrame), unitTopLeft);
    }
}

/**
 * EnemyView
 */
var EnemyView = function(enemy) {
    this.enemy = enemy;
    this.image = new gamejs.graphics.Surface([TILESIZE * 2, TILESIZE * 2]);

    var rate = 10;
    var lpcWalkConfig = {
        up: {frames: [4, 5, 6, 7], rate: rate, loop: true},
        left: {frames: [12, 13, 14, 15], rate: rate, loop: true},
        down: {frames: [0, 1, 2, 3], rate: rate, loop: true},
        right: {frames: [8, 9, 10, 11], rate: rate, loop:true},
        die: {frames: [4, 5, 6, 7], rate: rate, loop: false},
    };
    if (enemy.unitType === 'flying') {
        spriteSheet = enemyWalkSpriteSheet;
    }
    this.walkAnimation = new animate.Animation(spriteSheet, "down", lpcWalkConfig);
    this.animation = this.walkAnimation;
    return this;
}

EnemyView.prototype.update = function(msDuration) {

    var d = this.enemy.direction;
    if (d !== null) {
        d = [
            Math.round(d[0]),
            Math.round(d[1])
        ];
        this.animation.setState(UnitView.directionToAnimation[d[0]][d[1]]);
    }
    if(this.animation.update(msDuration) === true) {
        this.updateImage();
    }
}

EnemyView.prototype.updateImage = function() {
    this.image.clear();
    this.image.blit(this.animation.image);
}

EnemyView.prototype.draw = function(display) {
    display.blit(this.image, $v.subtract(this.enemy.pixelPosition, [16, 16]));
}