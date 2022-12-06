import Virus from './virus';
import Dose from './dose';

const COLORS = ["red", "yellow", "blue"];

export default class Board {
  constructor(game) {
    this.width = 8;
    this.height = 16;
    this.game = game;
    this.margin = game.margin;
    this.squareWidth = game.squareWidth;
    this.squareHeight = game.squareHeight;
    this.level = game.level;  // we'll do levels 0 through 20
    this.numberViruses = 4 * (this.level + 1);

    this.grid = this.createEmptyGrid();
    this.viruses = [];  // this will only be updated once; game keeps track of viruses
  }

  // methods for populating board at beginning of game

  createEmptyGrid() {
    const grid = [...Array(this.height)]
      .map(row => Array(this.width).fill(null));

    return grid;
  }

  populateViruses() {
    let total = this.numberViruses;  // calculated in constructor as 4 + (level * 4)
    let added = 0;

    // only want to add viruses to uppermost rows if the level is very high
    let rowAdjustment = 4 - Math.floor(this.level / 5);  // level btwn 0 and 20

    let lowestRow = 3 + rowAdjustment;
    let rowRange = 16 - lowestRow;

    while (added < total) {
      let row = Math.floor(Math.random() * rowRange) + lowestRow;
      let column = Math.floor(Math.random() * this.width);
      // COLORS is a class constant, an array: ["red", "yellow", "blue"]
      let color = COLORS[Math.floor(Math.random() * 3)];

      if (this.grid[row][column] === null) {         // only fill empty spaces
        let newVirus = new Virus({
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
  }

  // methods for determining position, finding empty postns, saving pill to board

  getPosition(coords) {
    let margin = this.margin;
    let bottleSide = 24;
    let bottleTop = 115;
    let [yCoord, xCoord] = coords;

    let xPos = margin + bottleSide + (xCoord * (this.squareWidth + margin));
    let yPos = margin + bottleTop + (yCoord * (this.squareHeight + margin));

    return { x: xPos, y: yPos };
  }

  isEmpty(coords) {   // coords is an array in form of [row, column]
    let [row, column] = coords;

    if (column < 0 || column > 7) return false;   // outside of board
    if (row < 0 || row > 15) return false;        // outside of board

    if (this.grid[row][column] === null) {
      return true;
    } else {
      return false;
    }
  }

  boardFull() {
    if (this.grid[0][3] || this.grid[0][4]) return true;
    return false;
  }

  recordPill(pill) {
    let [row, column] = pill.coordinates;
    let rotation = pill.rotation;
    let orientation = pill.orientation;

    let c0 = pill.c0;
    let c1 = pill.c1;

    if (orientation === "horizontal") {
      let leftCoord = [row, column];
      let rightCoord = [row, column + 1];

      if (rotation === 0) {
        this.grid[row][column] = new Dose({
          color: c0,
          coordinates: leftCoord,
          game: this.game,
          pill: pill,
          otherHalf: rightCoord
        });
        this.grid[row][column + 1] = new Dose({
          color: c1,
          coordinates: rightCoord,
          game: this.game,
          pill: pill,
          otherHalf: leftCoord
        });

      } else if (rotation === 180) {
        this.grid[row][column] = new Dose({
          color: c1,
          coordinates: leftCoord,
          game: this.game,
          pill: pill,
          otherHalf: rightCoord
        });
        this.grid[row][column + 1] = new Dose({
          color: c0,
          coordinates: rightCoord,
          game: this.game,
          pill: pill,
          otherHalf: leftCoord
        });
      }
    } else if (orientation === "vertical") {
      let topCoord = [row - 1, column];
      let bottomCoord = [row, column];

      if (rotation === 90) {
        this.grid[row -1][column] = new Dose({
          color: c0,
          coordinates: topCoord,
          game: this.game,
          pill: pill,
          otherHalf: bottomCoord
        });
        this.grid[row][column] = new Dose({
          color: c1,
          coordinates: bottomCoord,
          game: this.game,
          pill: pill,
          otherHalf: topCoord
        });

      } else if (rotation === 270) {
        this.grid[row - 1][column] = new Dose({
          color: c1,
          coordinates: topCoord,
          game: this.game,
          pill: pill,
          otherHalf: bottomCoord
        });
        this.grid[row][column] = new Dose({
          color: c0,
          coordinates: bottomCoord,
          game: this.game,
          pill: pill,
          otherHalf: topCoord
        });
      }
    }
  }

  // methods for detecting 4+ of one color in a row (vert. or horiz.)

  checkFourDown(coords) {
    let [row, column] = coords;

    let sqNumber = 1;
    let squares = [coords];
    let color = this.grid[row][column].color;

    let currRow = row;
    let sameColor = true;

    while (sameColor && currRow <= 14) {
      currRow += 1;
      let currSquare = this.grid[currRow][column];

      if (currSquare) {
        let currColor = this.grid[currRow][column].color;
  
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

  checkFourAcross(coords) {
    let [row, column] = coords;

    let sqNumber = 1;
    let squares = [coords];
    let color = this.grid[row][column].color;

    let currCol = column;
    let sameColor = true;

    while (sameColor && currCol <= 6) {
      currCol += 1;
      let currSquare = this.grid[row][currCol];

      if (currSquare) {
        let currColor = this.grid[row][currCol].color;

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

  coordInArray(coord, array) {
    return array.some(ele => ele[0] === coord[0] && ele[1] === coord[1]);
  }

  findFours() {
    let fours = [];
    
    for (let row = 0; row <= 15; row++) {
      for (let col = 0; col <= 7; col++) {
        let coords = [row, col];

        if (!this.isEmpty(coords)) {
          let downResult = this.checkFourDown(coords);
          let acrossResult = this.checkFourAcross(coords);

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

    let result = [];   // need to eliminate duplicate coordinates from result

    fours.forEach(coord => {
      if (!this.coordInArray(coord, result)) {
        result.push(coord);
      }
    });

    return result;
  }

  // isVirus(coord) {

  // }

  deleteFromBoard(coordArray, scoreMultiplier = 0) {
    let that = this;

    var virusCount = 0;

    coordArray.forEach(coord => {
      let [row, column] = coord;
      let item = that.grid[row][column];

      if (item instanceof Virus) virusCount += 1;

      if (item instanceof Dose && item.pill) {
          let pill = item.pill;
          let otherHalfCoord = item.otherHalf;

          let [doseRow, doseCol] = otherHalfCoord;
          let dose = that.grid[doseRow][doseCol];

          // delete pill
          pill.deleteFromGame();
          dose.pill = null;
          dose.otherHalf = null;

          // add dose to game to display
          dose.single = true;
          dose.addToGame();
      } else {
        item.deleteFromGame();
      }

      that.grid[row][column] = null;
    });

    if (virusCount > 0) {
      let points = Math.pow(3, virusCount) * 100 + scoreMultiplier;
      if (points > 5000) points = 5000;
      this.game.score += points;
    }
  }

  applyGravity() {
    return new Promise((resolve, reject) => {
      var canFall = false;
  
      for (let row = 14; row >= 0; row--) {
        for (let col = 0; col <= 7; col++) {
          let currItem = this.grid[row][col];
          var applied;
  
          if (currItem instanceof Dose && currItem.pill) {
            let pill = currItem.pill;
            applied = pill.applyGravity();
            if (applied) canFall = true;
          } else if (currItem instanceof Dose && currItem.single) {
            applied = currItem.applyGravity();
            if (applied) canFall = true;
          }
        }
      }
  
      if (canFall) {
        window.setTimeout(() => {
          this.applyGravity().then(() => {
            resolve(true);
          })
        }, 250);
      } else {
        window.setTimeout(() => {
          resolve(true);
        }, 100);
      }
    })

  }

  clearFours(scoreMultiplier = 0) {
    let toClear = this.findFours();

    if (toClear) {
      this.deleteFromBoard(toClear, scoreMultiplier);
    } 
  }

}