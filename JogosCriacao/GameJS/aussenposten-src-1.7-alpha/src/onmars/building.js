var gamejs = require('gamejs');
var $v = require('gamejs/math/vectors');
var $r = require('gamejs/math/random');
var tileToPixel = require('./views').tileToPixel;
var sounds = require('./sounds');

// set building size dependend on image
exports.init = function() {
   Object.keys(Building.TYPES).forEach(function(key){
      var b = Building.TYPES[key];
      var img = gamejs.image.load('./images/' + key + '.png');
      var size = img.getSize();
      b.width = size[0] / 32;
      b.height = size[1] / 32;

   })
}

var Building = exports.Building = function(args) {
   this.type = args.type;
   this.typeInfo = JSON.parse(JSON.stringify(Building.TYPES[this.type]));
   this.rotation = args.rotation;
   this.width = this.rotation % 2 === 0 ? this.typeInfo.width : this.typeInfo.height;
   this.height = this.rotation % 2 == 0 ? this.typeInfo.height : this.typeInfo.width;
   this.topleft = args.topleft;
   this.pixelPosition = tileToPixel(this.topleft);
   this.centerPixelPosition = (new gamejs.Rect(this.pixelPosition, tileToPixel([this.width, this.height]))).center;
   this.dome = args.dome;
   // somewhat duplicated in buildmenu
   if (this.rotation === 1) {
      this.entrance = $v.add(this.topleft, [
          0,
          1
      ]);
   } else if (this.rotation === 2) {
      this.entrance = $v.add(this.topleft, [
          (this.typeInfo.width - 1),
          0
      ]);
   } else if (this.rotation === 3) {
      this.entrance = $v.add(this.topleft, [
          (this.typeInfo.height -1),
          (this.typeInfo.width - 1)
      ]);
   } else {
      this.entrance = $v.add(this.topleft, [
          1,
          (this.typeInfo.height -1)
      ]);
   }
   this.hasEnergy = true;
   this.guid = Math.random() * 2020202 + (Math.random() * 20292843);
   this.maxRepairCooldown = 10 * 1000;
   this.repairCooldown = 0;

   var damage = 0;

   Object.defineProperty(this, 'damage', {
      set: function(val) {
         newVal = Math.max(0, Math.min(1, val));
         // no damage while still repair cooldown
         if (this.repairCooldown <= 0 || newVal < damage) {
            damage = newVal;
         }
      },
      get: function() {
         return damage;
      }
   });

   // user selected maxWorkers through buildinggui
   var _userMaxWorkers =  this.typeInfo.maxWorkers;
   var self = this;
   Object.defineProperty(this, 'userMaxWorkers', {
      set: function(val) {
         _userMaxWorkers = Math.max(0, Math.min(self.typeInfo.maxWorkers, val));
      },
      get: function() {
         return _userMaxWorkers;
      }
   });

   this.outputStorage = 0;

   this.buildings = []; // attached buildings
   this.updateDelta = this.typeInfo.updateDelta;

   // only used by type=storage
   this.storage = {
      nutrition: 0,
      stone: 0,
      ore: 0,
      money: 0,
      drugs: 0
   };
   // initial storage
   if (this.type === 'elevator'){
      this.storage.money = 20;
      this.storage.stone = 60;
      this.storage.ore = 0;
      this.storage.nutrition = 30;
      this.storage.drugs = 10;
   }

   this.incident = null;
   this.incomingIncident = null;
   this.workers = [];
   this.incomingWorkers = [];
   this.missionWorkers = [];
   this.incomingMissionWorkers = [];

   this.residents = [];

   this.extraTypeInfo = {};

   return this;
};

Building.prototype.serialize = function() {
   return {
      type: this.type,
      rotation: this.rotation,
      topleft: this.topleft,
      dome: this.dome.guid,
      guid: this.guid,
      storage: this.storage,
      userMaxWorkers: this.userMaxWorkers,
      damage: this.damage,
      updateDelta: this.updateDelta,
      outputStorage: this.outputStorage,
      extraTypeInfo: this.extraTypeInfo,
      incident: this.incident ? this.incident.guid : null,
      incomingIncident: this.incomingIncident ? this.incomingIncident.guid : null,
      buildings: this.buildings.map(function(b) {
         return b.guid;
      }),
      workers: this.workers.map(function(w) {
         return w.guid
      }),
      residents: this.residents.map(function(w) {
         return w.guid
      }),
      incomingWorkers: this.incomingWorkers.map(function(w) {
         return w.guid
      }),
      missionWorkers: this.incomingMissionWorkers.map(function(w) {
         return w.guid
      }),
      incomingMissionWorkers: this.incomingMissionWorkers.map(function(w) {
         return w.guid
      })
   }
}

Building.unserialize = function(b) {
   var building = new Building({
      type: b.type,
      rotation: b.rotation,
      topleft: b.topleft,
      dome: null
   });
   ['guid', 'updateDelta', 'dome', 'storage', 'damage', 'outputStorage', 'incident', 'incomingIncident',
      'buildings', 'residents', 'workers', 'extraTypeInfo', 'incomingWorkers', 'missionWorkers', 'incomingMissionWorkers', 'userMaxWorkers'].forEach(function(k) {
      if (b[k] !== undefined) {
         building[k] = b[k];
      }
   });
   return building;
}
Building.prototype.revive = function(domes, units, enemies, buildings) {
   this.dome = domes[this.dome]
   if (this.incident) {
      this.incident = enemies[this.incident];
   }
   if (this.incomingIncident) {
      this.incomingIncident = enemies[this.incomingIncident];
   }
   this.buildings = this.buildings.map(function(bguid) {
      return buildings[bguid];
   });

   var resolveUnit = function(wid) {
      return units[wid];
   }
   this.workers = this.workers.map(resolveUnit);
   this.incomingWorkers = this.incomingWorkers.map(resolveUnit);
   this.missionWorkers = this.missionWorkers.map(resolveUnit);
   this.incomingMissionWorkers = this.incomingMissionWorkers.map(resolveUnit);
   this.residents = this.residents.map(resolveUnit);

}

Building.prototype.toString = function() {
   return this.type;
}

/** incent = an enemy **/
Building.prototype.canIncidentReserve = function() {
   return this.incomingIncident == null && this.incident == null;
}
Building.prototype.incidentReserve = function(enemy) {
   this.incomingIncident = enemy;
}
Building.prototype.incidentEnter = function(enemy) {
   this.incomingIncident = null;
   this.incident = enemy;
   gamejs.logging.log('incident enter', this, enemy.guid);
}
// noop argument
Building.prototype.incidentExit = function(enemy) {
   this.incident = null;
   gamejs.logging.log('incident exit', this, enemy.guid);
}
// noop arg
Building.prototype.incidentCancel = function(enemy) {
   this.incident = null;
   this.incomingIncident = null;
   gamejs.logging.log('incident cancel', this, enemy.guid);
}

/**
 * unit interface mission
 */
Building.prototype.canMissionReserve = function() {
   var max = this.type === 'storage' ? this.typeInfo.maxWorkers : 1;
   return (this.missionWorkers.length + this.incomingMissionWorkers.length) < max;
}

Building.prototype.missionReserve = function(unit) {
   this.incomingMissionWorkers.push(unit);
   gamejs.logging.log('mission reserve', this, unit.guid);
}

Building.prototype.missionEnter = function(unit) {
   this.incomingMissionWorkers = this.incomingMissionWorkers.filter(function(u) {
      return u.guid !== unit.guid;
   })
   gamejs.logging.log('mission enter', this, unit.guid);
   this.missionWorkers.push(unit);
}
Building.prototype.missionExit = function(unit) {
   this.missionWorkers = this.missionWorkers.filter(function(u) {
      return u.guid !== unit.guid;
   });
   // send home to store exit
   if (unit.jobState && unit.jobState.type === 'fetch') {
      sounds.play('pickup-storage', this.pixelPosition);
      // fetching from teleport
      if (this.type === 'teleport') {
         var res = this.extraTypeInfo.importResource;
         var amount = Math.min(15, this.storage[this.extraTypeInfo.importResource]);
         this.storage[this.extraTypeInfo.importResource] -= amount;
      // fetch specific type from storage
      } else if (unit.jobState.storageType) {
         var res = unit.jobState.storageType;
         var amount = Math.min(15, this.storage[res]);
         this.storage[res] -= amount;
      // fetch whatever outputStorage is
      } else {
         var amount = Math.min(15, this.outputStorage);
         this.outputStorage -= amount;
         var res = this.typeInfo.output.resource;
      }
      var prepOutput =  {
         building: unit.jobState.originBuilding,
         resource: res,
         amount: amount
      };
      unit.setJobState('store');
      // set back to dayState storage building; also see dome.getJobStateRoute
      unit.jobState.output = prepOutput;
      spawnPopup( (amount).toFixed(0) + ' ' + res + ' picked up', unit.pixelPosition, '#00ffff');
   } else if (unit.jobState && unit.jobState.type === 'store') {
      // coming back? see above
      sounds.play('drop-storage', this.pixelPosition);
      if (unit.jobState && unit.jobState.type === 'store') {
         var o = unit.jobState.output;
         this.storage[o.resource] += o.amount;
         unit.jobState.output = null;
         spawnPopup((o.amount).toFixed(0) + ' ' + resourceToDisplay[o.resource] + ' stored', unit.pixelPosition, false, '#00ffff');
      }
      unit.jobState = null;
   } else {
      unit.jobState = null;
   }

   gamejs.logging.log('mission exit', this, unit.guid);
}

// remove from all lists
Building.prototype.missionCancel = function(unit) {
   this.missionWorkers = this.missionWorkers.filter(function(u) {
      return u.guid !== unit.guid;
   });
   this.incomingMissionWorkers = this.incomingMissionWorkers.filter(function(u) {
      return u.guid !== unit.guid;
   })
   gamejs.logging.log('mission cancel', this, unit.guid);
}


/**
 * unit interface worker
 */
Building.prototype.canWorkerReserve = function() {
   if ((this.workers.length + this.incomingWorkers.length) >= this.maxWorkers()) {
      return false;
   }
   var hasInputResource = true;
   var requiredResourceAmount = true;
   if (this.typeInfo.input) {
      var requiredAmount = this.typeInfo.input.perWorker * (this.workers.length + this.incomingWorkers.length + 1);
      hasInputResource = this.dome.testForResource(this.typeInfo.input.resource, requiredResourceAmount) > 0;
   }
   if (this.type === 'teleport') {
      if (this.extraTypeInfo.exportResource) {
         hasInputResource = this.dome.testForResource(this.extraTypeInfo.exportResource, 5) > 0;
      } else {
         hasInputResource = false;
      }
   }
   var hasStorageTodo = this.type !== 'storage' || this.dome.getJobStateRoute(this.topleft, {type: 'fetch'}) != null;
   return hasStorageTodo && hasInputResource;
}

Building.prototype.workerReserve = function(unit) {
   this.incomingWorkers.push(unit);
   gamejs.logging.log('Worker reserve', this, unit.guid);
}

Building.prototype.workerEnter = function(unit) {
   this.incomingWorkers = this.incomingWorkers.filter(function(u) {
      return u.guid !== unit.guid;
   })
   gamejs.logging.log('Worker enter', this, unit.guid);
   sounds.play('enter-building', this.pixelPosition);
   this.type === 'maintenance' && unit.setJobState('repair');
   this.type === 'authority' && unit.setJobState('incident');
   if (this.type === 'storage') {
      unit.setJobState('fetch');
      unit.jobState.originBuilding = this;
   }
   if (this.type === 'teleport') {
      unit.setJobState('fetch');
      unit.jobState.storageType = this.extraTypeInfo.exportResource; 
      unit.jobState.originBuilding = this;
   }
   if (this.type === 'elevator') {
      unit.elevatorDown = true;
   }

   this.workers.push(unit);
}
Building.prototype.workerExit = function(unit) {
   this.workers = this.workers.filter(function(u) {
      return u.guid !== unit.guid;
   });
   sounds.play('exit-building', this.pixelPosition);
   gamejs.logging.log('Worker exit', this, unit.guid);
};

// remove from all lists
Building.prototype.workerCancel = function(unit) {
   this.workers = this.workers.filter(function(u) {
      return u.guid !== unit.guid;
   }, this);
   this.incomingWorkers = this.incomingWorkers.filter(function(u) {
      return u.guid !== unit.guid;
   }, this)
}

Building.prototype.getStorageSum = function() {
   var sum = 0;
   Object.keys(this.storage).forEach(function(key) {
      sum += this.storage[key];
   }, this);
   return sum;
};

Building.prototype.isStorageFull = function() {
   var sum =  this.getStorageSum();
   return sum === 0 ? false : sum >= this.typeInfo.maxStorage;
}

Building.prototype.hasNeed = function() {
   var hasNeed = true;
   if (['maintenance', 'authority', 'storage', 'teleport'].indexOf(this.type) > -1) {
      hasNeed = this.type === 'maintenance' && this.dome.hasRepairNeed() === true ||
                  this.type === 'authority' && this.dome.hasIncidentNeed() === true  ||
                  this.type === 'storage' && this.dome.hasStorageTodo() === true && this.isStorageFull() === false ||
                  this.type === 'teleport' && this.isStorageFull() === false && this.extraTypeInfo.importResource && this.dome.testForResource(this.extraTypeInfo.importResource, 1) > 0;
   }
   return hasNeed;
}

Building.prototype.isFunctional = function() {
   var requiredResourceAmount = this.typeInfo.input === undefined
                                 || this.typeInfo.input.perWorker * (this.workers.length + this.incomingWorkers.length + 1);

   var hasMaintenanceStone = this.type !== 'maintenance' || this.dome.testForResource('stone', 1);
   return hasMaintenanceStone && this.damage < 1 && this.hasEnergy === true && this.incident == null
         && (this.typeInfo.output === undefined || this.outputStorage < this.typeInfo.output.max)
         && (this.typeInfo.input === undefined ||
               this.dome.testForResource(this.typeInfo.input.resource, requiredResourceAmount) > 0
            );
}

Building.prototype.getAverageHappiness = function() {
   var sum = this.workers.reduce(function(prev, cur) {
      return prev + cur.happiness;
   }, 0);
   return (sum / this.workers.length) || 0;
};

Building.prototype.getAverageFullness = function() {
   var sum = this.workers.reduce(function(prev, cur) {
      return prev + cur.fullness;
   }, 0);
   return (sum / this.workers.length) || 0;
}

Building.prototype.untilUpdateFactor = function() {
   if (this.updateDelta === undefined) {
      return -1;
   }
   if (this.isFunctional() === false) {
      return -1;
   }
   if (this.workers.length <= 0) {
      return -1;
   }
   return (this.updateDelta / this.typeInfo.updateDelta);
}


Building.prototype.update = function(msDuration) {
   if (this.repairCooldown > 0) {
      this.repairCooldown -= msDuration;
   }
   if (this.typeInfo.constantDamage) {
      this.damage += (msDuration/1000) * this.typeInfo.constantDamage;
   }
   if (this.incident) {
      this.damage += (msDuration/1000) * this.incident.damage;
   }
   if (this.updateDelta === undefined || this.workers.length <= 0) {
      this.updateDelta = this.typeInfo.updateDelta;
      return;
   }
   this.updateDelta -= msDuration;
   if (this.updateDelta <= 0) {
      this.updateDelta = this.typeInfo.updateDelta;
      var updateFn = 'step' + this.typeInfo.update.substring(0,1).toUpperCase() + this.typeInfo.update.substring(1);
      if (this.workers.length > 0 && this.isFunctional() && typeof(this[updateFn]) === 'function') {
         gamejs.logging.log('Building update: ', updateFn);
         var result = this[updateFn]();
         gamejs.logging.log('Update result:', result);
         if (result && result.amount !== 0) {
            this.spawnResultPopup(result);
         }
      }
   }
}

Building.prototype.getPopupPos = function() {
   return $v.add(this.pixelPosition, [-50 + this.width/2 + Math.random() * 100, -20 + Math.random() * 40]);
}
/**
 * display building update result
 */
Building.prototype.spawnResultPopup = function(result) {
   var displayAmount = '';
   displayAmount = result.amount.toFixed(0);
   var plusMinus = result.amount > 0 ? '+' : '';
   var postfix = result.amount > 0 ? 'produced' : 'used';
   if (result.amount < 1 && result.amount > -1) {
      displayAmount = 'some';
   }
   spawnPopup(plusMinus + displayAmount + ' ' + resourceToDisplay[result.resource] + ' ' + postfix, this.getPopupPos(), result.amount < 0);
}

Building.prototype.maxWorkers = function() {
   var numRequiredHouses = this.typeInfo.perWorkerBuilding === undefined ? Infinity :
      this.buildings.filter(function(b) {
         return b.type === this.typeInfo.perWorkerBuilding
      }, this).length;
   return Math.min(this.userMaxWorkers, Math.min(numRequiredHouses, this.typeInfo.maxWorkers));
}

Building.prototype.stepGather = function() {
   var numWorkers = Math.min(this.maxWorkers(), this.workers.length);
   var productivity = this.getProductivity();
   var out = Math.ceil(this.typeInfo.output.perWorker * numWorkers * productivity);

   this.workers.forEach(function(w) {
      w.fullness += this.typeInfo.workerFullness;
      w.happiness += this.typeInfo.workerHappiness;
   }, this);
   if (out > 0 && this.typeInfo.updateDamage) {
      this.damage += this.typeInfo.updateDamage * (this.workers.length /this.typeInfo.maxWorkers);
   }
   this.outputStorage += out;
   this.dome.stats.change({
      resource: this.typeInfo.output.resource,
      amount: out
   });
   return {
      resource: this.typeInfo.output.resource,
      amount: out
   };
};

Building.prototype.stepTeleport = function() {
   this.workers.forEach(function(w) {
      if (w.jobState == null) {
         w.setJobState('fetch');
         w.jobState.storageType = this.extraTypeInfo.exportResource; 
         w.jobState.originBuilding = this;
      }
   }, this);
}

Building.prototype.outputStorageFactor = function() {
   if (this.typeInfo.output && this.typeInfo.output.max) {
      return this.outputStorage / this.typeInfo.output.max;
   }
   return -1;
}

Building.prototype.stepDamage = function() {
   this.damage += this.typeInfo.updateDamage;
}

Building.prototype.stepStorage = function() {
   this.workers.forEach(function(w) {
      if (w.jobState == null) {
         w.setJobState('fetch');
         w.jobState.originBuilding = this;
      }
   }, this);
}

Building.prototype.getProductivity = function() {
   if (this.typeInfo.update === 'gather') {
      return (0.5 + (0.25 * this.getAverageFullness()) + (0.25 * this.getAverageHappiness()))
                        * (1 - this.damage)
                        * ( (this.dome.getOxygenSaturation() * 0.5) + 0.5);
   } else if (this.typeInfo.update === 'produce') {
      return (0.5 + (0.25 * this.getAverageFullness()) + (0.25 * this.getAverageHappiness()))
            * (1 - this.damage)
            * ( (this.dome.getOxygenSaturation() * 0.5) + 0.5);
   }
   // should not happen
   return -1;
}

Building.prototype.stepProduce = function() {
   var numWorkers = this.workers.length;
   var productivity = this.getProductivity();

   var maxIn = productivity * numWorkers * this.typeInfo.input.perWorker;
   var actualIn = this.dome.getResource(this.typeInfo.input.resource, maxIn);
   var inOutFactor = (actualIn / maxIn) || 0;

   this.workers.forEach(function(w) {
      // only factory
      w.fullness += this.typeInfo.workerFullness;
      w.happiness += this.typeInfo.workerHappiness;
   }, this)

   var out = Math.ceil(inOutFactor * productivity * numWorkers * this.typeInfo.output.perWorker);
   this.outputStorage += out;
   this.dome.stats.change({
      resource: this.typeInfo.output.resource,
      amount: out
   });
   if (out > 0 && this.typeInfo.updateDamage) {
      this.damage += this.typeInfo.updateDamage * (this.workers.length /this.typeInfo.maxWorkers);
   }
   return {
      resource: this.typeInfo.output.resource,
      amount: out
   };
}

Building.prototype.stepEat = function() {
   var hungryNumWorkers = this.workers.filter(function(w) {
      return w.fullness < 1.0;
   }).length;
   var maxIn = hungryNumWorkers * this.typeInfo.input.perWorker;
   var actualIn = this.dome.getResource(this.typeInfo.input.resource, maxIn);

   if (actualIn > 0 && this.typeInfo.updateDamage) {
      this.damage += this.typeInfo.updateDamage * (this.workers.length /this.typeInfo.maxWorkers)
   }

   var hungryCount = Math.round((maxIn - actualIn) / this.typeInfo.input.perWorker);
   var sum = 0;
   this.workers.forEach(function(u, idx) {
      if (idx >= hungryCount) {
         var origFullness = u.fullness;
         u.fullness += this.typeInfo.addFullness;
         if (origFullness < u.fullness) {
            spawnPopup("Eating", this.getPopupPos(), '#00ffff');
         }
      } else {
         u.happiness -= 0.1;
      }
   }, this);
   return 0;
};

Building.prototype.stepRepair = function() {
   this.workers.forEach(function(w) {
      if (w.jobState && w.jobState.routeFinished && w.jobState.building.damage > 0) {
         var max = Math.min(0.5, w.jobState.building.damage) * 2;
         var minus = this.dome.getResource('stone', max)
         if (minus > 0) {
            w.jobState.building.damage -= minus;
            w.jobState.building.repairCooldown = w.jobState.building.maxRepairCooldown;
            if (w.jobState.building.damage <= 0.1) {
               minus += w.jobState.building.damage;
               w.jobState.building.damage = 0;
            }
            sounds.play('repair', this.pixelPosition);
            spawnPopup( (+minus * 100).toFixed(0) + '% repaired', w.pixelPosition, '#00ffff');
            w.fullness += this.typeInfo.workerFullness;
            w.hapiness += this.typeInfo.workerHappiness;
         }
      } else if (w.jobState == null) {
         if (this.dome.hasRepairNeed() && w.dayState.resolveTimeRemaining > 0) {
            w.setJobState('repair');
         } else {
            w.setJobState('gohomemaintenance');
         }
      }
   }, this);
}

Building.prototype.stepIncident = function() {
   this.workers.forEach(function(w) {
      if (w.jobState && w.jobState.routeFinished && w.jobState.building.incident) {
         w.jobState.building.incident.health -= 0.2;
         w.fullness += this.typeInfo.workerFullness;
         w.hapiness += this.typeInfo.workerHappiness;
         spawnPopup("Authority applied", this.getPopupPos(), '#00ffff');
         sounds.play('authority-attack', this.pixelPosition);
      } else if (w.jobState == null) {
         if (this.dome.hasIncidentNeed() && w.dayState.resolveTimeRemaining > 0) {
            w.setJobState('incident');
         } else {
            w.setJobState('gohomeauthority');
         }
      }
   }, this);
}

Building.prototype.stepRelax = function() {
   var productivity = (1 - this.damage);
   var out = this.typeInfo.improveHappiness * productivity;
   if (out > 0) {
      var actualIn = Infinity;
      if (this.typeInfo.input) {
         var maxIn = this.workers.length * this.typeInfo.input.perWorker;
         actualIn = this.dome.getResource(this.typeInfo.input.resource, maxIn);
      }
      if (this.typeInfo.updateDamage) {
         this.damage += this.typeInfo.updateDamage * (this.workers.length /this.typeInfo.maxWorkers);
      }
      this.workers.forEach(function(u) {
         if (actualIn > 0) {
            if (actualIn !== Infinity) {
               actualIn -= this.typeInfo.input.perWorker;
            }
            var origHappiness = u.happiness;
            u.happiness += out;
            if (origHappiness < u.happiness) {
               spawnPopup("Relaxing", this.getPopupPos(), '#00ffff');
            }
         }
      }, this);
   }
   return;
};

Building.getPreloadAssets = function() {
   return Object.keys(Building.TYPES).map(function(buildingType) {
      return './images/' + buildingType + '.png';
   })
}

var resourceToDisplay = Building.resourceToDisplay = {
   money: 'metal',
   nutrition: 'nutrition',
   stone: 'stone',
   ore: 'iron ore',
   money: 'iron',
   drugs: 'concentrated nutrition'
}

Building.PRECONDITIONS = {
  oxygen: null,
     storage: 'oxygen',
     living: 'oxygen',
         cantine: 'living',
         farm: 'living',
             farmarea: 'farm',
         mine: 'living',
             mineshaft: 'mine',
         maintenance: 'living',
     solar: 'oxygen',
         elevator: 'solar',
         teleport: 'solar',
         oremine: 'solar',
         quarter: 'solar',
             authority: 'quarter',
             factory: 'quarter',
             kitchen: 'quarter',
             bar: 'quarter'
};

Building.TABS = {
  service: [
      'maintenance',
      'storage',
      'solar',
      'oxygen',
      'authority',
      'construction',
      'elevator',
      'teleport'
  ],
  industry: [
      'farm',
      'farmarea',
      'mine',
      'mineshaft',
      'oremine',
      'kitchen',
      'factory'
  ],
  citizens: [
      'living',
      'quarter',
      'cantine',
      'bar'
  ]
}

Building.TYPES = {
   'elevator': {
      width: 4,
      height: 4,
      energyNeed: 0,
      constantDamage: 0,
      stone: 30,
      maxWorkers: 3,
      cost: 20,
      display: 'Elevator',
      description: 'Down and up from the old cities underground.'
   },
   'storage': {
      width: 7,
      height: 7,
      update: 'storage',
      updateDelta: 5 *1000,
      constantDamage: 1/8000,
      workerFullness: 0, // handled by Unit.moveFullness
      workerHappiness: -0.001,
      maxWorkers: 2,
      energyNeed: 0,
      display: 'Storage',
      stone: 10,
      cost: 0,
      maxStorage: 20*8,
      description: "Carrierbots collect resources from production buildings."
   },
   'living': {
      width: 5,
      height: 5,
      update: 'relax',
      updateDelta: 2.5 *1000,
      updateDamage: 2/5000,
      improveHappiness: 0.1,
      maxWorkers: 3,
      energyNeed: 0,
      display: 'Habitat',
      stone: 5,
      cost: 0,
      description: "Open living places will be filled as long as the average fullness is greater than 80%."
   },
   'quarter': {
      width: 6,
      height: 6,
      update: 'relax',
      updateDelta: 2.5 *1000,
      updateDamage: 0.002,
      improveHappiness: 0.1,
      maxWorkers: 3,
      energyNeed: 0.1,
      display: 'Luxury Quarters',
      stone: 15,
      cost: 0,
      description: 'For mighty colonists only. Open living places will be filled as long as the average fullness is greater than 80%.'
   },
   /** GATHER **/
   'mine': {
      width: 7,
      height: 7,
      update: 'gather',
      updateDelta: 10 * 1000,
      updateDamage: 0.01,
      maxWorkers: 2,
      perWorkerBuilding: 'mineshaft',
      perWorkerBuildingMaxRadius: 20,
      workerHappiness: -0.01,
      workerFullness: -0.01,
      output: {
         resource: 'stone',
         perWorker: 0.5,
         max: 15
      },
      energyNeed: 0,
      display: 'Stone processing',
      stone: 5,
      cost: 0,
      description: "Processes stone debris into stone blocks for construction."
   },
   'oremine': {
      width: 6,
      height: 6,
      planetProperty: 'isOreMineable',
      update: 'gather',
      updateDelta: 4 * 1000,
      updateDamage: 0.01,
      maxWorkers: 2,
      workerHappiness: -0.01,
      workerFullness: -0.01,
      output: {
         resource: 'ore',
         perWorker: 0.5,
         max: 15
      },
      energyNeed: 0.4,
      display: 'Ice drilling',
      stone: 20,
      cost: 0,
      description: 'Extracts iron ore by piercing deep into the ice.'
   },
   'farm': {
      width: 7,
      height: 7,
      update: 'gather',
      updateDelta: 10 * 1000,
      maxWorkers: 2,
      updateDamage: 0.01,
      perWorkerBuilding: 'farmarea',
      perWorkerBuildingMaxRadius: 20,
      workerHappiness: -0.004,
      workerFullness: -0.006,
      output: {
         resource: 'nutrition',
         perWorker: 1,
         max: 15
      },
      energyNeed: 0,
      display: 'Food processing',
      stone: 3,
      cost: 0,
      description: "Processes nutrition into concentrated nutrition for the Mighty."
   },
   /** PER WORKER **/
   'mineshaft': {
      width: 4,
      height: 4,
      isWorkerBuilding: true,
      planetProperty: 'isMineable',
      energyNeed: 0,
      display: 'Stone collector',
      stone: 4,
      cost: 0,
      description: 'Supplies raw stone debris to a stone processing building.'
   },
   'farmarea': {
      width: 4,
      height: 4,
      isWorkerBuilding: true,
      planetProperty: 'isFarmable',
      energyNeed: 0,
      display: 'Greenhouse',
      stone: 2,
      cost: 0,
      description: 'Supplies nutritional resources to a food processing building.'
   },
   /** PRODUCTION **/
   'factory': {
      width: 6,
      height: 6,
      update: 'produce',
      updateDelta: 20 * 1000,
      updateDamage: 0.15,
      maxWorkers: 3,
      workerHappiness: -0.025,
      workerFullness: -0.02,
      input: {
         resource: 'ore',
         perWorker: 2
      },
      output: {
         resource: 'money',
         max: 20,
         perWorker: 1
      },
      energyNeed: 0.5,
      display: 'Metal foundry',
      stone: 8,
      cost: 8,
      description: 'Processes iron ore into metal for constrution. Only the mighty know how to operate a foundry.'
   },
   'kitchen': {
      width: 10,
      height: 10,
      update: 'produce',
      updateDelta: 15 * 1000,
      updateDamage: 0.15,
      maxWorkers: 3,
      workerHappiness: -0.025,
      workerFullness: -0.02,
      input: {
         resource: 'nutrition',
         perWorker: 2
      },
      output: {
         resource: 'drugs',
         max: 20,
         perWorker: 1
      },
      energyNeed: 0.5,
      display: 'Cooking Area',
      stone: 5,
      cost: 8,
      description: 'Nutrition is turned into addictively delicious concentrated nutrition for the mighty.'
   },
   'cantine': {
      width: 7,
      height: 7,
      update: 'eat',
      updateDelta: 3 * 1000,
      maxWorkers: 4,
      addFullness: 0.1,
      input: {
         resource: 'nutrition',
         perWorker: 1
      },
      energyNeed: 0,
      display: 'Cantine',
      stone: 3,
      cost: 0,
      description: 'Delivers food to hungry colonists.'
   },
   'bar': {
      width: 8,
      height: 8,
      update: 'relax',
      updateDelta: 3 * 1000,
      maxWorkers: 4,
      energyNeed: 0.2,
      improveHappiness: 0.5,
      input: {
         resource: 'drugs',
         perWorker: 0.1
      },
      display: 'High Culture',
      stone: 1,
      cost: 3,
      description: 'The mighty recreationally consume concentrated nutrition in these establishments.'
   },
   'maintenance': {
      width: 7,
      height: 7,
      maxWorkers: 2,
      energyNeed: 0,
      update: 'repair',
      updateDelta: 3 * 1000,
      display: 'Repair service',
      cost: 0,
      stone: 5,
      workerFullness: -0.01,
      workerHappiness: -0.01,
      description: 'Repairbots remove damage from any building.'
   },
   'authority': {
      width: 5,
      height: 5,
      maxWorkers: 1,
      energyNeed: 0.1,
      update: 'incident',
      updateDelta: 2 * 1000,
      display: 'Authority',
      workerFullness: -0.02,
      workerHappiness: -0.02,
      cost: 9,
      stone: 1,
      description: 'Defend the perimeter with mechs. Only mighty can operate mechs.'
   },
   'solar': {
      width: 3,
      height: 3,
      energyNeed: 0,
      constantDamage: 2/5000,
      display: 'Wind turbine',
      stone: 3,
      cost: 0,
      description: 'Produces energy used by advanced buildings.'
   },
   'oxygen': {
      width: 5,
      height: 5,
      energyNeed: 0,
      constantDamage: 1/3000,
      display: 'Oxygen recycler',
      stone: 3,
      cost: 0,
      description: 'The oxygen need rises with each new colonists and building.'
   },
   'teleport': {
      width: 4,
      height: 4,
      updateDelta: 3 *1000,
      update: 'teleport',
      energyNeed: 0.1,
      constantDamage: 1/3000,
      maxWorkers: 1,
      display: 'Teleport',
      maxStorage: 6*8,
      stone: 20,
      cost: 10,
      description: 'Trade resources with other domes (you obviously need one teleport in each dome to trade).'
   }
};
