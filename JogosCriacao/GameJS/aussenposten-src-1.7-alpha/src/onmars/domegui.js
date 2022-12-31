var Building = require('./building').Building;

exports.DomeGui = function(planetView) {

    this.dome = null;

    var self = this;
    var stats = {
       population: {
          current: function() {
            return self.dome.units.length;
          },
          max: function() {
              var places = 0;
              ['living', 'quarter'].forEach(function(type) {
                  places += self.dome.getFunctionalBuildings(type).length * Building.TYPES[type].maxWorkers;
              });
              return places;
          }
       },
       happiness: {
            current: function() {
                return self.dome.getAverageHappiness() * 100 || 0;
            }
       },
       fullness: {
            current: function() {
                return self.dome.getAverageFullness() * 100  || 0;
            }
       },
       oxygen: {
            current: function() {
               return self.dome.getOxygenSaturation() * 100 || 0;
            }
       },
       energy: {
         current: function() {
            return self.dome.getEnergySaturation() * 100 || 0;
         }
       }
    };

    this.updateDomeStatistics = function() {
      var dome = this.dome = planetView.getDomeInView();

      if (dome === null) {
        return;
      }

      var money = this.dome.testTotalResource('money', Infinity);
      var $money = document.getElementById('dome-money');
      $money.textContent = Math.floor(money);

      var stone = this.dome.testTotalResource('stone', Infinity);
      var $stone = document.getElementById('dome-stone');
      $stone.textContent = Math.floor(stone);

      Object.keys(stats).forEach(function(key) {
         var stat = stats[key];
         var $li = document.getElementById('domestatus').getElementsByClassName(key)[0];
         var $current = $li.getElementsByClassName('current')[0];
         var current = stat.current().toFixed(0);
         if (key === 'energy' && (stat.current() === 0 || stat.current() === Infinity)) {
          $current.textContent = '-';
         } else {
          $current.textContent = current;
         }
         var $progress = $li.getElementsByTagName('progress')[0];
         var klass = null;
         if (key === 'population') {
            current = (current / stat.max()) * 100 || 0;
         } else if (current < 60) {
            klass = "low"
         } else if (current < 30) {
            klass = 'verylow'
         }
         $progress.classList.remove('low');
         $progress.classList.remove('verylow');
         if (klass) {
            $progress.classList.add(klass);
         }
         $progress.value = (current == Infinity) ? 0 : current;
         if (typeof(stat.max) === 'function') {
            var $max = $li.getElementsByClassName('max')[0];
            $max.textContent = stat.max();
         }
      })
    }

    var timeout = 800;
    var lastCheck = 0;
    this.update = function(msDuration) {
        if (Date.now() - lastCheck > timeout) {
            lastCheck = Date.now();
            this.updateDomeStatistics();
        }
    }


    var $buildMenu = document.getElementById('domestatus');
    var buildings = $buildMenu.getElementsByClassName('building');
    for (var i = 0; i < buildings.length; i++) {
        buildings[i].addEventListener('click', toggleClick);
    }
    return this;
}