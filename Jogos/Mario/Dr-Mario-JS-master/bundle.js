/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/drmario.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/board.js":
/*!**********************!*\
  !*** ./src/board.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Board; });
/* harmony import */ var _virus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./virus */ "./src/virus.js");
/* harmony import */ var _dose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dose */ "./src/dose.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var COLORS = ["red", "yellow", "blue"];

var Board =
/*#__PURE__*/
function () {
  function Board(game) {
    _classCallCheck(this, Board);

    this.width = 8;
    this.height = 16;
    this.game = game;
    this.margin = game.margin;
    this.squareWidth = game.squareWidth;
    this.squareHeight = game.squareHeight;
    this.level = game.level; // we'll do levels 0 through 20

    this.numberViruses = 4 * (this.level + 1);
    this.grid = this.createEmptyGrid();
    this.viruses = []; // this will only be updated once; game keeps track of viruses
  } // methods for populating board at beginning of game


  _createClass(Board, [{
    key: "createEmptyGrid",
    value: function createEmptyGrid() {
      var _this = this;

      var grid = _toConsumableArray(Array(this.height)).map(function (row) {
        return Array(_this.width).fill(null);
      });

      return grid;
    }
  }, {
    key: "populateViruses",
    value: function populateViruses() {
      var total = this.numberViruses; // calculated in constructor as 4 + (level * 4)

      var added = 0; // only want to add viruses to uppermost rows if the level is very high

      var rowAdjustment = 4 - Math.floor(this.level / 5); // level btwn 0 and 20

      var lowestRow = 3 + rowAdjustment;
      var rowRange = 16 - lowestRow;

      while (added < total) {
        var row = Math.floor(Math.random() * rowRange) + lowestRow;
        var column = Math.floor(Math.random() * this.width); // COLORS is a class constant, an array: ["red", "yellow", "blue"]

        var color = COLORS[Math.floor(Math.random() * 3)];

        if (this.grid[row][column] === null) {
          // only fill empty spaces
          var newVirus = new _virus__WEBPACK_IMPORTED_MODULE_0__["default"]({
            game: this.game,
            color: color,
            coordinates: [row, column]
          });
          this.grid[row][column] = newVirus;
          this.viruses.push(newVirus);
          added += 1;
        }
      }

      return this.viruses;
    } // methods for determining position, finding empty postns, saving pill to board

  }, {
    key: "getPosition",
    value: function getPosition(coords) {
      var margin = this.margin;
      var bottleSide = 24;
      var bottleTop = 115;

      var _coords = _slicedToArray(coords, 2),
          yCoord = _coords[0],
          xCoord = _coords[1];

      var xPos = margin + bottleSide + xCoord * (this.squareWidth + margin);
      var yPos = margin + bottleTop + yCoord * (this.squareHeight + margin);
      return {
        x: xPos,
        y: yPos
      };
    }
  }, {
    key: "isEmpty",
    value: function isEmpty(coords) {
      // coords is an array in form of [row, column]
      var _coords2 = _slicedToArray(coords, 2),
          row = _coords2[0],
          column = _coords2[1];

      if (column < 0 || column > 7) return false; // outside of board

      if (row < 0 || row > 15) return false; // outside of board

      if (this.grid[row][column] === null) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "boardFull",
    value: function boardFull() {
      if (this.grid[0][3] || this.grid[0][4]) return true;
      return false;
    }
  }, {
    key: "recordPill",
    value: function recordPill(pill) {
      var _pill$coordinates = _slicedToArray(pill.coordinates, 2),
          row = _pill$coordinates[0],
          column = _pill$coordinates[1];

      var rotation = pill.rotation;
      var orientation = pill.orientation;
      var c0 = pill.c0;
      var c1 = pill.c1;

      if (orientation === "horizontal") {
        var leftCoord = [row, column];
        var rightCoord = [row, column + 1];

        if (rotation === 0) {
          this.grid[row][column] = new _dose__WEBPACK_IMPORTED_MODULE_1__["default"]({
            color: c0,
            coordinates: leftCoord,
            game: this.game,
            pill: pill,
            otherHalf: rightCoord
          });
          this.grid[row][column + 1] = new _dose__WEBPACK_IMPORTED_MODULE_1__["default"]({
            color: c1,
            coordinates: rightCoord,
            game: this.game,
            pill: pill,
            otherHalf: leftCoord
          });
        } else if (rotation === 180) {
          this.grid[row][column] = new _dose__WEBPACK_IMPORTED_MODULE_1__["default"]({
            color: c1,
            coordinates: leftCoord,
            game: this.game,
            pill: pill,
            otherHalf: rightCoord
          });
          this.grid[row][column + 1] = new _dose__WEBPACK_IMPORTED_MODULE_1__["default"]({
            color: c0,
            coordinates: rightCoord,
            game: this.game,
            pill: pill,
            otherHalf: leftCoord
          });
        }
      } else if (orientation === "vertical") {
        var topCoord = [row - 1, column];
        var bottomCoord = [row, column];

        if (rotation === 90) {
          this.grid[row - 1][column] = new _dose__WEBPACK_IMPORTED_MODULE_1__["default"]({
            color: c0,
            coordinates: topCoord,
            game: this.game,
            pill: pill,
            otherHalf: bottomCoord
          });
          this.grid[row][column] = new _dose__WEBPACK_IMPORTED_MODULE_1__["default"]({
            color: c1,
            coordinates: bottomCoord,
            game: this.game,
            pill: pill,
            otherHalf: topCoord
          });
        } else if (rotation === 270) {
          this.grid[row - 1][column] = new _dose__WEBPACK_IMPORTED_MODULE_1__["default"]({
            color: c1,
            coordinates: topCoord,
            game: this.game,
            pill: pill,
            otherHalf: bottomCoord
          });
          this.grid[row][column] = new _dose__WEBPACK_IMPORTED_MODULE_1__["default"]({
            color: c0,
            coordinates: bottomCoord,
            game: this.game,
            pill: pill,
            otherHalf: topCoord
          });
        }
      }
    } // methods for detecting 4+ of one color in a row (vert. or horiz.)

  }, {
    key: "checkFourDown",
    value: function checkFourDown(coords) {
      var _coords3 = _slicedToArray(coords, 2),
          row = _coords3[0],
          column = _coords3[1];

      var sqNumber = 1;
      var squares = [coords];
      var color = this.grid[row][column].color;
      var currRow = row;
      var sameColor = true;

      while (sameColor && currRow <= 14) {
        currRow += 1;
        var currSquare = this.grid[currRow][column];

        if (currSquare) {
          var currColor = this.grid[currRow][column].color;

          if (currColor === color) {
            sqNumber += 1;
            squares.push([currRow, column]);
          } else {
            sameColor = false;
          }
        } else {
          sameColor = false;
        }
      }

      if (sqNumber >= 4) {
        return squares;
      } else {
        return false;
      }
    }
  }, {
    key: "checkFourAcross",
    value: function checkFourAcross(coords) {
      var _coords4 = _slicedToArray(coords, 2),
          row = _coords4[0],
          column = _coords4[1];

      var sqNumber = 1;
      var squares = [coords];
      var color = this.grid[row][column].color;
      var currCol = column;
      var sameColor = true;

      while (sameColor && currCol <= 6) {
        currCol += 1;
        var currSquare = this.grid[row][currCol];

        if (currSquare) {
          var currColor = this.grid[row][currCol].color;

          if (currColor === color) {
            sqNumber += 1;
            squares.push([row, currCol]);
          } else {
            sameColor = false;
          }
        } else {
          sameColor = false;
        }
      }

      if (sqNumber >= 4) {
        return squares;
      } else {
        return false;
      }
    }
  }, {
    key: "coordInArray",
    value: function coordInArray(coord, array) {
      return array.some(function (ele) {
        return ele[0] === coord[0] && ele[1] === coord[1];
      });
    }
  }, {
    key: "findFours",
    value: function findFours() {
      var _this2 = this;

      var fours = [];

      for (var row = 0; row <= 15; row++) {
        for (var col = 0; col <= 7; col++) {
          var coords = [row, col];

          if (!this.isEmpty(coords)) {
            var downResult = this.checkFourDown(coords);
            var acrossResult = this.checkFourAcross(coords);

            if (downResult) {
              fours = fours.concat(downResult);
            }

            if (acrossResult) {
              fours = fours.concat(acrossResult);
            }
          }
        }
      }

      if (fours.length === 0) return null;
      var result = []; // need to eliminate duplicate coordinates from result

      fours.forEach(function (coord) {
        if (!_this2.coordInArray(coord, result)) {
          result.push(coord);
        }
      });
      return result;
    } // isVirus(coord) {
    // }

  }, {
    key: "deleteFromBoard",
    value: function deleteFromBoard(coordArray) {
      var scoreMultiplier = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var that = this;
      var virusCount = 0;
      coordArray.forEach(function (coord) {
        var _coord = _slicedToArray(coord, 2),
            row = _coord[0],
            column = _coord[1];

        var item = that.grid[row][column];
        if (item instanceof _virus__WEBPACK_IMPORTED_MODULE_0__["default"]) virusCount += 1;

        if (item instanceof _dose__WEBPACK_IMPORTED_MODULE_1__["default"] && item.pill) {
          var pill = item.pill;
          var otherHalfCoord = item.otherHalf;

          var _otherHalfCoord = _slicedToArray(otherHalfCoord, 2),
              doseRow = _otherHalfCoord[0],
              doseCol = _otherHalfCoord[1];

          var dose = that.grid[doseRow][doseCol]; // delete pill

          pill.deleteFromGame();
          dose.pill = null;
          dose.otherHalf = null; // add dose to game to display

          dose.single = true;
          dose.addToGame();
        } else {
          item.deleteFromGame();
        }

        that.grid[row][column] = null;
      });

      if (virusCount > 0) {
        var points = Math.pow(3, virusCount) * 100 + scoreMultiplier;
        if (points > 5000) points = 5000;
        this.game.score += points;
      }
    }
  }, {
    key: "applyGravity",
    value: function applyGravity() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var canFall = false;

        for (var row = 14; row >= 0; row--) {
          for (var col = 0; col <= 7; col++) {
            var currItem = _this3.grid[row][col];
            var applied;

            if (currItem instanceof _dose__WEBPACK_IMPORTED_MODULE_1__["default"] && currItem.pill) {
              var pill = currItem.pill;
              applied = pill.applyGravity();
              if (applied) canFall = true;
            } else if (currItem instanceof _dose__WEBPACK_IMPORTED_MODULE_1__["default"] && currItem.single) {
              applied = currItem.applyGravity();
              if (applied) canFall = true;
            }
          }
        }

        if (canFall) {
          window.setTimeout(function () {
            _this3.applyGravity().then(function () {
              resolve(true);
            });
          }, 250);
        } else {
          window.setTimeout(function () {
            resolve(true);
          }, 100);
        }
      });
    }
  }, {
    key: "clearFours",
    value: function clearFours() {
      var scoreMultiplier = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var toClear = this.findFours();

      if (toClear) {
        this.deleteFromBoard(toClear, scoreMultiplier);
      }
    }
  }]);

  return Board;
}();



/***/ }),

/***/ "./src/dose.js":
/*!*********************!*\
  !*** ./src/dose.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Dose; });
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DOSE_SPRITES = {
  single: {
    red: [0, 40, 7, 7],
    yellow: [8, 40, 7, 7],
    blue: [16, 40, 7, 7]
  },
  empty: {
    red: [0, 48, 7, 7],
    yellow: [8, 48, 7, 7],
    blue: [16, 48, 7, 7]
  }
};

var Dose =
/*#__PURE__*/
function () {
  function Dose(options) {
    _classCallCheck(this, Dose);

    this.color = options.color;
    this.coordinates = options.coordinates;
    this.pill = options.pill || null;
    this.otherHalf = options.otherHalf || null;
    this.single = options.single || false;
    this.game = options.game;
    this.spritesheet = this.game.spritesheet;
    this.position = this.game.board.getPosition(this.coordinates);
    this.width = options.game.squareWidth;
    this.height = options.game.squareHeight;
  }

  _createClass(Dose, [{
    key: "addToGame",
    value: function addToGame() {
      this.game.singleDoses.push(this);
      this.game.gameObjects.push(this);
    }
  }, {
    key: "deleteFromGame",
    value: function deleteFromGame() {
      var singleDoseIndex = this.game.singleDoses.indexOf(this);
      var gameObjectsIndex = this.game.gameObjects.indexOf(this);
      this.game.singleDoses.splice(singleDoseIndex, 1);
      this.game.gameObjects.splice(gameObjectsIndex, 1);
    }
  }, {
    key: "canDrop",
    value: function canDrop() {
      if (!this.single) {
        console.log('this method is not for pills!!!!');
        return null;
      }

      var _this$coordinates = _slicedToArray(this.coordinates, 2),
          currRow = _this$coordinates[0],
          currCol = _this$coordinates[1];

      var nextRow = currRow + 1;

      if (this.game.board.isEmpty([nextRow, currCol])) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "applyGravity",
    value: function applyGravity() {
      if (!this.single) {
        console.log('this method is not for pills!!!!');
        return null;
      }

      if (this.canDrop()) {
        var _this$coordinates2 = _slicedToArray(this.coordinates, 2),
            currRow = _this$coordinates2[0],
            currCol = _this$coordinates2[1];

        var nextRow = currRow + 1;
        this.coordinates[0] += 1;
        this.position = this.game.board.getPosition(this.coordinates);
        this.game.board.grid[currRow][currCol] = null;
        this.game.board.grid[nextRow][currCol] = this;
        return true;
      }

      return false;
    } // display for single doses only

  }, {
    key: "getSprite",
    value: function getSprite() {
      var color = this.color;
      return DOSE_SPRITES.single[color];
    }
  }, {
    key: "update",
    value: function update(timestamp) {}
  }, {
    key: "draw",
    value: function draw(ctx) {
      var sprite = this.getSprite();
      ctx.drawImage(this.spritesheet, sprite[0], sprite[1], sprite[2], sprite[3], this.position.x, this.position.y, this.width, this.height);
    }
  }]);

  return Dose;
}();



/***/ }),

/***/ "./src/drmario.js":
/*!************************!*\
  !*** ./src/drmario.js ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/game.js");
/* harmony import */ var _mario__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mario */ "./src/mario.js");
/* harmony import */ var _soundboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./soundboard */ "./src/soundboard.js");



var GAME_WIDTH = 250;
var GAME_HEIGHT = 492;
var MARGIN = 3;
var SQR_WIDTH = 25 - MARGIN;
var SQR_HEIGHT = 22 - MARGIN;
var BOTTLE = [153, 290, 78, 174]; // utility for ghost typing name under 'created by' field

var printName = function printName(input) {
  var name = "KEVIN MOCH";
  var timing = 100;
  setTimeout(function () {
    for (var i = 1; i <= name.length; i++) {
      (function (i) {
        setTimeout(function () {
          input.innerText = name.slice(0, i);
        }, timing * i);
      })(i);
    }
  }, 1000);
}; // utility for converting range slider number to a speed string


var getLevel = function getLevel(num) {
  switch (num) {
    case 1:
      return "Slow";

    case 2:
      return "Medium";

    case 3:
      return "Fast";

    case 4:
      return "Faster";

    case 5:
      return "Fastest";
  }
};

document.addEventListener('DOMContentLoaded', function () {
  // fade in elements while waiting for google font to load
  var jsLogo = document.getElementById("logo-js");
  var createdBy = document.getElementById('created-by');
  var myName = document.getElementById('kevin-moch');
  var menuSidebar = document.getElementById('menu-sidebar');
  window.setTimeout(function () {
    jsLogo.style.color = "black";
    createdBy.style.opacity = 1;
    printName(myName);
    window.setTimeout(function () {
      menuSidebar.style.opacity = 1;
    }, 1000);
  }, 100); // listener to adjust the displayed game level

  var levelSlide = document.getElementById("level-slide");
  var levelOutput = document.getElementById("curr-level");
  levelOutput.innerHTML = levelSlide.value;

  levelSlide.oninput = function () {
    levelOutput.innerHTML = this.value;
  }; // listener to adjust the displayed game speed


  var speedSlide = document.getElementById("speed-slide");
  var speedOutput = document.getElementById("curr-speed");
  speedOutput.innerHTML = getLevel(parseInt(speedSlide.value));

  speedSlide.oninput = function () {
    speedOutput.innerHTML = getLevel(parseInt(this.value));
  }; // grabbing canvases and canvas contexts


  var canvas = document.getElementById("gameScreen");
  var ctx = canvas.getContext("2d");
  var marioCanvas = document.getElementById("dr-mario-canvas");
  var marioCtx = marioCanvas.getContext('2d');
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT); // grabbing spritesheets

  var miscellaneous = document.getElementById("miscellaneous");
  var spritesheet = document.getElementById("spritesheet");
  spritesheet.addEventListener("load", function () {
    ctx.drawImage(miscellaneous, BOTTLE[0], BOTTLE[1], BOTTLE[2], BOTTLE[3], 0, 0, GAME_WIDTH, GAME_HEIGHT);
    var gameOptions = document.getElementById('game-options');
    var startButton = document.getElementById('start-button');
    var soundboard = new _soundboard__WEBPACK_IMPORTED_MODULE_2__["default"]();
    startButton.addEventListener('click', function () {
      var stageLevel = parseInt(levelSlide.value);
      var stageSpeed = parseInt(speedSlide.value);
      var game = new _game__WEBPACK_IMPORTED_MODULE_0__["default"](GAME_WIDTH, GAME_HEIGHT, MARGIN, SQR_WIDTH, SQR_HEIGHT, spritesheet, stageLevel, stageSpeed);
      var mario = new _mario__WEBPACK_IMPORTED_MODULE_1__["default"]({
        spritesheet: miscellaneous,
        game: game
      });
      gameOptions.classList.add('muted'); // startButton.innerText = "RESTART";

      game.start();

      function gameLoop(timestamp) {
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        ctx.drawImage(miscellaneous, BOTTLE[0], BOTTLE[1], BOTTLE[2], BOTTLE[3], 0, 0, GAME_WIDTH, GAME_HEIGHT);
        game.update(timestamp);
        game.draw(ctx);
        mario.draw(marioCtx);
        requestAnimationFrame(gameLoop);
      }

      requestAnimationFrame(gameLoop);
    });
  });
});

/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Game; });
/* harmony import */ var _input__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./input */ "./src/input.js");
/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./board */ "./src/board.js");
/* harmony import */ var _pill__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pill */ "./src/pill.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var COLORS = ["red", "yellow", "blue"];

var Game =
/*#__PURE__*/
function () {
  function Game(gameWidth, gameHeight, margin, squareWidth, squareHeight, spritesheet, level, speed) {
    _classCallCheck(this, Game);

    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.margin = margin;
    this.squareWidth = squareWidth;
    this.squareHeight = squareHeight;
    this.spritesheet = spritesheet;
    this.level = level ? level : 0;
    this.speed = speed ? speed : 1;
    this.paused = false;
    this.pillFalling = false;
    this.score = 0;
    this.board = new _board__WEBPACK_IMPORTED_MODULE_1__["default"](this);
    this.viruses = this.board.populateViruses();
    this.fallenPills = [];
    this.singleDoses = [];
    this.currentPill = this.generatePill();
    this.nextPill = this.generatePill();
  }

  _createClass(Game, [{
    key: "start",
    value: function start() {
      var levelDisplay = document.getElementById('stage-level-display');
      levelDisplay.innerText = this.level;
      this.virusDisplay = document.getElementById('stage-viruses-display');
      this.virusDisplay.innerText = this.viruses.length;
      this.scoreDisplay = document.getElementById('stage-score-display');
      this.scoreDisplay.innerText = this.score;
      var stageInfo = document.getElementById('stage-info');
      stageInfo.classList.toggle('hidden'); // let pauseButton = document.getElementById('pause-button');
      // pauseButton.addEventListener('click', () => {
      //   this.paused = !this.paused;
      // });

      this.gameObjects = [].concat(_toConsumableArray(this.viruses), _toConsumableArray(this.fallenPills), _toConsumableArray(this.singleDoses), [this.currentPill]);
      this.currentHandler = new _input__WEBPACK_IMPORTED_MODULE_0__["default"](this.currentPill);
    }
  }, {
    key: "generatePill",
    value: function generatePill() {
      var c0 = COLORS[Math.floor(Math.random() * 3)];
      var c1 = COLORS[Math.floor(Math.random() * 3)];
      var newPill = new _pill__WEBPACK_IMPORTED_MODULE_2__["default"]({
        colors: [c0, c1],
        game: this
      });
      return newPill;
    }
  }, {
    key: "loadNextPill",
    value: function loadNextPill() {
      var that = this;
      window.setTimeout(function () {
        that.currentPill = that.nextPill;
        that.gameObjects.push(that.currentPill);
        that.currentHandler = new _input__WEBPACK_IMPORTED_MODULE_0__["default"](that.currentPill);
        that.nextPill = that.generatePill();
        that.pillFalling = false; // only for passive falling i.e. gravity (not using this currently)
      }, 100);
    } // game utility fxx
    // pause() {
    //   if (!this.pillFalling) {
    //     this.paused = !this.paused;
    //   }
    // }
    // re-reveal game options area upon clicking won-game or lost-game modal (pill.js)

  }, {
    key: "newGame",
    value: function newGame(modalId) {
      var modal = document.getElementById(modalId);
      var gameOptions = document.getElementById('game-options');
      var startButton = document.getElementById('start-button');
      modal.classList.add('hidden');
      gameOptions.classList.remove('muted');
      startButton.innerText = "START";
    }
  }, {
    key: "update",
    value: function update(timestamp) {
      this.virusDisplay.innerText = this.viruses.length;
      this.scoreDisplay.innerText = this.score; // if (this.paused) return;

      this.gameObjects.forEach(function (object) {
        return object.update(timestamp);
      });
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      this.gameObjects.forEach(function (object) {
        return object.draw(ctx);
      });
    }
  }]);

  return Game;
}();



/***/ }),

/***/ "./src/input.js":
/*!**********************!*\
  !*** ./src/input.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return InputHandler; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var InputHandler =
/*#__PURE__*/
function () {
  function InputHandler(pill) {
    _classCallCheck(this, InputHandler);

    this.pill = pill;
    this.handleInput = this.handleInput.bind(this);
    document.addEventListener("keydown", this.handleInput);
  }

  _createClass(InputHandler, [{
    key: "handleInput",
    value: function handleInput(event) {
      switch (event.keyCode) {
        case 74:
          event.preventDefault();
          this.pill.moveLeft();
          break;

        case 37:
          event.preventDefault();
          this.pill.moveLeft();
          break;

        case 76:
          event.preventDefault();
          this.pill.moveRight();
          break;

        case 39:
          event.preventDefault();
          this.pill.moveRight();
          break;

        case 75:
          event.preventDefault();
          this.pill.speedDrop();
          break;

        case 40:
          event.preventDefault();
          this.pill.speedDrop();
          break;

        case 83:
          event.preventDefault();
          this.pill.flipLeft();
          break;

        case 70:
          event.preventDefault();
          this.pill.flipRight();
          break;

        case 32:
          event.preventDefault();
        //   if (!this.pill.game.pillFalling) {
        //     this.pill.game.pause();
        //   }
        //   break;
      }
    }
  }, {
    key: "removeListener",
    value: function removeListener() {
      document.removeEventListener("keydown", this.handleInput);
    }
  }]);

  return InputHandler;
}();



/***/ }),

/***/ "./src/mario.js":
/*!**********************!*\
  !*** ./src/mario.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Mario; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MARIO_SPRITES = {
  armUp: [0, 201, 23, 39],
  armMid: [25, 201, 30, 39],
  armDown: [65, 201, 22, 39]
};

var Mario =
/*#__PURE__*/
function () {
  function Mario(options) {
    _classCallCheck(this, Mario);

    this.spritesheet = options.spritesheet;
    this.stance = "armUp";
    this.game = options.game;
  }

  _createClass(Mario, [{
    key: "getSprite",
    value: function getSprite() {
      return MARIO_SPRITES[this.stance];
    }
  }, {
    key: "getXOffset",
    value: function getXOffset() {
      switch (this.stance) {
        case "armMid":
          return 0;

        case "armUp":
          return 7;

        case "armDown":
          return 8;
      }
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      var sprite = this.getSprite();
      var offset = this.getXOffset() * 3;
      var nextPill = this.game.nextPill;
      ctx.drawImage(spritesheet, sprite[0], sprite[1], sprite[2], sprite[3], 30 + offset, 15, 90 - offset, 116);
      nextPill.drawNextPill(ctx);
    }
  }]);

  return Mario;
}();



/***/ }),

/***/ "./src/pill.js":
/*!*********************!*\
  !*** ./src/pill.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Pill; });
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* game_width = 202 (8sq.);   game_height = 354 (16sq.); */

/* sq_width = 23px (25);      sq_height = 20px (22); */
var COLOR_SPRITES = {
  top: {
    red: [0, 8, 7, 7],
    yellow: [8, 8, 7, 7],
    blue: [16, 8, 7, 7]
  },
  bottom: {
    red: [0, 16, 7, 7],
    yellow: [8, 16, 7, 7],
    blue: [16, 16, 7, 7]
  },
  left: {
    red: [0, 24, 7, 7],
    yellow: [8, 24, 7, 7],
    blue: [16, 24, 7, 7]
  },
  right: {
    red: [0, 32, 7, 7],
    yellow: [8, 32, 7, 7],
    blue: [16, 32, 7, 7]
  },
  single: {
    red: [0, 40, 7, 7],
    yellow: [8, 40, 7, 7],
    blue: [16, 40, 7, 7]
  },
  empty: {
    red: [0, 48, 7, 7],
    yellow: [8, 48, 7, 7],
    blue: [16, 48, 7, 7]
  }
};

var Pill =
/*#__PURE__*/
function () {
  function Pill(options) {
    _classCallCheck(this, Pill);

    this.gameWidth = options.game.gameWidth;
    this.gameHeight = options.game.gameHeight;
    this.width = options.game.squareWidth;
    this.height = options.game.squareHeight;
    this.margin = options.game.margin;
    this.totalWidth = this.width + this.margin;
    this.totalHeight = this.height + this.margin;
    this.spritesheet = options.game.spritesheet;
    this.board = options.game.board;
    this.game = options.game;
    this.c0 = options.colors[0];
    this.c1 = options.colors[1];
    this.coordinates = [0, 3]; // coordinates[0]= y/row, coordinates[1]= x/col

    this.position = this.board.getPosition(this.coordinates);
    this.rotation = 0;
    this.orientation = this.getOrientation();
    this.lastDrop = null;
    this.dropSpeed = options.game.speed;
    this.stationary = false;
    this.connected = true;
  } // methods involved in changing pill's instance variables/own state


  _createClass(Pill, [{
    key: "getOrientation",
    value: function getOrientation() {
      switch (this.rotation) {
        case 0:
          return "horizontal";

        case 90:
          return "vertical";

        case 180:
          return "horizontal";

        case 270:
          return "vertical";
      }
    }
  }, {
    key: "canMoveLeft",
    value: function canMoveLeft() {
      var _this$coordinates = _slicedToArray(this.coordinates, 2),
          currRow = _this$coordinates[0],
          currCol = _this$coordinates[1];

      var prevRow = currRow - 1;
      var prevCol = currCol - 1;

      if (this.orientation === "horizontal") {
        if (this.board.isEmpty([currRow, prevCol])) {
          return true;
        } else {
          return false;
        }
      } else if (this.orientation === "vertical") {
        if (this.board.isEmpty([currRow, prevCol]) && this.board.isEmpty([prevRow, prevCol])) {
          return true;
        } else {
          return false;
        }
      }
    }
  }, {
    key: "canMoveRight",
    value: function canMoveRight() {
      var _this$coordinates2 = _slicedToArray(this.coordinates, 2),
          currRow = _this$coordinates2[0],
          currCol = _this$coordinates2[1];

      var prevRow = currRow - 1;
      var nextCol = currCol + 1;

      if (this.orientation === "horizontal") {
        if (this.board.isEmpty([currRow, nextCol]) && this.board.isEmpty([currRow, nextCol + 1])) {
          return true;
        } else {
          return false;
        }
      } else if (this.orientation === "vertical") {
        if (this.board.isEmpty([currRow, nextCol]) && this.board.isEmpty([prevRow, nextCol])) {
          return true;
        } else {
          return false;
        }
      }
    }
  }, {
    key: "moveLeft",
    value: function moveLeft() {
      if (this.game.paused) return;

      if (!this.stationary && this.canMoveLeft()) {
        this.coordinates[1] -= 1;
        this.position = this.board.getPosition(this.coordinates);
      }
    }
  }, {
    key: "moveRight",
    value: function moveRight() {
      if (this.game.paused) return;

      if (!this.stationary && this.canMoveRight()) {
        if (this.orientation === "horizontal" && this.coordinates[1] < 6 || this.orientation === "vertical" && this.coordinates[1] < 7) {
          this.coordinates[1] += 1;
          this.position = this.board.getPosition(this.coordinates);
        }
      }
    }
  }, {
    key: "canFlip",
    value: function canFlip() {
      var _this$coordinates3 = _slicedToArray(this.coordinates, 2),
          currRow = _this$coordinates3[0],
          currCol = _this$coordinates3[1];

      var prevRow = currRow - 1;
      var prevCol = currCol - 1;
      var nextRow = currRow + 1;
      var nextCol = currCol + 1;

      if (this.orientation === "horizontal") {
        if (!this.board.isEmpty([prevRow, currCol]) && !this.board.isEmpty([prevRow, nextCol]) && !this.board.isEmpty([nextRow, currCol]) && !this.board.isEmpty([nextRow, nextCol])) {
          return false;
        } else {
          return true;
        }
      } else if (this.orientation === "vertical") {
        if (!this.board.isEmpty([prevRow, prevCol]) && !this.board.isEmpty([currRow, prevCol]) && !this.board.isEmpty([prevRow, nextCol]) && !this.board.isEmpty([currRow, nextCol])) {
          return false;
        } else {
          return true;
        }
      }
    }
  }, {
    key: "adjustFlip",
    value: function adjustFlip() {
      var _this$coordinates4 = _slicedToArray(this.coordinates, 2),
          currRow = _this$coordinates4[0],
          currCol = _this$coordinates4[1];

      var prevRow = currRow - 1;
      var prevCol = currCol - 1;
      var nextRow = currRow + 1;
      var nextCol = currCol + 1;

      if (this.orientation === "vertical") {
        if (!this.board.isEmpty([prevRow, currCol])) {
          if (!this.board.isEmpty([nextRow, currCol])) {
            if (!this.board.isEmpty([prevRow, nextCol])) {
              this.coordinates = [nextRow, nextCol];
              this.position = this.board.getPosition(this.coordinates);
            } else {
              this.coordinates = [currRow, nextCol];
              this.position = this.board.getPosition(this.coordinates);
            }
          } else {
            this.coordinates = [nextRow, currCol];
            this.position = this.board.getPosition(this.coordinates);
          }
        }
      } else if (this.orientation === "horizontal") {
        if (!this.board.isEmpty([currRow, nextCol])) {
          if (!this.board.isEmpty([currRow, prevCol])) {
            if (!this.board.isEmpty([prevRow, nextCol])) {
              this.coordinates = [prevRow, prevCol];
              this.position = this.board.getPosition(this.coordinates);
            } else {
              this.coordinates = [prevRow, currCol];
              this.position = this.board.getPosition(this.coordinates);
            }
          } else {
            this.coordinates = [currRow, prevCol];
            this.position = this.board.getPosition(this.coordinates);
          }
        }
      }
    }
  }, {
    key: "flipLeft",
    value: function flipLeft() {
      if (this.game.paused) return;

      if (!this.stationary && this.canFlip()) {
        var newRotation = this.rotation - 90;
        this.rotation = newRotation >= 0 ? newRotation : ((this.rotation - 90) % 360 + 360) % 360; // funkiness of % with negs

        this.orientation = this.getOrientation();
        this.adjustFlip();
      }
    }
  }, {
    key: "flipRight",
    value: function flipRight() {
      if (this.game.paused) return;

      if (!this.stationary && this.canFlip()) {
        this.rotation = (this.rotation + 90) % 360;
        this.orientation = this.getOrientation();
        this.adjustFlip();
      }
    }
  }, {
    key: "canDrop",
    value: function canDrop() {
      var _this$coordinates5 = _slicedToArray(this.coordinates, 2),
          currRow = _this$coordinates5[0],
          currCol = _this$coordinates5[1];

      var nextRow = currRow + 1;
      var nextCol = currCol + 1;

      if (this.orientation === "horizontal") {
        if (this.board.isEmpty([nextRow, currCol]) && this.board.isEmpty([nextRow, nextCol])) {
          return true;
        } else {
          return false;
        }
      } else if (this.orientation === "vertical") {
        if (this.board.isEmpty([nextRow, currCol])) {
          return true;
        } else {
          return false;
        }
      }
    }
  }, {
    key: "drop",
    value: function drop() {
      if (this.canDrop()) {
        this.coordinates[0] += 1;
        this.position = this.board.getPosition(this.coordinates);
      } else {
        this.freeze();
      }
    }
  }, {
    key: "applyGravity",
    value: function applyGravity() {
      if (this.canDrop()) {
        var _this$coordinates6 = _slicedToArray(this.coordinates, 2),
            currRow = _this$coordinates6[0],
            currCol = _this$coordinates6[1];

        var prevRow = currRow - 1;
        var nextCol = currCol + 1;
        this.coordinates[0] += 1;
        this.position = this.board.getPosition(this.coordinates);

        if (this.orientation === "horizontal") {
          this.board.grid[currRow][currCol] = null;
          this.board.grid[currRow][nextCol] = null;
        } else if (this.orientation === "vertical") {
          this.board.grid[prevRow][currCol] = null;
          this.board.grid[currRow][currCol] = null;
        }

        this.board.recordPill(this);
        return true;
      }

      return false;
    }
  }, {
    key: "speedDrop",
    value: function speedDrop() {
      if (this.game.paused) return;
      this.drop();
    }
  }, {
    key: "freeze",
    value: function freeze() {
      var _this = this;

      this.stationary = true;
      this.game.pillFalling = true;
      this.game.fallenPills.push(this);
      this.game.currentHandler.removeListener();
      this.board.recordPill(this);
      this.board.clearFours(); // console.log(this.board.applyGravity());

      this.board.applyGravity().then(function () {
        _this.board.clearFours(500);

        return _this.board.applyGravity();
      }).then(function () {
        _this.board.clearFours(1000);

        return _this.board.applyGravity();
      }).then(function () {
        if (_this.game.viruses.length === 0) {
          var wonGame = document.getElementById('won-game');
          wonGame.classList.remove('hidden');
          var newStage = document.getElementById('new-stage');
          newStage.addEventListener('click', function () {
            _this.game.newGame('won-game');
          });
        } else if (!_this.board.boardFull()) {
          _this.game.loadNextPill();
        } else {
          var lostGame = document.getElementById('lost-game');
          lostGame.classList.remove('hidden');
          var newGame = document.getElementById('new-game');
          newGame.addEventListener('click', function () {
            _this.game.newGame('lost-game');
          });
        }
      });
    }
  }, {
    key: "deleteFromGame",
    value: function deleteFromGame() {
      var fallenPillsIndex = this.game.fallenPills.indexOf(this);
      var gameObjectsIndex = this.game.gameObjects.indexOf(this);
      this.game.fallenPills.splice(fallenPillsIndex, 1);
      this.game.gameObjects.splice(gameObjectsIndex, 1);
    } // methods involved in displaying/drawing the pills

  }, {
    key: "getSprites",
    value: function getSprites() {
      var left, right, top, bottom;
      var c0 = this.c0;
      var c1 = this.c1;

      if (this.rotation === 0) {
        left = COLOR_SPRITES.left[c0];
        right = COLOR_SPRITES.right[c1];
        return {
          left: left,
          right: right
        };
      } else if (this.rotation === 180) {
        left = COLOR_SPRITES.left[c1];
        right = COLOR_SPRITES.right[c0];
        return {
          left: left,
          right: right
        };
      } else if (this.rotation === 90) {
        top = COLOR_SPRITES.top[c0];
        bottom = COLOR_SPRITES.bottom[c1];
        return {
          top: top,
          bottom: bottom
        };
      } else if (this.rotation === 270) {
        top = COLOR_SPRITES.top[c1];
        bottom = COLOR_SPRITES.bottom[c0];
        return {
          top: top,
          bottom: bottom
        };
      }
    }
  }, {
    key: "drawHorizontal",
    value: function drawHorizontal(ctx) {
      var sprites = this.getSprites();
      ctx.drawImage(spritesheet, sprites.left[0], sprites.left[1], sprites.left[2], sprites.left[3], this.position.x, this.position.y, this.width, this.height);
      ctx.drawImage(spritesheet, sprites.right[0], sprites.right[1], sprites.right[2], sprites.right[3], this.position.x + 25, this.position.y, this.width, this.height);
    }
  }, {
    key: "drawVertical",
    value: function drawVertical(ctx) {
      var sprites = this.getSprites();
      ctx.drawImage(spritesheet, sprites.top[0], sprites.top[1], sprites.top[2], sprites.top[3], this.position.x, this.position.y - 22, this.width, this.height);
      ctx.drawImage(spritesheet, sprites.bottom[0], sprites.bottom[1], sprites.bottom[2], sprites.bottom[3], this.position.x, this.position.y, this.width, this.height);
    }
  }, {
    key: "drawNextPill",
    value: function drawNextPill(ctx) {
      var sprites = this.getSprites();
      ctx.drawImage(spritesheet, sprites.left[0], sprites.left[1], sprites.left[2], sprites.left[3], 27, 2, this.width, this.height);
      ctx.drawImage(spritesheet, sprites.right[0], sprites.right[1], sprites.right[2], sprites.right[3], 27 + 25, 2, this.width, this.height);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      if (this.orientation === "horizontal") {
        this.drawHorizontal(ctx);
      } else if (this.orientation === "vertical") {
        this.drawVertical(ctx);
      }
    }
  }, {
    key: "update",
    value: function update(timestamp) {
      if (!this.lastDrop) this.lastDrop = timestamp;

      if (!this.stationary) {
        var dropInterval = 1200 - 200 * this.dropSpeed;

        if (timestamp - this.lastDrop > dropInterval) {
          this.drop();
          this.lastDrop = timestamp;
        }
      }
    }
  }]);

  return Pill;
}();



/***/ }),

/***/ "./src/soundboard.js":
/*!***************************!*\
  !*** ./src/soundboard.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Soundboard; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Soundboard =
/*#__PURE__*/
function () {
  function Soundboard() {
    var _this = this;

    _classCallCheck(this, Soundboard);

    this.themeSRC = './assets/sounds/Dr_Mario_Theme.mp3';
    this.gameSRC = './assets/sounds/Fever_music.mp3';
    this.src = this.themeSRC;
    this.createAudio();
    this.muteButton = document.getElementById('mute-music');
    this.startButton = document.getElementById('start-button');
    this.lostButton = document.getElementById('lost-game');
    this.wonButton = document.getElementById('won-game');
    this.muteButton.addEventListener('click', function () {
      _this.toggleMute();

      _this.muteButton.classList.toggle('sound-off');
    });
    this.startButton.addEventListener('click', function () {
      _this.audio.src = _this.gameSRC;
    });
    this.lostButton.addEventListener('click', function () {
      _this.audio.src = _this.themeSRC;
    });
    this.wonButton.addEventListener('click', function () {
      _this.audio.src = _this.themeSRC;
    });
    this.playMusic();
  }

  _createClass(Soundboard, [{
    key: "createAudio",
    value: function createAudio() {
      this.audio = document.createElement('audio');
      this.audio.src = this.src;
      this.audio.style.display = "none";
      this.audio.loop = "true";
      document.body.appendChild(this.audio);
    }
  }, {
    key: "playMusic",
    value: function playMusic() {
      var _this2 = this;

      document.addEventListener('click', function () {
        _this2.audio.play();
      });
    }
  }, {
    key: "toggleMute",
    value: function toggleMute() {
      this.audio.muted = !this.audio.muted;
    }
  }]);

  return Soundboard;
}();



/***/ }),

/***/ "./src/virus.js":
/*!**********************!*\
  !*** ./src/virus.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Virus; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var VIRUS_SPRITES = {
  red: {
    0: [0, 88, 7, 7],
    1: [0, 96, 7, 7]
  },
  yellow: {
    0: [0, 112, 7, 7],
    1: [0, 120, 7, 7]
  },
  blue: {
    0: [0, 136, 7, 7],
    1: [0, 144, 7, 7]
  },
  none: {
    0: [108, 260, 8, 8]
  }
};

var Virus =
/*#__PURE__*/
function () {
  function Virus(options) {
    _classCallCheck(this, Virus);

    this.color = options.color;
    this.coordinates = options.coordinates;
    this.spritesheet = options.game.spritesheet;
    this.width = options.game.squareWidth;
    this.height = options.game.squareHeight;
    this.margin = options.game.margin;
    this.board = options.game.board;
    this.game = options.game;
    this.position = this.board.getPosition(this.coordinates);
    this.frame = 0;
    this.lastUpdated = null;
    this.frameLength = 250;
  }

  _createClass(Virus, [{
    key: "deleteFromGame",
    value: function deleteFromGame() {
      var gameVirusesIndex = this.game.viruses.indexOf(this);
      var gameObjectsIndex = this.game.gameObjects.indexOf(this);
      this.game.viruses.splice(gameVirusesIndex, 1);
      this.game.gameObjects.splice(gameObjectsIndex, 1);
    }
  }, {
    key: "getSprite",
    value: function getSprite() {
      var frame = this.frame;

      switch (this.color) {
        case "red":
          return VIRUS_SPRITES.red[frame];

        case "yellow":
          return VIRUS_SPRITES.yellow[frame];

        case "blue":
          return VIRUS_SPRITES.blue[frame];

        default:
          return VIRUS_SPRITES.none[frame];
      }
    }
  }, {
    key: "update",
    value: function update(timestamp) {
      if (!this.lastUpdated) this.lastUpdated = timestamp;

      if (timestamp - this.lastUpdated > this.frameLength) {
        this.frame = (this.frame + 1) % 2;
        this.lastUpdated = timestamp;
      }
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      var sprite = this.getSprite();
      ctx.drawImage(this.spritesheet, sprite[0], sprite[1], sprite[2], sprite[3], this.position.x, this.position.y, this.width, this.height);
    }
  }]);

  return Virus;
}();



/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map