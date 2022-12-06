# DR. MARIO JS

![Screenshot 2019-11-12 13 23 25](https://user-images.githubusercontent.com/52052943/68712487-af03b600-0550-11ea-8b34-9feb57a93bc0.png)

[live link](https://kedholmmoch.github.io/Dr-Mario-JS/)

Dr. Mario JS is a falling-block puzzle game, a clone of the classic Nintendo game, Dr. Mario.     
The goal of the game is to eliminate all of the colored viruses in any given level
by dropping colored blocks to form a series of four or more pills/viruses of the same color.
The player has beaten the stage once all the viruses have been eliminated.


### INSTRUCTIONS

In order to start the game, the user must choose a level (between 0 and 20) and a speed
(between 0 and 5), and then click the "START" button.

After the bottle has generated with colored viruses inside, the game will drop one pill
at a time, each pill made up of two different (or similarly) colored doses. The player
may navigate the pill around the board by:

- moving left (`J` key or left arrow key);

- moving right (`L` key or right arrow key);

- flipping pill to left (`S` key);

- flipping pill to right (`F` key);

- speeding the pill's drop (`K` key or down arrow key);


The pill will drop one space on the board at a regular interval, depending on the speed. 
If the pill hits a virus, another pill, or the bottom of the board, if it is not moved before 
the end of the regular drop interval, the pill is frozen in place. 
When the board has settled, the board introduces a new falling pill.


### TECHNOLOGIES

- JavaScript
- HTML5 Canvas


### FEATURES AND IMPLEMENTATION

All features in this game were implemented using native JavaScript DOM manipulation 
and HTML5 canvas. No additional libraries were used.

Dr. Mario JS has been written with an object-oriented approach in mind; to that end, the game's logic and
code has been separated into a number of classes, each keeping track of their own slices of game logic:

- `Game` (tracks level, speed, and score, as well as individual the game objects drawn to the game canvas);
- `Board` (populates grid with `Virus`es; tracks grid positions of all `Virus`es and `Dose`s (including `Pill`s));
- `Pill` (tracks individual pills, their colors and orientation, and has methods to move, drop, and delete `Pill`s);
- `Dose` (method to position and drop 'single' `Dose`s (NB: all `Pill`s are recorded on `Board`-grid as `Dose`s));
- `Virus` (tracks each virus' color and position, and includes methods to update/animate, draw, and delete);
- `Soundboard` (sounds and background music); `Mario` (Dr. Mario sprites and animation); `Input` (keyboard input);

#### Populating the Board

When the user clicks the start button to begin a new game, an event listener triggers the creation
of a new game object which takes its `level` and `speed` arguments from the current `value` displayed 
on the level- and speed- range-slide elements.

The game constructor creates a new instance of `Board` (an 8 x 16 grid represented by a 2D array) 
and then calls on it the `Board#populateViruses` method:

```javascript
populateViruses() {
  let total = this.numberViruses;  // calculated in constructor as 4 + (level * 1)
  let added = 0;

  // only add viruses to the uppermost rows if the level is very high
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
```

The array of `Virus`es returned by the function is then saved in the `Game` class as `this.viruses`.


#### Deleting four or more in a row

Part of the core functionality of the game is the board's ability to detect four or more in a row
of the same color object each time the user places a new pill. This is achieved through the `Board`'s
`findFours` function. Beginning from the top left corner, the function runs both the `Board#CheckFourDown`
and `Board#CheckFourAcross` functions, which return an array of continguous coordinates if found:

```javascript
checkFourDown(coords) {
  let [row, column] = coords;

  let sqNumber = 1;             // the current number of squares of the same color in a row
  let squares = [coords];       // an array of coordinates to track the above-mentioned squares

  // Both Viruses and Doses both have color attributes
  let color = this.grid[row][column].color;     

  let currRow = row;
  let sameColor = true;

  while (sameColor && currRow <= 14) {
    currRow += 1;                                  // get next row down
    let currSquare = this.grid[currRow][column];   // returns next square's object, OR null

    if (currSquare) {                                     // if next sqr down contains object
      let currColor = this.grid[currRow][column].color;   // color of object in next sqr

      if (currColor === color) {          // if color is same as starting sqr's color
        sqNumber += 1;                        // increase the sqr count, and
        squares.push([currRow, column]);      // push square into array
      } else {
        sameColor = false;                // break out of loop
      }
    } else {
      sameColor = false;                  // break out of loop
    }
  }

  if (sqNumber >= 4) {        // only return array of coords if there are four or more in a row
    return squares;    
  } else {
    return false;
  }
}
```

Each time the `checkFourDown` and `checkFourAcross` return an array, they are concatenated to `findFours`'
own result array, which is returned to a `clearFours` function after duplicate coordinates are removed.


#### 'Applying gravity' after viruses and pills are removed from board

In Nintendo's Dr. Mario, after a sequence of four or more of the same color is removed from the board,
the loose doses subsequently fall as far down in the board as "gravity" will allow -- that is, until
they hit another stationary object on the board, whether pill or virus. Additionally, the doses do not 
fall immediately, but drop one space at a time until they hit the bottom.

This provided a challenge, then, in that a function was needed that would move the "falling" pieces
one square at a time down the board until they could not fall any farther, while also *not* introducing
the next pill into the game until this gravity-induced falling had been completed.

The solution was to create an `applyGravity` method which returned a promise, in order that a chain of
`.then`s and `applyGravity` methods could be executed until no more sequences of four-in-a-row were
achieved, and there would be no need for the `applyGravity` method to run again. 
The `applyGravity` method itself employs a while loop dependent on a variable `canFall`, which is only 
set to `false` when the `Pill#applyGravity` and `Dose#applyGravity` do not result in any object dropping.

```javascript
applyGravity() {
  return new Promise((resolve, reject) => {
    var canFall = false;

    for (let row = 14; row >= 0; row--) {
      for (let col = 0; col <= 7; col++) {    // iterate through each square starting from bottom
        let currItem = this.grid[row][col];
        let applied;                

        if (currItem instanceof Dose && currItem.pill) {
          let pill = currItem.pill;
          applied = pill.applyGravity();     // if gravity was applied -- Pill#applyGravity returns
          if (applied) canFall = true;       // true/false -- then set canFall to true..
        } else if (currItem instanceof Dose && currItem.single) {
          applied = currItem.applyGravity();
          if (applied) canFall = true;
        }
      }
    }

    if (canFall) {                                // if another round of falling may be needed, then...
      window.setTimeout(() => {                   // ... wait a quarter of a second before ...
        this.applyGravity().then(() => {          // ...calling the method again;
          resolve(true);                      // the fact that Board#applyGravity is a Promise means it
        })                                    //  won't be resolved until the method has run enough times
      }, 250);       
    } else {
      window.setTimeout(() => {               // if no more gravity is needed, resolve the promise
        resolve(true);
      }, 100);
    }
  })
}
```
When the chain of calls to `Board#applyGravity` are completed, the `Pill#freeze` method then determines
whether the game is lost, won, or whether a new pill is needed -- but the use of the promise chain
ensures that this determination is not made before the effects of 'gravity' have come to an end.


#### Displaying pills and doses onto the canvas

All elements on the game board -- `Virus`es, `Pill`s and `Dose`s -- have both a `coordinates` attribute
(the [row, column] coordinates on the game `Board`'s grid) as well as a `position` attribute, which 
gives the starting x- and y-coordinates of the element to be drawn on the HTML canvas. The position of 
all elements is recorded on the `Board`, and, before being drawn, each element converts `coordinates` 
to `position` by way of the `Board#getPosition` method:

```javascript
getPosition(coords) {
    let margin = this.margin;     // margin is originally set at a constant of 3 (pxx) in drmario.js
    let bottleSide = 24;          // pixels in the wall of the virus' bottle on the canvas (x-adjustment)
    let bottleTop = 115;          // pixels in the top of the virus bottle on the canvas (y-adjustment)
    let [yCoord, xCoord] = coords;

    let xPos = margin + bottleSide + (xCoord * (this.squareWidth + margin));
    let yPos = margin + bottleTop + (yCoord * (this.squareHeight + margin));

    return { x: xPos, y: yPos };      // passes on a POJO; works for all elements
  }
```

The rendering of the pills onto the HTML canvas element involves the use of a spritesheet; a class
constant in the `Pill` class keeps track of the x-coord, y-coord, width, and height in pixels on the
spritesheet in a large POJO:

```javascript
const COLOR_SPRITES = {
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
  }
}
```

The `Pill` class' `draw` function then makes use of the `COLOR_SPRITES` object in the
`Pill#getSprites` function, which return the sprites to be displayed to the `draw` function:

```javascript
getSprites() {
    let left, right, top, bottom;
    let c0 = this.c0;           // first color on the pill (set in the constructor)
    let c1 = this.c1;           // second color on the pill (set in the constructor)

    if (this.rotation === 0) {
      left = COLOR_SPRITES.left[c0];
      right = COLOR_SPRITES.right[c1];
      return { left: left, right: right };
    } else if (this.rotation === 180) {
      left = COLOR_SPRITES.left[c1];
      right = COLOR_SPRITES.right[c0];
      return { left: left, right: right };
    } else if (this.rotation === 90) {
      top = COLOR_SPRITES.top[c0];
      bottom = COLOR_SPRITES.bottom[c1];
      return { top: top, bottom: bottom };
    } else if (this.rotation === 270) {
      top = COLOR_SPRITES.top[c1];
      bottom = COLOR_SPRITES.bottom[c0];
      return { top: top, bottom: bottom};
    }
  }
```

The sprites to be displayed are then passed on to the `Pill#drawHorizontal` and
`Pill#drawVertical` functions.


### FUTURE FEATURES

1. Find and add appropriate sounds for flipping pills, dropping pills, disappearing viruses, and point combinations
2. Adjust `Board#populateBoard` function to put no more than two of the same color in a row when populating
3. Have speed of stage automatically increase as time goes on (every 30 sec./45 sec. or so)
4. Upon doses and viruses disappearing, display empty pill-square with audio before applyGravity function
5. Animate Dr. Mario to throw pill upon loading next pill into game area
6. Implement local and global high scores


##### LEGAL

Art and music assets used in this project are for educational purposes only. Art and music assets are property of Nintendo.

The Dr. Mario sprites were retrieved courtesy of Black Squirrel and Dr. Nitro via mariouniverse.com.

The Dr. Mario theme and 'Fever' audio files were retrieved courtesy of Indogutsu, Slick Mandela, and nensondubois via zophar.net.