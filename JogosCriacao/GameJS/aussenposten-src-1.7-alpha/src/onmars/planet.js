var gamejs = require('gamejs');
var tmx = require('gamejs/tiledmap');
var $v = require('gamejs/math/vectors');
var $r = require('gamejs/math/random');
var Enemy = require('./enemy').Enemy;
var tileToPixel = require('./views').tileToPixel;
var sounds = require('./sounds');

var Planet = exports.Planet = function(planetTmx) {

    this.getRect = function() {
        return new gamejs.Rect([0,0], [2000, 1000]);
    }

    this.getClosestDome = function(tilePosition) {
        var domes = this.domes.slice(0);
        var adist, bdist;
        domes.sort(function(a, b) {
            adist = $v.distance(tilePosition, a.center);
            bdist = $v.distance(tilePosition, b.center);
            return adist - bdist;
        });
        return domes[0];
    }

    this.getClosestSuperBuilding = function(tilePosition, type) {
        var allClosests = this.domes.map(function(d) {
            return d.getClosestSuperBuilding(tilePosition, type);
        }).filter(function(d) {
            return d !== null;
        });
        if (allClosests.length > 0) {
            return null;
        }
        allClosests.sort(function(a, b) {
            var adist = $v.distance(tilePosition, a.center);
            var bdist = $v.distance(tilePosition, b.center);
            return bdist - adist;
        })
        return allClosests[0];
    }

    this.isWalkable = function(tp) {
      return false == this.hasTileProperty(tp, 'noFence');
    }

    this.hasTileProperty = function(tp, propertyName) {
        // @@ first layer? search for "planet obstacles"
        if (this.map.layers[1].gids[tp[1]] === undefined) {
            return false;
        }
        var gid = this.map.layers[1].gids[tp[1]][tp[0]];
        if (gid == 0) {
            return false;
        }
        var tileProps = this.map.tiles.getProperties(gid);
        return tileProps[propertyName] === true;
    };

    var cachedEnemySpawns = [];
    this.getEnemySpawns = function() {
        if (cachedEnemySpawns.length <= 0) {
            // @@ layer search for name
            this.map.layers[3].gids.forEach(function(row, j) {
                // intentional j, i index switch because that's how
                // tiles are in view
                row.forEach(function(gid, i) {
                    if (!gid) {
                        return;
                    }
                    if (gid === 3353) {
                        cachedEnemySpawns.push([i, j])
                    }
                });
            })
        }
        return cachedEnemySpawns;
    }

    this.getEnemyDayStateRoute = function(tilePosition, dayState) {
      gamejs.logging.log('getEnemyDayStateRoute', tilePosition, dayState);
      var info = {
         route: null,
         building: null
      }
      if (dayState.type === 'random') {
         if (dayState.unitType === 'flying') {
            var newPosition = $r.vector($v.subtract(tilePosition, [20,20]), $v.add(tilePosition, [20,20]));
            info.route = [tileToPixel(newPosition)];
         } else {
            // @@ BETTLE random walk
         }
        gamejs.logging.log('Random flying route', info.route);
      } else if (dayState.type === 'gohome') {
         // pick closest
         var spawnPos = this.getEnemySpawns().sort(function(a, b) {
            var distA = $v.distance(tilePosition, a);
            var distB = $v.distance(tilePosition, b);
            return distA - distB;
         })[0];
         if (dayState.unitType === 'beetle') {
            // @@ BEETLE search paths
            // with planet.searchsomething
         } else {
            info.route = [tileToPixel(spawnPos)]
         }
         gamejs.logging.log('gohome route', info.route);
      } else if (dayState.type === 'attack') {
         if (dayState.unitType == 'flying') {
            // internal
            // closest dome
            var closestDome = this.domes.sort(function(a, b) {
                var distA = $v.distance(tilePosition, a.center);
                var distB = $v.distance(tilePosition, b.center);
                return distA - distB;
            })[0];
            var applicable = closestDome.buildings.filter(function(b) {
                return b.canIncidentReserve() && ['solar', 'oxygen', 'cantine', 'repair'].indexOf(b.type) > -1;
            });
            if (applicable.length <= 0) {
              gamejs.logging.log('no applicable for getEnemyDayStateRoute');
              return null
            }
            var targetBuilding = $r.choose(applicable);
            info.route = [targetBuilding.centerPixelPosition];
            info.building = targetBuilding;
         } else {
            // BEETLE goto external building and incident attack
         }
        gamejs.logging.log('attack route', info.route);
      }
      return info;
    }

    var maxTimeout = 20 * 1000;
    var timeout = maxTimeout;
    var teleportMaxTimeout = 60 * 1000;
    var teleportTimeout = teleportMaxTimeout;
    this.update = function(msDuration) {
        timeout -= msDuration;
        if (timeout <= 0) {
            timeout = maxTimeout;
            this.stepSpawnEnemy();
        }

        teleportTimeout -= msDuration;
        if (teleportTimeout <= 0) {
          teleportTimeout = teleportMaxTimeout;
          this.stepTeleport();
        }

        this.domes.forEach(function(dome) {
            dome.update(msDuration);
        });

        this.enemies = this.enemies.filter(function(e) {
            e.update(msDuration);
            if (e.health <= 0) {
                if (e.dayState.building) {
                  e.dayState.building.incidentCancel(e);
                  // if unit dies from natural cause we want no sound or popup
                  sounds.play('incident-death', this.pixelPosition);
                  spawnPopup('Enemy died', e.pixelPosition, false, 'white');
                }
                // inform subscribers of death
                this.subscribers.forEach(function(sub) {
                    sub.emit(e);
                });
                gamejs.logging.log('Enemy died', e.guid);
                return false
            }
            return true;
        }, this);
    }

    this.stepSpawnEnemy = function() {
        if (this.enemies.length > 3) {
            return;
        }
        // @@ chance depends on distance of closest dome
        if (Math.random() < 0.5) {
            var spawnPos = $r.choose(this.getEnemySpawns());
            var newEnemy = new Enemy({planet: this, pixelPosition: tileToPixel(spawnPos), unitType: 'flying'});
            this.enemies.push(newEnemy)
            this.subscribers.forEach(function(sub) {
                sub.emit(newEnemy);
            });
            gamejs.logging.log('Spawned enemy at ', spawnPos);
        }
    };


    this.stepTeleport = function() {
        var providers = {};
        var consumers = {};
        this.domes.forEach(function(dome) {
          var teleports = dome.getFunctionalBuildings('teleport');
          teleports.forEach(function(tp) {
            if (tp.isStorageFull()) {
              return;
            }
            var eRes = tp.extraTypeInfo.exportResource;
            var iRes = tp.extraTypeInfo.importResource;
            if (eRes && tp.storage[eRes] > 0) {
                providers[eRes] = providers[eRes] || [];
                providers[eRes].push(tp);
            }
            if (iRes) {
                consumers[iRes] = consumers[iRes] || [];
                consumers[iRes].push(tp);
            }
          }, this);
        }, this);
        var sortConsumers = function() {
            Object.keys(consumers).forEach(function(res) {
                consumers[res].sort(function(a, b) {
                    return a.storage[res] - b.storage[res];
                });
            });
        };
        // all providers send to most needy consumers
        Object.keys(providers).forEach(function(res) {
            providers[res].forEach(function(provider) {
                if (consumers[res]) {
                    sortConsumers();
                    var consumer = consumers[res][0]
                    var amount = Math.min(5, provider.storage[res]);
                    provider.storage[res] -= amount;
                    consumer.storage[res] += amount;
                    spawnPopup('Teleport incoming ' + res, consumer.pixelPosition, false, 'white');
                    spawnNegativePopup('Teleport outgoing ' + res, provider.pixelPosition, false, 'white');
                }
            });
        });
    }

    this.subscribers = [];
    /**
    * subscribe to get updates on obj creation/deletion
    **/
    this.subscribe = function(sub) {
      this.subscribers.push(sub);
    }


    this.serialize = function() {
        return {
            planetTmx: planetTmx
        }
    };

    this.enemies = [];
    this.domes = [];
    this.planetTmx = planetTmx;
    this.map = new tmx.Map(this.planetTmx);
    this.searchPlanet = new SearchPlanet(this);
    return this;
}


var SearchPlanet = exports.SearchMap = function(planet) {

   this.planet = planet;

   this.findRoute = function(from, to, timeout) {
      var route = gamejs.pathfinding.findRoute(this, from, to, timeout);
      var r = [];
      var lastDirection = null;
      while (route) {
         curDirection = {};
         if (r.length > 0) {
            curDirection = $v.subtract(route.point, r[r.length-1]);
         }
         if (lastDirection === null || curDirection[0] !== lastDirection[0] ||
               curDirection[1] !== lastDirection[1]) {
            r.push(tileToPixel(route.point));
         }
         route = route.from;
         lastDirection = curDirection;
      }
      r.reverse();
      return r;
   }
   return this;
};

var DIRECTIONS = [
   [1,0],
   [0,1],
   [-1,0],
   [0,-1],

   /*[1,1],
   [-1,1],
   [1,-1],
   [-1,-1]*/

];
SearchPlanet.prototype = {
   adjacent: function(point) {
      var valid = [];
      DIRECTIONS.forEach(function(dir) {
         var np = $v.add(point, dir);
         if (!this.planet.hasTileProperty(np, 'noFence')) {
            valid.push(np);
         }
      }, this);
      return valid;
   },
   estimatedDistance: function(a, b) {
      return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
   },
   actualDistance: function(a, b) {
      return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
   }
};