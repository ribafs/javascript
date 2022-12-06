class Game {
	constructor() {
		this.canPlay = false
		this.started = false
		this.sequenceGame = []
		this.sequencePlayer = []
		this.droppedButtons = []
		this.difficulty = 0
		this.currentLevel = 1
		this.timers = []
		this.buttons = document.querySelectorAll(".button")
		this.audios = {
			gameOver: new Audio("./assets/wrong.mp3")
		}
}
	
	start() {
		this.canPlay = true
		this.started = true
		
		this.output(`Level ${this.currentLevel}`)
		this.timers.push( setTimeout(() => this.createSequence(), 750) )

		console.log("> GAME STARTED")
	}

	finish() {
		
		this.canPlay = false
		this.started = false
		this.currentLevel = 1
		this.difficulty = 0

		this.animations.gameOver()	
		this.sounds.gameOver()
		
		this.resetValues()

		this.output("Game Over")

		setTimeout(() => this.output("PRESS ENTER TO PLAY"), 1000)

		console.log("> GAME OVER")
	}

	createSequence() {
		
		function createUniqueSequence(limit) {
			let randomSequence = []
			
			createRandomNumber(randomSequence)

			function createRandomNumber(array) {
				if (array.length === limit) return randomSequence

				const randomNumber = Math.floor(Math.random() * 16)
				
				if (array.includes(randomNumber)) createRandomNumber(array)
				else { 
					randomSequence.push(randomNumber) 
					createRandomNumber(array)
				}
			}

			return randomSequence
		}

		function getDifficulty(thisDifficulty) {
			let difficulty = thisDifficulty

			if (difficulty >= 3) { 
				difficulty = 7

				return difficulty
			}
				
			if (difficulty === 0) difficulty = 2
			else difficulty = 2 + thisDifficulty

			return difficulty
		}
		
		const difficulty = getDifficulty(this.difficulty)

		const randomSequence = createUniqueSequence(difficulty)
			
		for (const number of randomSequence) {
			this.sequenceGame.push(number)
		}

		this.animations.button.sequenceIndicator(randomSequence)
	}

	checkSequence() {
		const currentPlay = this.sequencePlayer.length - 1
		const indexPlayed = this.sequencePlayer[currentPlay]

		this.canPlay = false

		if (this.sequenceGame.includes(indexPlayed)) {
			console.log("Correct!")

			this.dropButton(indexPlayed)
			this.canPlay = true

			if (this.sequencePlayer.length === this.sequenceGame.length) {
				this.newLevel()
			}

		} else this.finish()
	}

	includeSequence(indexToInclude) {
		this.sequencePlayer.push(indexToInclude)

		this.checkSequence()
	}

	dropButton(buttonIndex) {
		this.droppedButtons.push(buttonIndex)
		this.animations.button.drop(this.buttons[buttonIndex])
	}

	newLevel() {
		this.currentLevel += 1
		this.difficulty += 1

		this.timers.push( setTimeout(() => this.getDroppedButtons(this.droppedButtons), 500) )

		this.timers.push( setTimeout(() => { 
			this.output(`Level ${this.currentLevel}`)
			this.resetValues()
			
			this.createSequence()
		}, 2000) )
	}

	getDroppedButtons(droppedButtons) {
		this.animations.button.getDropped(droppedButtons)

		this.droppedButtons = []
	}

	resetValues() {
		this.timers.forEach(timeID => clearTimeout(timeID))

		this.timers = []

		this.sequenceGame = []
		this.sequencePlayer = []
		this.droppedButtons = []
	}
	
	output(message) {
		const outputDOM = document.querySelector("#game h1")

		outputDOM.textContent = message
	}

	handles = {
		click: event => {
			if(this.canPlay) {
				const indexOfClickedButton = Number(event.target.dataset.index)

				if(!this.sequencePlayer.includes(indexOfClickedButton)) {
					this.sequencePlayer.push(indexOfClickedButton)
					this.checkSequence()

					console.log(indexOfClickedButton)
				}
			}
		},

		keypress: event => {
			if (!this.started && event.key === "Enter") {
				this.start()
			}
		}
	}

	animations = {
		button: {
			sequenceIndicator: (sequence) => {
				const keyframes = [
					{opacity: 1},
					{opacity: 0},
					{opacity: 1},
				]

				const options = {
					duration: 750
				}

				for (const index of sequence) {
					this.buttons[index].animate(keyframes, options)
				}
			},

			drop: (element) => {
				const keyframes = [
					{
						visibility: 'visible',
						opacity: 1
					},
					{
						visibility: 'hidden',
						opacity: 0
					}
				]

				const options = {
					duration: 750,
					easing: "ease-in-out",
					fill: "forwards"
				}

				element.animate(keyframes, options)
			},

			getDropped: (buttons) => {
				const keyframes = [
					{
						visibility: 'hidden',
						opacity: 0
					},
					{
						visibility: 'visible',
						opacity: 1
					}
				]

				const options = {
					duration: 300,
					fill: "forwards",
					easing: "ease-out",
					iterations: 2
				}

				for (const buttonIndex of buttons) {
					this.buttons[buttonIndex].animate(keyframes, options)
				}
			}
		},

		gameOver: () => {
				const keyframes = [
					{
						visibility: 'hidden',
						opacity: 0
					},
					{
						visibility: 'visible',
						opacity: 1
					}
				]

				const options = {
					duration: 100,
					fill: "forwards",
					easing: "ease-out",
					iterations: 3
				}

				for (const button of this.buttons) {
					button.animate(keyframes, options)
				}
		}
	}

	sounds = {
		gameOver: () => this.audios.gameOver.play()
	}

}

export default Game;