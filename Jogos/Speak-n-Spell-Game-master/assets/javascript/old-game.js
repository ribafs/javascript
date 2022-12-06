// Javascript Game File

// declare variables
var keyPress = "";
var winCount = 0;
var loseCount = 0;
var guessCount = 0;
var randomWord = "";
var fillInTheBlank = ""
// var randomWordSplit = [];
var alreadyGuessedArray = [];
var charExists = false;
var playInProgress = false;

// sound variables
var soundPlay = document.createElement('audio');

// ELEMENT VARIABLES
var feedbackID = document.getElementById("feedback");
var winsID = document.getElementById("wins");
var lossesID = document.getElementById("losses");
var guessCountID = document.getElementById("guessCount");
var fillInTheBlankID = document.getElementById("fillInTheBlank");
var alreadyGuessedID = document.getElementById("alreadyGuessed");

// word array
var wordList = ['html', 'css', 'alphabet', 'prestige', 'javascript'];

// sound function
function playSound(clip) {
    switch (clip) {
        case "melody":
            randomNum = Math.floor(Math.random() * 4 + 1);
            soundFile = "assets/sounds/MELODY-" + randomNum + ".wav";
            console.log(soundFile);
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
}

// Letter Sound function
function playLetter(clip) {
    var letterSound = "assets/sounds/Alphabet/" + clip.toUpperCase() + ".wav";
    console.log(letterSound);
    soundPlay.src = letterSound;
    soundPlay.play();
}

// PUSH char to array function
function pushAlreadyGuessed(x) {
    console.log("You chose: " + x);
    alreadyGuessedArray.push(x);
    alreadyGuessedID.textContent = alreadyGuessedArray;
}

// create random word function
function randomize() {
    // reset already guessed letters
    alreadyGuessedArray = [];
    alreadyGuessedID.textContent = "NONE";

    // pick a random word from the wordList
    randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    console.log("random word: " + randomWord);

    // assign randomWord length to guessCount
    guessCount = randomWord.length;
    guessCountID.textContent = guessCount;

    // create a variable with underlines and spaces.
    fillInTheBlank = '';
    for (i=0; i<guessCount; i++) {
        fillInTheBlank += '_';
    }
    fillInTheBlank = fillInTheBlank.split('').join(' ');

    console.log("Word array: " + fillInTheBlank);
    fillInTheBlankID.textContent = fillInTheBlank;
}

// play game button pickes a new word but keeps score.
function playGame() {
    playSound("melody");
    guessCount = 0;
    randomWord = "";
    playInProgress = true;
    randomize();
}

// reset score
function resetGame() {
    playSound("melody");
    winCount = 0;
    loseCount = 0;
    guessCount = 0;
    randomWord = "";
    wordArray = [];
    guessArray = [];
    playInProgress = true;
    randomize();
}

// Event Listener for Play button
document.getElementById("playButton").addEventListener("click", function(){
    playGame();
});

// Event Listener for Reset button
document.getElementById("resetButton").addEventListener("click", function(){
    resetGame();
});

// Wait for player input
    document.onkeypress = function(event) {
    userKey = event.key.toLowerCase();
    // console.log(event.key);
    console.log(event.keyCode);
    
    if (playInProgress) {
    // VALIDATION: use ONLY alphabet input based on keycode
    if ((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122)) {

        // Push userKey to guessedArray
        pushAlreadyGuessed(userKey);

        // See if userKey is in the wordArray using a for loop
            for (i=0; i < randomWord.length; i++) {
                // if user key matches a character in the array then replace underline with character in the guessAray.
                if (userKey === randomWord.charAt(i)) {
                    var blankArray = fillInTheBlank.split(' ');
                    blankArray[i] = userKey;
                    joinedBlank = blankArray.join('');
                    fillInTheBlank = blankArray.join(' ');
                    fillInTheBlankID.textContent = fillInTheBlank;
                    charExists = true;

                    // Player WINS if joinedBlank is equal to wordArray
                    console.log(joinedBlank, randomWord);
                    if (joinedBlank === randomWord) {
                    feedbackID.textContent = "YOU WIN - PLAY AGAIN?";
                    playSound("win");
                    winCount++;
                    winsID.textContent = winCount;
                    playInProgress = false;

                    } else {
                    // play letter sound
                    playLetter(userKey);
                    }
                }
            }
            // If there was no char then decrement the count and see if guessCount is zero
            if (charExists === false) {
                guessCount--;
                guessCountID.textContent = guessCount;
                if (guessCount === 0) {
                feedbackID.textContent = "YOU LOSE - PRESS PLAY TO PLAY AGAIN";
                playSound("lose");
                loseCount++;
                lossesID.textContent = loseCount;
                playInProgress = false;
                } 
                else {
                // play letter sound
                playLetter(userKey);
                }
            }
            // reset charExists to FALSE
            if (charExists === true) {
                charExists = false;
            }

        }
    }

};
