var $v = require('gamejs/math/vectors');
var $o = require('gamejs/utils/objects');
var $r = require('gamejs/math/random');
var gamejs = require('gamejs');

var views = require('./views');

var Unit = exports.Unit = function(args) {
   this.pixelPosition = args.pixelPosition;
   this.dome = args.dome;
   this.unitType = args.unitType; // flying, ground
   this.name = args.name;
   this.idleCount = 0;

   this._happiness = 1;
   this._fullness = 1;
   this.jobState = null;
   this.dayState = null;
   // pathfinding sets it, animation in `views` reads it
   this.direction = null;
   Object.defineProperty(this, 'happiness', {
      get: function() {
         return this._happiness
      },
      set: function(val) {
         this._happiness = Math.max(0, Math.min(1, val));
      }
   });
   Object.defineProperty(this, 'fullness', {
      get: function() {
         return this._fullness
      },
      set: function(val) {
         this._fullness = Math.max(0, Math.min(1, val));
      }
   })
   this.pathfinding = {};
   this.sendHome = false;
   this.guid = Math.random() * 2020202 + (Math.random() * 20292843);
   this.setDayState('work');
   return this;
};

Unit.SERIALIZE_PROPS = ['guid', '_happiness', '_fullness', 'unitType',
   'dayState', 'jobState', 'pixelPosition', 'name', 'sendHome', 'elevatorDown', 'pathfinding', 'dome', 'direction', 'idleCount']
Unit.prototype.serialize = function() {
   var data = {};
   Unit.SERIALIZE_PROPS.forEach(function(prop) {
      data[prop] = this[prop];
   }, this);
   // store id
   data.dome = data.dome.guid;
   ['dayState', 'jobState'].forEach(function(prop) {
      if (data[prop] && data[prop].building) {
         data[prop].building = data[prop].building.guid;
      }
   }, this);
   // transport
   if (data.jobState && data.jobState.output && data.jobState.output.building) {
      data.jobState.output.building = data.jobState.output.building.guid;
   }
   // fetch
   if (data.jobState && data.jobState.originBuilding) {
      data.jobState.originBuilding = data.jobState.originBuilding.guid;
   }
   return data;
}

Unit.unserialize = function(u) {
   var unit = new Unit({
      pixelPosition: u.pixelPosition,
      dome: u.dome,
      unitType: u.unitType
   })
   Unit.SERIALIZE_PROPS.forEach(function(prop) {
      if (u[prop] !== undefined) {
         unit[prop] = u[prop];
      }
   }, this);
   return unit;
}

Unit.prototype.revive = function(domes, buildings) {
   this.dome = domes[this.dome];
   // revive
   ['dayState', 'jobState'].forEach(function(prop) {
      if (this[prop] && this[prop].building) {
         this[prop].building = buildings[this[prop].building]
      }
   }, this);
   // transport
   if (this.jobState && this.jobState.output && this.jobState.output.building) {
      this.jobState.output.building = buildings[this.jobState.output.building];
   }
   if (this.jobState && this.jobState.originBuilding) {
      this.jobState.originBuilding = buildings[this.jobState.originBuilding];
   }
}

Unit.prototype.setDayState = function(type) {
   gamejs.logging.log('Unit set to daystate', this.guid, type);
   this.dayState = $o.merge({
      type: type,
      route: null,
      routeFinished: false,
      building: null,
      resolveTimeRemaining: Unit.STATES[this.unitType][type].resolveTime,
      hadJob: false,
      unitType: this.unitType
   }, Unit.STATES[this.unitType][type]);
   this.jobState = null;
   if (type === 'relax') {
      this.idleCount = 0;
   }
}

Unit.prototype.setJobState = function(type) {
   gamejs.logging.log('Unit set to jobstate', this.guid, type);
   this.jobState = {
      type: type,
      route: null,
      routeFinished: false,
      building: null,
      resolveTime: ['fetch', 'store'].indexOf(type) > -1 ? 2000 : 2000,
      resolveTimeRemaining: 2000
   };
}

Unit.prototype.isJobResolving = function() {
   return this.jobState && this.jobState.routeFinished === true;
}

Unit.prototype.isIdle = function() {
   return this.dayState.routeFinished == true && this.jobState === null;
}

Unit.prototype.update = function(msDuration) {
   this.updateDayState(msDuration);
   if (this.jobState !== null) {
      this.updateJobState(msDuration);
   };
}

Unit.prototype.updateDayState = function(msDuration) {
   // need route & building?
   if (this.dayState.route === null) {
      if (this.sendHome) {
         this.setDayState('gounderground');
      }
      gamejs.logging.log('No route for daystate', this.dayState, this.guid);
      var tilePosition = views.pixelToTile(this.pixelPosition);
      var routeInfo = this.dome.getDayStateRoute(tilePosition, this.dayState, this);
      if (routeInfo && routeInfo.building != null) {
         this.dayState.route = routeInfo.route;
         this.dayState.building = routeInfo.building;
         this.dayState.building.workerReserve(this);
      } else {
         // try switchting to idle (but only 3 times)
         if (this.dayState.type === 'work' && this.idleCount < 3) {
            this.setDayState('idle');
            this.idleCount++;
         } else {
            this.setDayState(this.dayState.nextState);
         }
      }
   }
   // wait for resolve
   this.dayState.resolveTimeRemaining -= msDuration;

   if (this.dayState.route && this.dayState.routeFinished == false) {
      // move to
      this.dayState.routeFinished = this.updatePathfinding(msDuration, 'dayState');
      if (this.dayState.routeFinished == true) {
         this.dayState.building.workerEnter(this);
      }
      if (this.dayState.type === 'idle' && this.dayState.resolveTimeRemaining < 0) {
         this.dayState.routeFinished = true;
         this.dayState.building.workerEnter(this);
      }
   } else if (this.dayState.routeFinished == true) {
      // reoslve faster if not workable
      if (this.dayState.resolveTimeRemaining > 0 && this.dayState.building.isFunctional() === false) {
         this.dayState.resolveTimeRemaining -= (msDuration * 3);
      }
      // go away once full
      if (this.dayState.type === 'eat' && this.fullness >= 0.99 && this.dayState.resolveTimeRemaining > 5 * 1000) {
         this.dayState.resolveTimeRemaining = 5 * 1000;
      }
      if ( (this.dayState.type === 'idle')
            || (this.dayState.building.isFunctional() == false || this.dayState.resolveTimeRemaining <= 0)) {
         if (this.jobState && ["gounderground", 'gohomeauthority', 'gohomemaintenance', 'store'].indexOf(this.jobState.type) > -1) {
            // cancel cancelling if we are returning something or going home
            return;
         }
         if (this.jobState && this.jobState.building) {
            this.jobState.building.missionCancel(this);
         }
         this.dayState.building.workerExit(this);
         // move on
         gamejs.logging.log("Daystate advancing to", this.dayState.nextState, this.guid)
         this.setDayState(this.dayState.nextState);
      }
   }
};

Unit.prototype.updateJobState = function(msDuration) {
   // need route & building?
   if (this.jobState.route === null) {
      gamejs.logging.log('No route for jobState', this.jobState, this.guid);
      var tilePosition = views.pixelToTile(this.pixelPosition);
      var routeInfo = this.dome.getJobStateRoute(tilePosition, this.jobState);
      if (routeInfo !== null) {
         this.dayState.hadJob = true;
         this.jobState.route = routeInfo.route;
         this.jobState.building = routeInfo.building;
         this.jobState.building.missionReserve(this);
      } else {
         this.jobState = null;
         return;
      }
   }
   if (this.jobState.route && this.jobState.routeFinished == false) {
      // move to
      this.jobState.routeFinished = this.updatePathfinding(msDuration, 'jobState');
      if (this.jobState.type === 'incident') {
         var dist = $v.distance(this.pixelPosition, this.jobState.building.centerPixelPosition);
         if (dist < 80) {
            this.jobState.routeFinished = true;
            this.direction = null;
         }
      }
      if (this.jobState.routeFinished == true) {
         this.jobState.building.missionEnter(this);
      }
   } else {
      // wait for resolve
      this.jobState.resolveTimeRemaining -= msDuration;
      if (this.jobState.resolveTimeRemaining <= 0) {
         if (this.jobState.type === 'repair' && this.jobState.building.damage > 0.01 ||
               (this.jobState.type === 'incident' && this.jobState.building.incident && this.jobState.building.incident.health > 0)) {
            this.jobState.resolveTimeRemaining = this.jobState.resolveTime
         } else {
            // move on
            this.jobState.building.missionExit(this);
         }
      }
   }
};

Unit.speedPerSec = 23;
Unit.fullnessMove = -0.002; // per sec
Unit.prototype.updatePathfinding = function(msDuration, state) {
   this.fullness += (Unit.fullnessMove * (msDuration/1000));
   if (this.pathfinding.current === undefined || $v.distance(this.pixelPosition, this.pathfinding.current) < 10) {
      this.pathfinding.current = this[state].route.shift();
      if (this.pathfinding.current === undefined) {
         this.direction = null;
         return true;
      }
      this.pathfinding.current = $v.add(this.pathfinding.current, $r.vector([-10, -10], [10, 10]));
      //gamejs.logging.log('Pathfinding switch to point', this.pathfinding.current, 'current:', this.pixelPosition)
   } else {
      var direction = this.direction = $v.unit($v.subtract(this.pathfinding.current, this.pixelPosition));
      this.pixelPosition = $v.add(this.pixelPosition, $v.multiply(direction, Unit.speedPerSec * (msDuration/1000)));
   }
   return false;
}

Unit.STATES = {};
Unit.STATES.helot = {
   eat: {
      resolveTime: 30 * 1000,
      nextState: 'relax',
      buildings: ['cantine']
   },
   relax: {
      resolveTime: 30 * 1000,
      nextState: 'work',
      buildings: ['living'],
   },
   work: {
      resolveTime: 90 * 1000,
      nextState: 'eat',
      buildings: ['farm', 'mine', 'maintenance', 'storage', 'oremine', 'teleport']
   },
   idle: {
      resolveTime: 10 * 1000,
      nextState: 'work',
      buildings: ['farmarea', 'mineshaft', 'oxygen', 'solar', 'teleport']
   },
   gounderground: {
      resolveTime: 500 * 1000,
      nextState: null,
      buildings: ['elevator']
   }
}

Unit.STATES.mighty = {
   eat: {
      resolveTime: 30 * 1000,
      nextState: 'oppulence',
      buildings: ['cantine']
   },
   oppulence: {
      resolveTime: 30 * 1000,
      nextState: 'relax',
      buildings: ['bar'],
   },
   relax: {
      resolveTime: 30 * 1000,
      nextState: 'work',
      buildings: ['quarter'],
   },
   work: {
      resolveTime: 60 * 1000,
      nextState: 'eat',
      buildings: ['factory', 'authority', 'kitchen']
   },
   idle: {
      resolveTime: 10 * 1000,
      nextState: 'work',
      buildings: ['farmarea', 'mineshaft', 'oxygen', 'solar', 'teleport']
   },
   gounderground: {
      resolveTime: 500 * 1000,
      nextState: null,
      buildings: ['elevator']
   }
}