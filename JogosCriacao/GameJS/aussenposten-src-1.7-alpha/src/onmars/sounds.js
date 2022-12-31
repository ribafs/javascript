var gamejs = require('gamejs');

exports.play = function(type, optionalPosition) {
    if (isMuted) {
        return;
    }
    var doPlay = true;
    if (optionalPosition !== undefined) {
        doPlay = planetView.inView(optionalPosition);
    };
    if (doPlay) {
        sounds[type].play();
    }
}

var isMuted = false;
exports.toggleMuted = function() {
    isMuted = !isMuted;
}

var types = {
    'gui-click': 'gui_sounds_effect_click',
    'construction': 'Construction',
    'enter-building': 'Door_Close',
    'exit-building': 'Door_Open',
    'pickup-storage': 'pick_cutlery_1',
    'drop-storage': 'drop_cutlery_1',
    'repair': 'repair_construction',
    'elevator': 'load',
    'incident-attack': 'impactwood14',
    'authority-attack': 'laser4',
    'incident-death': 'Death_6',
    'building-unplace': 'DeathFlash'
};
var sounds = [];
exports.getPreloadAssets = function() {
   return Object.keys(types).map(function(key) {
      var t = types[key];
      return './sounds/' + t + '.wav';
   });
}

var planetView = null;
exports.setPlanetView = function(pv) {
    planetView = pv;
}

exports.init = function() {
   Object.keys(types).forEach(function(key) {
      var t = types[key];
      sounds[key] = new gamejs.audio.Sound('./sounds/' + t + '.wav');
   });
   return;
}