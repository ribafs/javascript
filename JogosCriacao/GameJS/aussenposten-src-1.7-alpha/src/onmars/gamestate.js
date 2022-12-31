var gamejs = require('gamejs');

var Building = require('./building').Building;
var Dome = require('./dome').Dome;
var Enemy = require('./enemy').Enemy;
var Unit = require('./unit').Unit;
var Planet = require('./planet').Planet;
var PlanetView = require('./views').PlanetView;
var DomeGui = require('./domegui').DomeGui;
var BuildingGui = require('./buildinggui').BuildingGui;
var UnitGui = require('./unitgui').UnitGui;
var BuildMenu = require("./buildmenu").BuildMenu;
var GameMenu = require("./gamemenu").GameMenu;
var StatsGui = require('./statsgui').StatsGui;

exports.GameState = function() {

   var planet, planetView, buildMenu, domeGui, buildingGui,
      unitGui, gameMenu, display, statsGui;

   var isRunning = true;

   this.pause = function() {
      isRunning = false;
   }

   this.start = function() {
      display = gamejs.display.getSurface();

      gamejs.event.onMouseMotion(buildMenu.onMouseMove, buildMenu);
      gamejs.event.onMouseUp(function(event) {
         if (gameMenu.active || statsGui.active) {
            return;
         }
         buildMenu.onMouseUp(event);
         buildingGui.onMouseUp(event);
         unitGui.onMouseUp(event);
      });

      gamejs.event.onKeyUp(function(event) {
         gameMenu.onKeyUp(event);
         if (gameMenu.active || statsGui.active) {
            return;
         }
         buildMenu.onKeyUp(event);
      })
      gamejs.event.onEvent(function(event) {
         if (gameMenu.active || statsGui.active) {
            return;
         }
         planetView.onEvent(event);
      });

      require('./sounds').setPlanetView(planetView);

      // @@@ DEBUG speedup
      var speedUp = 1;

      var lastIntervalGui = null;
      setInterval(function() {
         var now = Date.now();
         var msDuration = 10;
         if (lastIntervalGui !== null) {
            msDuration = now - lastIntervalGui;
         }
         lastIntervalGui = Date.now();

         domeGui.update(msDuration);
         buildingGui.update(msDuration);
         unitGui.update(msDuration);
         buildMenu.update(msDuration);
      }, 500);

      var lastDrawInterval = null;
      setInterval(function() {
         var msDuration = 10;
         var now = Date.now();
         if (lastDrawInterval !== null) {
            msDuration = now - lastDrawInterval;
         }
         lastDrawInterval = now;
         if (msDuration < 500 && isRunning && gameMenu.active == false && statsGui.active == false) {
            msDuration *= speedUp;
            //display.clear();
            planet.update(msDuration);
            planetView.update(msDuration);

            planetView.draw(display);
            buildMenu.draw(display);
            buildingGui.draw(display);
            unitGui.draw(display);
         }
      }, 50);
   };


   this.load = function(planetTmx) {
      var state = null;
      if (localStorage.save) {
         state = JSON.parse(localStorage.save);
      }

      window.planet = planet = new Planet(planetTmx);

      if (state) {
         var enemies = {};
         planet.enemies = state.enemies.map(function(e) {
            enemies[e.guid] = Enemy.unserialize(e);
            return enemies[e.guid];
         });

         // unserialize
         var units = {};
         state.units.forEach(function(u) {
            units[u.guid] = Unit.unserialize(u);
         });
         var buildings = {};
         state.buildings.forEach(function(b) {
            buildings[b.guid] = Building.unserialize(b);
         });

         var domes = {};
         state.domes.forEach(function(d) {
            domes[d.guid] = Dome.unserialize(d);
         });

         // revive
         Object.keys(units).forEach(function(uid) {
            var u = units[uid];
            u.revive(domes, buildings);
         });
         Object.keys(enemies).forEach(function(eid) {
            var u = enemies[eid];
            u.revive(planet, buildings);
         });

         Object.keys(buildings).forEach(function(buid) {
            var b = buildings[buid];
            b.revive(domes, units, enemies, buildings)
         });
         Object.keys(domes).forEach(function(did) {
            var d = domes[did];
            d.revive(planet, units, buildings);
            planet.domes.push(d);
         });

      } else {
         var dome = new Dome({topleft: [10, 10], width: 80, planet: planet});
         planet.domes.push(dome);
         var elevator = new Building({dome: dome, type: 'elevator', topleft: [30, 25], rotation: 0});
         dome.place(elevator);
      }

      planetView = new PlanetView(planet);
      if (state) {
         planetView.viewRect.topleft = state.view.topleft;
      }

      buildMenu = new BuildMenu(planetView);
      domeGui = new DomeGui(planetView);
      statsGui = new StatsGui(domeGui);
      buildingGui = new BuildingGui(planetView);
      unitGui = new UnitGui(planetView);
      gameMenu = new GameMenu(this);
   }

   this.serialize = function() {
      var units = [];
      var enemies = [];
      var buildings = [];
      planet.enemies.forEach(function(e) {
         enemies.push(e.serialize())
      });
      planet.domes.forEach(function(d) {
         d.units.forEach(function(u) {
            units.push(u.serialize());
         });
         d.buildings.forEach(function(b) {
            buildings.push(b.serialize())
         })
      });
      return {
         planet: planet.serialize(),
         domes: planet.domes.map(function(d) { return d.serialize()}),
         units: units,
         enemies: enemies,
         buildings: buildings,
         view: {
            topleft: planetView.viewRect.topleft
         }
      }
   };

   this.save = function() {
      var state = this.serialize();
      // @@ store to fixed path according to tmx
      localStorage.save = JSON.stringify(state);
   }

   //** ugha **/
   window.spawnNegativePopup = function(text, pixelPos) {
      return spawnPopup(text, pixelPos, true);
   }

   window.spawnPopup = function(text, pixelPos, isNegative, color) {
      // switch last params if not enough and we got string
      if (typeof isNegative === 'string') {
         color = isNegative;
         isNegative = false;
      }
      pixelPos = planetView.canvasToAbsolute(pixelPos);
      var $div = document.createElement('div');
      $div.innerText = text;
      $div.style.left = pixelPos[0] + "px";
      $div.style.top = pixelPos[1] + "px";
      $div.style.color = color || "#ffff00";
      if (isNegative == false){
         if (color === undefined) {
            $div.style.color = "white";
         }
         $div.style.textShadow = "green 1px -1px";
      } else {
         $div.style.textShadow = "red 1px -1px";
      }
      $div.className = "popup";
      document.body.appendChild($div);
      var timeOutFn = (function($div) {
         return function() {
            $div.style.top = (pixelPos[1] - 25) + 'px'
            $div.style.color = "rgba(0,0,0,0)"
            $div.style.textShadow = "none";
            $div.addEventListener('transitionend', function(ev) {
               $div.parentNode && $div.parentNode.removeChild($div);
            })
         }
      })($div);
      setTimeout(timeOutFn, 1);
      //debugger;
   }


   return this;
}
