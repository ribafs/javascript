# Speak N Spell Style Word Guessing Game
This is my JavaScript version of the old Speak N Spell electronic game complete with sound!

## How to Play
Press PLAY to start. The player presses a key and will determine if it is in the word or not. 
The player wins if they get all the characters before guess count reaches 0 and increases their win count by 1 and a letter is revealed. The player loses if guess count reaches zero and 1 is added to the lose count.
Press RESET to reset the win and lose count.
The game plays a melody when PLAY or RESET is clicked. When a letter key is pressed a letter sound is played.


Here is the folder structure:
```
├── assets
|  ├── css
|  |  └── style.css
|  ├── images
|  └── javascript
|     └── game.js
└── index.html
```


## JavaScript Psuedocode

The JavaScript code was written in a separate JavaScript file called `game.js` 

* Declare Global Variables
    * Create variables for keyPress, win count, lose count, guessCount, randomWord, fillInTheBlank lines.
    * Create arrays for already guessed letters and a word list.

* Create an Object called `wordGame`
* Create object methods
    * randomize - picks a random word from the wordList array
    * playSound - plays win, lose, or random melody based on a passed argument
    * playLetter - plays a letter sound.
    * playGame - starts the game by running the randomize method
    * resetGame - resets the score
    * pushAlreadyGuessed - pushes already pressed keys into an array
    * validateKey - if the key that was pressed is a letter then it will return true, else return false
    * findMatch - runs a for loop by splitting the randomWord into a local array, then compares the user key with each character. 
        * If there's a match then play a letter sound.
            * if all the characters are found the player wins and a melody is played. The win count increases by 1.
        * Else if no character is found then the guess is reduced by 1.
            * if remaining guesses are 0 then the player loses and lose count increases by 1.




## Notes
I started with functions and made sure they worked. I then created the wordGame object and made the functions as object methods. 
I used specialized webfonts from the Google and Fontlibrary.com.
