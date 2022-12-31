
var gamejs = require('gamejs');
var $v = require('gamejs/math/vectors');
var sounds = require('./onmars/sounds');
var Building = require('./onmars/building').Building;
var GameState = require('./onmars/gamestate').GameState;
var bodybuilder = require('./onmars/bodybuilder');
var views = require('./onmars/views');

/** preloading images & sounds **/
var assets = [];
assets = assets.concat(Building.getPreloadAssets())

assets = assets.concat(bodybuilder.getPreloadAssets());
assets = assets.concat(sounds.getPreloadAssets());
assets = assets.concat(views.getPreloadAssets());

try {
   gamejs.preload(assets);
} catch (e) {
   document.getElementById('gjs-loader-text').innerHTML = 'Sorry, something went wrong. You can try a reload. <br/>' + e;
}

gamejs.ready(function() {
   if (navigator.userAgent.toLowerCase().indexOf('chrome') == -1) {
      document.getElementById('gjs-loader-text').innerHTML = 'You can download the <a href="http://aussenposten.gamejs.org/download.html">mac/win standalone game</a>. <br/> <p style="font-size:small">Really sorry but the web version of Aussenposten only works with google chrome.</p>';
      return;
   }

   // @@ hacky
   require('./onmars/views').preload();
   sounds.init();
   require('./onmars/building').init();

   // disable logging
   gamejs.logging.log = function() {};
   disableMouseSelect();

   // click handler
   var $loader = document.getElementById('gjs-loader-custom');
   var $loaderText = document.getElementById('gjs-loader-text');
   $loader.classList.add('mainmenu');
   $loaderText.style.display = "none";
   document.getElementById('mainmenu-container').classList.add('visible');
   $loader.classList.add('active');
   var $gameContainer = document.getElementById('gamecontainer');

   var gameState = window.gameState = new GameState();

   window.showLoader = function() {
      $gameContainer.style.display = 'none';
      $loader.style.display = 'block';
      return;
   }

   var onLevelLoaded = function() {
      $loader.style.display = 'none';
      $gameContainer.style.display = 'block';
      setTimeout(function() {
         $gameContainer.classList.remove('hidden');
      }, 1);
      document.body.style.backgroundImage = "none";
      gameState.start();
   }

   var onLevelSelect = function(event) {
      $loaderText.style.display = "block";
      var selected = event.currentTarget;
      var planetTmx = './maps/' + selected.dataset.map;
      var $levelButtons = document.getElementsByClassName('level-button');
      for (var i = 0; i < $levelButtons.length; i++) {
         if (selected !== $levelButtons[i]) {
            $levelButtons[i].style.display = 'none';
         }
      }
      setTimeout(function() {
         gameState.load(planetTmx);
         onLevelLoaded();
      }, 100)
   }

   var onLevelDelete = function(event) {
      if (window.confirm('Delete save game?')) {
         localStorage.removeItem("save");
         document.location.reload();
      }
   }

   document.getElementById('level-select').style.display = 'block';
   var $levels = document.getElementsByClassName('level-title');
   for (var i = 0; i < $levels.length; i++) {
      $levels[i].addEventListener('mouseup', onLevelSelect, false);
   }
   if (localStorage.save) {
      // @@ need seperate save for each level and keep track which button clicked
      var $deleteSaveButtons = document.getElementsByClassName('level-save-delete');
      for (var i = 0; i < $deleteSaveButtons.length; i++) {
         $deleteSaveButtons[i].addEventListener('mouseup', onLevelDelete, false);
         $deleteSaveButtons[i].classList.remove('inactive');
      }
   }


});


// disable normal browser mouse select
function disableMouseSelect() {
   // no text select on drag
   document.body.style.webkitUserSelect = 'none';
   // non right clickery
   document.body.oncontextmenu = function() { return false; };
}