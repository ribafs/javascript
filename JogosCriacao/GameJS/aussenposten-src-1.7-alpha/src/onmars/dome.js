var gamejs = require('gamejs');
var views = require('./views');
var $v = require('gamejs/math/vectors');
var $r = require('gamejs/math/random');
var Building = require('./building').Building;
var Unit = require('./unit').Unit;
var tileToPixel = require('./views').tileToPixel;
var sounds = require('./sounds');
var names = require('./names');
var Stats = require('./stats').Stats;

var Dome = exports.Dome = function(args) {
   var topleft = this.topleft = args.topleft;
   var width  = this.width = args.width;
   if (!topleft || !width) {
      throw new Error('missing topleft or width');
   }
   this.guid = Math.random() * 2020202 + (Math.random() * 20292843);
   var planet = this.planet = args.planet;
   var center = this.center = $v.add(topleft, [width/2, width/2]);
   var radius = this.radius = width/2;
   this.pixelPosition = tileToPixel(topleft);

   this.buildings = this.buildings = [];
   this.units = [];
   var stepCountDown = 40 * 1000;
   var origStepCountDown = stepCountDown;

   this.stats = new Stats(this);

   this.serialize = function() {
      return {
         guid: this.guid,
         topleft: this.topleft,
         width: this.width,
         buildings: this.buildings.map(function(b) {
            return b.guid;
         }),
         units: this.units.map(function(u) {
            return u.guid;
         }),
         stats: this.stats.serialize()

      }
   }

   this.revive = function(planet, units, buildings) {
      this.planet = planet;
      this.units = this.units.map(function(uid) {
         return units[uid];
      });

      // after we set planet
      this.createWalkableTiles();
      this.buildings = this.buildings.map(function(bid) {
         var building = buildings[bid];
         this.placeWalkable(building);
         return building;
      }, this);
   }

   var walkable = this.walkable = {};
   this.createWalkableTiles = function() {
      for (var i = topleft[0]; i < topleft[0] + width; i++) {
         // -2 because last tow row is not walkable due to fence
         for (var j = topleft[1]; j < topleft[1] + width - 2; j++) {
            if (walkable[i] === undefined) {
               walkable[i] = {};
            }

            // 0 is the fence; last is also fence
            // @@ abuse various tile props to detect walkables
            if (i > topleft[0] + 1 && i < topleft[0] + width - 2
               && this.planet.isWalkable([i,j])) {
               walkable[i][j] = true;
            } else {
               walkable[i][j] = false;
            }
         }
      }
   };

   this.subscribers = [];
   /**
    * subscribe to get updates on obj creation/deletion
    **/
   this.subscribe = function(sub) {
      this.subscribers.push(sub);
   }

   this.getOxygenSaturation = function() {
      var oxygenBuildings = this.buildings.filter(function(b) {
         return b.type === 'oxygen' && b.damage < 1 && b.hasEnergy == true && b.incident == null;
      });
      var needed = (this.buildings.length * 0.05 + this.units.length * 0.15) || 1;
      return (oxygenBuildings.length) / needed;
   }

   this.isWalkable = function(tilePos) {
      return walkable[tilePos[0]] !== undefined && walkable[tilePos[0]][tilePos[1]] === true;
   }

   this.isInside = function(tilePos) {
      return walkable[tilePos[0]] !== undefined && walkable[tilePos[0]][tilePos[1]] !== undefined;
   }

   this.placeWalkable = function(building, doRemove) {
      doRemove = doRemove || false;
      for (var i = building.topleft[0]; i < building.topleft[0] + building.width + 1; i++) {
         for (var j = building.topleft[1]; j< building.topleft[1] + building.height; j++) {
            if (walkable[i] === undefined) {
               walkable[i] = {};
            }
            if (i !== building.entrance[0] || j !== building.entrance[1]) {
               walkable[i][j] = doRemove ? this.planet.isWalkable([i,j]) : false;
            }
         }
      }
   };

   this.removeWalkable = function(building) {
      this.placeWalkable(building, true);
   }

   this.place = function(building, masterBuilding) {
      this.placeWalkable(building);
      if (building.typeInfo.isWorkerBuilding) {
         if (masterBuilding == undefined) {
            throw 'missing master building for ' + building;
         }
         masterBuilding.buildings.push(building);
      }
      this.buildings.push(building);
      this.subscribers.forEach(function(sub) {
         sub.emit(building);
      });
   };

   this.unplace = function(building) {
      this.removeWalkable(building);
      this.subscribers.forEach(function(sub) {
         sub.emit(building);
      });

      building.incomingWorkers.concat(building.workers).forEach(function(w) {
         building.workerCancel(w);
      });

      if (building.incomingIncident || building.incident) {
         building.incidentCancel(building.incomingIncident || building.incident);
      }
      building.incomingMissionWorkers.concat(building.missionWorkers).forEach(function(w) {
         building.missionCancel(w);
      });

      this.buildings = this.buildings.filter(function(b) {
         // filter from subbuildings
         b.buildings = b.buildings.filter(function(sb) {
            return sb.guid !== building.guid;
         })
         return b.guid !== building.guid;
      });

      if (['living', 'relax'].indexOf(building.type) > -1) {
         building.residents.forEach(function(res) {
            res.sendHome = true;
         })
      }
      sounds.play('building-unplace');
   }

   this.testForResource = function(type, amount) {
      var fittingBuildings = this.buildings.filter(function(b) {
         return ['storage', 'elevator'].indexOf(b.type) > -1 && b.storage[type] > 0;
      }).sort(function(a,b) {
         return (b.storage[type] || 0) - (a.storage[type] || 0);
      });
      if (fittingBuildings.length <= 0) {
         return 0;
      }
      var sum = fittingBuildings.reduce(function(prev, next) {
         return prev + next.storage[type];
      }, 0);
      return Math.min(amount, sum);
   };

   this.testTotalResource = function(type) {
      return this.buildings.filter(function(b) {
         return ['storage', 'elevator'].indexOf(b.type) > -1 && b.storage[type] > 0;
      }).reduce(function(last, b) {
         return (b.storage[type] || 0) + last
      }, 0);
   }

   this.getResource = function(type, amount) {
      var fittingBuildings = this.buildings.filter(function(b) {
         return ['storage', 'elevator'].indexOf(b.type) > -1 && b.storage[type] > 0;
      }).sort(function(a,b) {
         return (b.storage[type] || 0) - (a.storage[type] || 0);
      });
      if (fittingBuildings.length <= 0) {
         return 0;
      }
      var missingAmount = amount;
      fittingBuildings.some(function(fb) {
         var a = Math.min(fb.storage[type], missingAmount);
         fb.storage[type] -= a;
         missingAmount -= a;
         if (a > 0) {
            fb.spawnResultPopup({
               resource: type,
               amount: -a
            });
         }
         if (missingAmount <= 0) {
            return true;
         }
      });

      return amount - missingAmount;
   };

   this.getEnergySaturation = function() {
      // copy pasta from stepEnergy
      var solarEnergy = this.buildings.reduce(function(prev, cur) {
         if (cur.type !== 'solar') return prev;

         return ( (1-cur.damage) * 1.5) + prev;
      }, 0);
      var totalEnergyNeed = this.buildings.reduce(function(prev, cur) {
         return prev + (cur.typeInfo.energyNeed || 0);
      }, 0);
      return solarEnergy / totalEnergyNeed;
   }

   this.stepEnergy = function() {
      var solarEnergy = this.buildings.reduce(function(prev, cur) {
         if (cur.type !== 'solar') return prev;

         return ( (1-cur.damage) * 1.5) + prev;
      }, 0);
      var totalEnergyNeed = this.buildings.reduce(function(prev, cur) {
         return prev + (cur.typeInfo.energyNeed || 0);
      }, 0);
      if (totalEnergyNeed < solarEnergy) {
         // enable all buildings
         this.buildings.forEach(function(b) {
            b.hasEnergy = true;
         })
      } else {
         // disable some random buildings
         var energyNeed = this.buildings.reduce(function(prev, cur) {
            return prev + (cur.hasEnergy === true ? cur.typeInfo.energyNeed || 0 : 0);
         }, 0);
         while (energyNeed > solarEnergy) {
            var b = $r.choose(this.buildings.filter(function(b) {
               return b.hasEnergy === true && b.energyNeed;
            }));
            if (b === undefined) {
               break;
            }
            var pixelPos = $v.add(b.pixelPosition, [-10 + b.typeInfo.width/2 + Math.random() * 20, -30]);
            spawnNegativePopup('No energy', pixelPos);
            b.hasEnergy = false;
            energyNeed = this.buildings.reduce(function(prev, cur) {
               return prev + (cur.hasEnergy === true ? cur.typeInfo.energyNeed || 0 : 0);
            }, 0);
         };
      }
   }

   this.getAverageHappiness = function() {
      var sum = this.units.reduce(function(prev, cur) {
         return prev + cur.happiness;
      }, 0);
      return sum / this.units.length;
   }
   this.getAverageFullness = function() {
      var sum = this.units.reduce(function(prev, cur) {
         return prev + cur.fullness;
      }, 0);
      return sum / this.units.length;
   }

   var buildingMaxTimeout = 200;
   var buildingTimeout = buildingMaxTimeout;
   this.update = function(msDuration) {
      stepCountDown -= msDuration;
      if (stepCountDown <= 0) {
         stepCountDown = origStepCountDown;
         this.stepSpawnUnits();
      }

      this.buildings.forEach(function(b) {
            b.update(msDuration);
      }, this);

      this.stats.update(msDuration);

      this.units.forEach(function(u) {
         u.update(msDuration);
      }, this);


      // remove timeouts
      buildingTimeout -= msDuration;
      if (buildingTimeout < 0) {
         buildingTimeout = buildingMaxTimeout;
         var removeBuildings= [];
         this.buildings.forEach(function(b) {
            if (b.damage >= 1) {
               removeBuildings.push(b);
            }
         }, this);
         removeBuildings.forEach(function(b) {
            this.unplace(b);
            spawnPopup(b.typeInfo.display + ' destroyed', b.pixelPosition, true);
         }, this);
         this.stepEnergy();

         // remove dead in two steps.
         // otherwise we get weird effects of unit and view getting disassociated
         var removedUnits = [];
         this.units = this.units.filter(function(u){
            if (u.fullness <= 0 || u.elevatorDown == true) {
               removedUnits.push(u);
               return false;
            }
            return true;
         });
         removedUnits.forEach(function(ru) {
            // remove from all buildings
            if (ru.dayState.building) {
               ru.dayState.building.workerCancel(ru);
            }
            if (ru.jobState && ru.jobState.building) {
               ru.jobState.building.missionCancel(ru);
            }
            this.removeFromResidents(ru);
            // remove job
            ru.jobState = null;
            ru.fullness = 0;
            // inform subscribers about death
            this.subscribers.forEach(function(sub) {
                sub.emit(ru);
            });
            if (ru.elevatorDown) {
               spawnPopup(ru.name + ' returned underground', ru.pixelPosition, true);
            } else {
               spawnPopup(ru.name + ' died!', ru.pixelPosition, true);
            }
         }, this)
      }
   };

   this.getFunctionalBuildings = function(type) {
      var applicable = this.buildings.filter(function(b) {
         return b.type === type && b.isFunctional();
      });
      return applicable;
   }

   this.getBuildings = function(type) {
      var applicable = this.buildings.filter(function(b) {
         return b.type === type;
      });
      return applicable;
   }

   this.stepSpawnUnits = function() {
      var elevator = this.getFunctionalBuildings('elevator')[0];
      if (elevator && (this.units.length <= 0
            || (this.getAverageHappiness() > 0.8 && this.getAverageFullness() > 0.8)))
      {
         Object.keys(Unit.STATES).some(function(unitType) {
            var buildingType = Unit.STATES[unitType].relax.buildings[0];
            var livingBuildings = this.getFunctionalBuildings(buildingType);
            var livingRoom = livingBuildings.length * Building.TYPES[buildingType].maxWorkers;
            var cCount = this.units.filter(function(u) {
               return u.dayState && u.dayState.unitType == unitType;
            }).length;
            if (livingRoom > cCount) {
               // find residency
               var hasResidencePlace = livingBuildings.filter(function(b) {
                  return b.residents.length < b.typeInfo.maxWorkers;
               });
               var unit = new Unit({
                  pixelPosition: tileToPixel(elevator.entrance),
                  dome: this,
                  unitType: unitType,
                  name: names.getRandom()
               })
               hasResidencePlace[0].residents.push(unit);
               this.units.push(unit);
               this.subscribers.forEach(function(sub) {
                  sub.emit(unit);
               });
               gamejs.logging.log('Spawned ', unitType ,' @ ', elevator.entrance, unit.guid);
               sounds.play('elevator');
               spawnPopup(unit.name + ' arrived', elevator.pixelPosition, false);
               return true;
            }
            return false;
         }, this);
      }

   }

   this.getClosestSuperBuilding = function(tilePosition, type) {
      var applicable = this.buildings.filter(function(building) {
         if (building.typeInfo.perWorkerBuilding === type) {
            var dist = $v.distance(tilePosition, building.entrance);
            return dist <= building.typeInfo.perWorkerBuildingMaxRadius && building.buildings.length < building.typeInfo.maxWorkers;
         }
         return false;
      });
      if (applicable.length <= 0) {
         gamejs.logging.log('no applicable super buildings close enough');
         return;
      }
      applicable.sort(function(a, b) {
         var distA = $v.distance(tilePosition, a.entrance);
         var distB = $v.distance(tilePosition, b.entrance);
         return distA - distB;
      });
      return applicable[0];
   }

   this.removeFromResidents = function(unit) {
      this.buildings.forEach(function(b) {
         b.residents = b.residents.filter(function(res) {
            return res.guid !== unit.guid;
         });
      })
   }

   // ujnhit only used for relax residency
   this.getDayStateRoute = function(tilePosition, dayState, unit) {
      gamejs.logging.log('getDayStateRoute', tilePosition, dayState);

      // find fitting building
      var applicable = this.buildings.filter(function(b) {
         var worksForUnit = dayState.type === 'idle' || (b.canWorkerReserve() && b.isFunctional() && b.hasNeed());
         return dayState.buildings.indexOf(b.type) >= 0 && worksForUnit;
      });
      // idle: just pick random
      if (dayState.type === 'idle') {
         applicable = [$r.choose(applicable)];
      }
      // relax: only where we live
      if (dayState.type === 'relax') {
         applicable = applicable.filter(function(b) {
            return (b.residents.indexOf(unit) > -1)
         });
      }
      if (applicable.length <= 0) {
         gamejs.logging.log('getDayStateRoute: no applicable');
         return null;
      }
      applicable.sort(function(a, b) {
         var distA = $v.distance(tilePosition, a.entrance)
         var distB = $v.distance(tilePosition, b.entrance);
         return distA - distB;
      });
      var info = null;
      applicable.some(function(building) {
         var route = this.searchMap.findRoute(tilePosition, building.entrance, 30*1000);
         if (route !== null) {
            info = {
               route: route,
               building: building
            }
            return true;
         }
      }, this);
      gamejs.logging.log('getDayStateRoute returning:', info);
      return info;
   };
   this.getJobStateRoute = function(tilePosition, jobState) {
      gamejs.logging.log('getJobStateRoute', tilePosition, jobState);
      var applicable = this.buildings.filter(function(b) {
         // origin fetch building is same as this one?
         if (jobState.originBuilding && jobState.originBuilding.guid == b.guid) {
            return false;
         }
         var jobTypeFit = (jobState.type == 'repair' && b.damage > 0)
                           || (jobState.type === 'gohomemaintenance' && b.type === 'maintenance')
                           || (jobState.type === 'gohomeauthority' && b.type === 'authority')
                           || (jobState.type === 'incident' && b.incident != null)
                           // fetch from outputStorage (normal buildings) and from the main storage if a storageType is defined (from teleport "fetch" jobState)
                           || (jobState.type === 'fetch' && b.incident == null
                              && (jobState.storageType === undefined && b.outputStorage > 0 || (jobState.storageType && b.storage[jobState.storageType] > 0) )
                              )
                           // grab from teleport
                           || (jobState.type === 'fetch' && b.type === 'teleport' && b.extraTypeInfo.importResource && b.storage[b.extraTypeInfo.importResource] > 0)
                           // store into teleport 
                           || (jobState.type === 'store') && b.guid === jobState.output.building.guid;
                           // ^^ store: send back to the building we set in Building.missionExit
         return jobTypeFit && b.canMissionReserve();

      });
      if (applicable.length <= 0) {
         gamejs.logging.log('getJobStateRoute: no applicable buildings');
         return null;
      }
      var minDist = Infinity;
      applicable.sort(function(a, b) {
         var distA = $v.distance(tilePosition, a.topleft);
         var distB = $v.distance(tilePosition, b.topleft);
         if (jobState.type === 'repair') {
            var aStatus = a.damage - (distA * 0.002);
            var bStatus = b.damage - (distB * 0.002);
         } else if (jobState.type === 'fetch') {
            var aStatus = a.outputStorageFactor() + (distA * 0.1);
            var bStatus = b.outputStorageFactor() + (distA * 0.1);
         // @@ could just make this an ELSE?
         } else if (['store', 'incident', 'gohomeauthority', 'gohomemaintenance'].indexOf(jobState.type) > -1) {
            return distA - distB;
         }
         return (1 - aStatus) - (1 - bStatus);
      });
      var info = null;
      applicable.some(function(building) {
         var route = this.searchMap.findRoute(tilePosition, building.entrance, 30*1000);
         if (route !== null) {
            info = {
               route: route,
               building: building
            }
            return true;
         }
      }, this);
      gamejs.logging.log('getJobStateRoute returning:', info);
      return info;
   };

   this.hasRepairNeed = function() {
      var buildingsWithRepairNeed = this.buildings.filter(function(b) {
         return b.damage > 0.1;
      }).length;
      var workingInRepair = 0;
      this.buildings.forEach(function(b){
         if (b.type === 'maintenance') {
            workingInRepair += b.workers.length + b.incomingWorkers.length;
         }
      })
      return workingInRepair < buildingsWithRepairNeed;
   }

   this.hasIncidentNeed = function() {
      var buildingWithIncidentNeed = this.buildings.filter(function(b) {
         return b.incident != null || b.incomingIncident != null;
      }).length;
      var workingInAuthority = 0;
      this.buildings.forEach(function(b) {
         if (b.type === 'authority') {
            workingInAuthority += b.workers.length +  b.incomingWorkers.length;
         }
      })
      return workingInAuthority < buildingWithIncidentNeed;
   }
   this.hasStorageTodo = function() {
      var workingInStorage = 0;
      this.buildings.forEach(function(b) {
         if (b.type === 'storage') {
            workingInStorage += b.workers.length +  b.incomingWorkers.length;
         }
      })
      var buildingsWithStorage = (this.buildings.filter(function(b) {
         // teleport or storage with stuff in them to fetch
         return b.outputStorage > 0 || b.extraTypeInfo.importResource && b.storage[b.extraTypeInfo.importResource] > 0;
      }).length);
      return workingInStorage < buildingsWithStorage;
   }

   // are we being revived? only create if not
   if (this.planet) {
      this.createWalkableTiles();
   }
   this.searchMap = new SearchMap(this);
   return this;
}

Dome.unserialize = function(d) {
   var dome = new Dome({
      topleft: d.topleft,
      width: d.width
   });
   dome.guid = d.guid;
   dome.units = d.units;
   dome.buildings = d.buildings;
   dome.stats = Stats.unserialize(d.stats, dome);
   return dome;
}

/**
 * SearchMap
 *
 */
var SearchMap = exports.SearchMap = function(dome) {

   this.dome = dome;

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

   /*[1,1],
   [-1,1],
   [1,-1],
   [-1,-1],
   */
   [1,0],
   [0,1],
   [-1,0],
   [0,-1]

];
SearchMap.prototype = {
   adjacent: function(point) {
      var valid = [];
      DIRECTIONS.forEach(function(dir) {
         var np = $v.add(point, dir);
         if (this.dome.isWalkable(np)) {
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