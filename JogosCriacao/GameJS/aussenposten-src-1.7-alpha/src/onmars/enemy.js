var $v = require('gamejs/math/vectors');
var $r = require('gamejs/math/random');
var $o = require('gamejs/utils/objects');
var gamejs = require('gamejs');
var sounds = require('./sounds');
var Unit = require('./unit').Unit;

var views = require('./views');

var Enemy = exports.Enemy = function(args) {
   this.pixelPosition = args.pixelPosition;
   this.unitType = args.unitType; // flying, ground
   this.planet = args.planet;
   this.dayState = null;

   this.health = 1;

   // pathfinding sets it, animation in `views` reads it
   this.direction = null;
   this.pathfinding = {};
   this.damage = 0.01;
   this.guid = Math.random() * 2020202 + (Math.random() * 20292843);
   this.setDayState('random');
   return this;
};

Enemy.SERIALIZE_PROPS = ['guid', '_happiness', '_fullness', 'unitType',
   'dayState', 'jobState', 'pixelPosition', 'pathfinding', 'health']
Enemy.prototype.serialize = function() {
   var data = {};
   Enemy.SERIALIZE_PROPS.forEach(function(prop) {
      data[prop] = this[prop];
   }, this);
   ['dayState', 'jobState'].forEach(function(prop) {
      if (data[prop] && data[prop].building) {
         data[prop].building = data[prop].building.guid;
      }
   }, this);
   return data;
}

Enemy.unserialize = function(u) {
   var unit = new Enemy({
      pixelPosition: u.pixelPosition,
      planet: u.planet,
      unitType: u.unitType
   })
   Enemy.SERIALIZE_PROPS.forEach(function(prop) {
      unit[prop] = u[prop];
   }, this);
   return unit;
}

Enemy.prototype.revive = function(planet, buildings) {
   this.planet = planet;
   // revive
   ['dayState', 'jobState'].forEach(function(prop) {
      if (this[prop] && this[prop].building) {
         this[prop].building = buildings[this[prop].building]
      }
   }, this);
}
Enemy.prototype.setDayState = function(type) {
   gamejs.logging.log('Enemy set to state', this.guid, type);
   this.dayState = $o.merge({
      type: type,
      unitType: this.unitType,
      route: null,
      routeFinished: false,
      duration: Enemy.STATES[type].duration
   }, Enemy.STATES[type]);
   this.jobState = null;
}

Enemy.prototype.update = function(msDuration) {
   this.updateDayState(msDuration);
}

var maxIncidentSoundDely = 2000;
var incidentSoundDelay = maxIncidentSoundDely;

Enemy.prototype.updateDayState = function(msDuration) {
   // need route & building?
   if (this.dayState.route === null) {
      var tilePosition = views.pixelToTile(this.pixelPosition);
      var routeInfo = this.planet.getEnemyDayStateRoute(tilePosition, this.dayState);
      if (routeInfo !== null && routeInfo.route) {
         this.dayState.route = routeInfo.route;
         this.dayState.building = routeInfo.building;
         if (this.dayState.type === 'attack') {
            this.dayState.building.incidentReserve(this);
         }
      } else {
         this.setDayState('random');
         routeInfo = this.planet.getEnemyDayStateRoute(tilePosition, this.dayState);
         if (routeInfo == null) {
            throw new Error('no daystate route to random');
         }
         this.dayState.route = routeInfo.route;
      }
   }
   this.dayState.duration -= msDuration;
   if (this.dayState.route && this.dayState.routeFinished == false) {
      // continue moving
      this.dayState.routeFinished = this.updatePathfinding(msDuration, 'dayState');
   } else if (this.dayState.routeFinished === true) {
      if (this.dayState.type === 'attack' && this.dayState.building.incident == null) {
         this.dayState.building.incidentEnter(this);
      }

      // arrived at location
      if (this.dayState.duration >= 0) {
         // if random: new route
         if (this.dayState.type === 'random') {
            this.dayState.routeFinished = false;
            this.dayState.route = null;
         } else if (this.dayState.type === 'attack') {
            // keep attacking, stay here
            // maybe play sound
            incidentSoundDelay -= msDuration;
            if (incidentSoundDelay <= 0) {
               sounds.play('incident-attack', this.pixelPosition);
               incidentSoundDelay = maxIncidentSoundDely;
               spawnNegativePopup('Building under attack!', this.pixelPosition)
            }
         }
      } else {
         // move to next state
         if (this.dayState.type === 'random') {
            if (Math.random() < 0.1) {
               this.setDayState('attack');
            } else {
               this.setDayState('gohome');
            }
         } else if (this.dayState.type === 'attack') {
            this.dayState.building.incidentExit(this);
            this.setDayState('gohome');
         } else if (this.dayState.type === 'gohome') {
            this.health = 0;
         }
      }
   }
};

Enemy.speedPerSec = 23;
Enemy.prototype.updatePathfinding = function(msDuration, state) {
   if (this.pathfinding.current === undefined || $v.distance(this.pixelPosition, this.pathfinding.current) < 10) {
      this.pathfinding.current = this[state].route.shift();
      if (this.pathfinding.current === undefined) {
         this.direction = null;
         return true;
      }
      this.pathfinding.current = $v.add(this.pathfinding.current, $r.vector([-5, -5], [5,5]));
      //gamejs.logging.log('Pathfinding switch to point', this.pathfinding.current, 'current:', this.pixelPosition)
   } else {
      var direction = this.direction = $v.unit($v.subtract(this.pathfinding.current, this.pixelPosition));
      this.pixelPosition = $v.add(this.pixelPosition, $v.multiply(direction, Enemy.speedPerSec * (msDuration/1000)));
   }
   return false;
}

Enemy.STATES = {
   // 50% chance attack or gohome
   random: {
      duration: 15 * 1000,
   },
   attack: {
      duration: 60 * 1000,
   },
   gohome: {
      duration: 0
   }
}