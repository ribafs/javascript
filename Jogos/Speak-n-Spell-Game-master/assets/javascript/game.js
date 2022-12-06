// GAME OBJECT FILE

// GLOBAL VARIABLES
let keyPress = "";
let winCount = 0;
let loseCount = 0;
let guessCount = 0;
let randomWord = "";
let fillInTheBlank = "";
// let randomWordSplit = [];
let alreadyGuessedArray = [];
let charExists = false;
let playInProgress = false;

// sound variables
const soundPlay = document.createElement("audio");
soundPlay.volume = 0.25;
// jQuery Audio
// var soundPlay = $("<audio/>");
// $("body").append(soundPlay);
// soundPlay.attr("volume", 0.25);

// ELEMENT VARIABLES
const feedbackID = document.getElementById("feedback");
const winsID = document.getElementById("wins");
const lossesID = document.getElementById("losses");
const guessCountID = document.getElementById("guessCount");
const fillInTheBlankID = document.getElementById("fillInTheBlank");
const alreadyGuessedID = document.getElementById("alreadyGuessed");

// word list array
const wordList = [
  "html",
  "css",
  "alphabet",
  "prestige",
  "javascript",
  "jquery",
  "grid",
  "flexbox",
  "coding",
  "developer",
  "programmer",
  "canvas",
];

// WORD GAME OBJECT
const wordGame = {
  // Pick random word from wordList
  randomize: function () {
    // reset already guessed letters
    alreadyGuessedArray = [];
    alreadyGuessedID.textContent = "NONE";

    // pick a random word from the wordList
    randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    // console.log("random word: " + randomWord);

    // assign randomWord length to guessCount
    guessCount = 7;
    // guessCount = randomWord.length;
    guessCountID.textContent = guessCount;

    // create a variable with underlines and spaces.
    fillInTheBlank = "";
    for (i = 0; i < randomWord.length; i++) {
      fillInTheBlank += "_";
    }
    fillInTheBlank = fillInTheBlank.split("").join(" ");

    // console.log("Word array: " + fillInTheBlank);
    fillInTheBlankID.textContent = fillInTheBlank;
  },

  // Play a sound
  playSound: function (melody) {
    switch (melody) {
      case "melody":
        randomNum = Math.floor(Math.random() * 4 + 1);
        soundFile = "assets/sounds/MELODY-" + randomNum + ".wav";
        // console.log(soundFile);
        break;
      case "win":
        soundFile = "assets/sounds/YOU-WIN.wav";
        break;
      case "lose":
        soundFile = "assets/sounds/I-WIN.wav";
        break;
      default:
        break;
    }
    soundPlay.src = soundFile;
    soundPlay.play();
  },

  // Play Letter Sound function
  playLetter: function (letter) {
    // callback another audio after first audio is played
    var letterSound = "assets/sounds/Alphabet/" + letter.toUpperCase() + ".wav";
    // console.log(letterSound);
    soundPlay.src = letterSound;
    soundPlay.play();

    // callback loops forever, will comment out for now.
    // soundPlay.onended = function() {
    //     wordGame.playSound("melody");
    // }
  },

  // start game picks a new word but keeps score.
  playGame: function () {
    // call method within the object
    this.playSound("melody");
    var guessCount = 0;
    var randomWord = "";
    playInProgress = true;
    this.randomize();
    feedbackID.textContent = "Press Play for a new word.";
  },

  // reset game and score
  resetGame: function () {
    this.playSound("melody");
    winCount = 0;
    loseCount = 0;
    guessCount = 0;
    randomWord = "";
    winsID.textContent = winCount;
    lossesID.textContent = loseCount;
    wordArray = [];
    guessArray = [];
    playInProgress = true;
    this.randomize();
  },

  // PUSH char to array function
  pushAlreadyGuessed: function (letter) {
    // console.log("You chose: " + letter);
    alreadyGuessedArray.push(letter);
    alreadyGuessedID.textContent = alreadyGuessedArray.join(", ");
  },

  // validate keypress
  validateKey: function (code) {
    if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
      return true;
    } else {
      return false;
    }
  },

  // does pressed key match any letter in the random word?
  findMatch: function (userkey) {
    // run a for loop to compare each letter and set charExists to True
    for (i = 0; i < randomWord.length; i++) {
      if (userkey === randomWord.charAt(i)) {
        blankArray = fillInTheBlank.split(" ");
        blankArray[i] = userkey;
        revealedLetters = blankArray.join("");
        fillInTheBlank = blankArray.join(" ");
        fillInTheBlankID.textContent = fillInTheBlank;
        charExists = true;

        //play melody sound after playing letter sound
        this.playLetter(userKey);
        // this.playLetter
        // Player WINS if joinedBlank is equal to wordArray
        // console.log(revealedLetters, randomWord);
        if (revealedLetters === randomWord) {
          feedbackID.textContent = "YOU WIN - PLAY AGAIN?";
          this.playSound("win");
          winCount++;
          winsID.textContent = winCount;
          playInProgress = false;
        }
      }
    }

    // if no match then reduce # of guesses by 1
    if (!charExists) {
      guessCount--;
      guessCountID.textContent = guessCount;
      this.playLetter(userKey);
      if (guessCount === 0) {
        feedbackID.textContent = "YOU LOSE - PLAY AGAIN?";
        this.playSound("lose");
        loseCount++;
        lossesID.textContent = loseCount;

        // display the word
        fillInTheBlankID.textContent = randomWord.split("").join(" ");

        // stop player key input
        playInProgress = false;
      }
    }

    // reset charExists to FALSE
    if (charExists) {
      charExists = false;
    }
  },
};

// Event Listener for Play button
$("#playButton").on("click", function () {
  wordGame.playGame();
});
// document.getElementById("playButton").addEventListener("click", function () {
//   wordGame.playGame();
// });

// Event Listener for Reset button
$("#resetButton").on("click", function () {
    wordGame.resetGame();
});
// document.getElementById("resetButton").addEventListener("click", function () {
//     wordGame.resetGame();
// });

// Event Listener for on-screen buttons
$(document).on("click", ".letter", function () {
  // alert("Pressed");
  userKey = $(this).attr("value");
  if (playInProgress) {
    // continue of keypress is a valid letter
    if (alreadyGuessedArray.length === 0) {
      wordGame.pushAlreadyGuessed(userKey);
      wordGame.findMatch(userKey);
    } else if (alreadyGuessedArray.indexOf(userKey) === -1) {
      wordGame.pushAlreadyGuessed(userKey);
      wordGame.findMatch(userKey);
    }
    // wordGame.findMatch(userKey);
  }
});

// add keyboard input eventlistner
// document.addEventListener('keypress', keyboardInput);

// Get Player Input from Document
$(document).on('keypress', function (event) {
  userKey = event.key.toLowerCase();
//   console.log(event.keyCode); // displays a coe number
//   console.log(event.key); // displays what key was pressed

  // if gameplay is in progress run the game
  if (playInProgress) {
    // continue of keypress is a valid letter
    if (wordGame.validateKey(event.keyCode)) {
      if (alreadyGuessedArray.length === 0) {
        wordGame.pushAlreadyGuessed(userKey);
        wordGame.findMatch(userKey);
      } else if (alreadyGuessedArray.indexOf(userKey) === -1) {
        wordGame.pushAlreadyGuessed(userKey);
        wordGame.findMatch(userKey);
      }
      // wordGame.findMatch(userKey);
    }
  }
});
