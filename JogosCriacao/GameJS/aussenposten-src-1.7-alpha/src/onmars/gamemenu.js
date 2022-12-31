var gamejs = require('gamejs');
var sounds = require('./sounds');

var GameMenu = exports.GameMenu = function(gameState) {
    var $gameContainer = document.getElementById('gamecontainer');
    var $menu = document.getElementById('game-menu');

    this.active = false;

    this.toggleVisiblity = function() {
        this.active = !this.active;
        if (this.active) {
           $menu.classList.add('visible');
           $gameContainer.classList.add('skewed');
        } else {
           $menu.classList.remove('visible');
           $gameContainer.classList.remove('skewed');
        }
    }

    this.onKeyUp = function(event) {
        if (event.key === gamejs.event.K_ESC) {
            this.toggleVisiblity();
        }
    }

    this.actions = {
        saveAndExit: function() {
            self.toggleVisiblity();
            gameState.pause();
            gameState.save();
            document.location.reload();
        },
        continueGame: function() {
            self.toggleVisiblity();
        },
        musicToggle: function() {
            if ($musicPlayer.isPlaying) {
                $musicPlayer.pause();
            } else {
                $musicPlayer.play();
            }
            $musicPlayer.isPlaying = !$musicPlayer.isPlaying;
        },
        soundToggle: function() {
            sounds.toggleMuted();
        }
    }

    var $musicPlayer = document.getElementById('music-player');
    $musicPlayer.isPlaying = true;
    var self = this;
    var $lis = document.getElementsByClassName('menu-button');
    for (var i = 0; i < $lis.length; i++) {
        var $entry = $lis[i];
        $entry.addEventListener('mouseup', function() {
            var actionName = this.dataset.action;
            var $input = this.getElementsByTagName('input')[0];
            if ($input) {
                $input.checked = $input.checked ? undefined : "true";
            }
            if (self.actions[actionName]) {
                self.actions[actionName]();
            }
        }, false)
    }

    var jukeClick = function(event) {
        var entry = event.currentTarget;
        $musicPlayer.pause();
        $musicPlayer.src = "./music/" + entry.dataset.file;
        for (var i = 0; i < $musicEntries.length; i++) {
            $musicEntries[i].classList.remove('playing');
        }
        entry.classList.add('playing');
        $musicPlayer.play();
    };


    // continue playing after track
    $musicPlayer.addEventListener('ended', function() {
        jukeClick({
            currentTarget: gamejs.math.random.choose(mEntries)
        });
    })

    // setup clicks
    // @@ fixme user setting
    document.getElementById('jukebox').volume = 0.3;
    var $musicEntries = document.getElementById('jukebox').getElementsByTagName('li');
    var mEntries = []
    for (var i = 0; i < $musicEntries.length; i++) {
        var entry = $musicEntries[i];
        mEntries.push(entry);
        entry.addEventListener('click', jukeClick, false);
    }
    jukeClick({
        currentTarget: gamejs.math.random.choose(mEntries)
    });

    // open menu with mouse click
    document.getElementById('menu-open').addEventListener('click', function() {
        self.toggleVisiblity();
    })

    return this;
}