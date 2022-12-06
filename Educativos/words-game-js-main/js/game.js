import {
	getRandomWord, 
	getSequenceLetters
} from './words.js'

const html = {
  buttons: document.querySelectorAll(".button"),
  wordPanel: document.querySelector(".word")
};

const state = {
	gameStarted: false,
	letterIndex: 0,
	word: ""
};

const runAnimation = {
  error: (element) => {
    element.classList.add("error");

    element.addEventListener("animationend", () => {
      element.classList.remove("error");
    });
	},
	up: () => {
		html.buttons.forEach(button => {
			button.classList.add('up')
			
			button.addEventListener('animationend', () => {
				button.classList.remove('up');
			})
		})
	}
};

const resetFunctions = {
	resetButtonsClasses() {
		html.buttons.forEach((button) => {
			const containsClass = button.classList.contains("correct");
	
			if (containsClass) button.classList.remove("correct");
		});
	},

	resetWordClasses() {
		const letters = html.wordPanel.querySelectorAll("span");

		letters.forEach((letter) => {
			const containsClass = letter.classList.contains("correct");

			if (containsClass) letter.classList.remove("correct");
		});
	}
}

function populateButtonsWithLetters(sequence) {
  html.buttons.forEach((button, index) => {
    button.textContent = sequence[index];
  });
}

function createPanel(wordSpread) {
	runAnimation.up();
	
  html.wordPanel.innerHTML = "";

  wordSpread.forEach(letter => {
    const letterElement = document.createElement("span");

    letterElement.textContent = letter;

    html.wordPanel.appendChild(letterElement);
  });
}

function wordHasLetter(letter) {
	const word = [...state.word];

	return word[state.letterIndex] === letter;
}

function handleClick({ target: clickedButton }) {
	if(state.gameStarted) wordHasLetter(clickedButton.textContent) 
		? handleHit(clickedButton)
		: handleError(clickedButton)
}

function handleHit(clickedButton) {
	if(state.letterIndex + 1 === state.word.length) {
		nextLevel()

		return
	}

	const letterInPanel = html.wordPanel.children[state.letterIndex];
	
	letterInPanel.classList.add("correct");
	clickedButton.classList.add("correct");

	state.letterIndex += 1;
}

function handleError(element) {
	runAnimation.error(element);
	
	state.letterIndex = 0;
	
	resetFunctions.resetButtonsClasses();
	resetFunctions.resetWordClasses();
}

function nextLevel() {
	state.letterIndex = 0;
	
	resetFunctions.resetButtonsClasses();
	resetFunctions.resetWordClasses();

	start();
}

function start() {	
	const word = getRandomWord();
	const sequence = [...word.toUpperCase(), ...getSequenceLetters(word)]
		.sort( (foo, bar) => 0.5 - Math.random());

	state.word = word.toUpperCase();

	populateButtonsWithLetters(sequence);
	createPanel([...word]);
}

export default function handleStart() {
	if(!state.gameStarted) {
		html.buttons
			.forEach(button => button.addEventListener("click", handleClick));
		
		start();

		state.gameStarted = true;
	}
}