import Game from './game.js'

function createEventListeners() {
	const buttons = document.querySelectorAll(".button")

	for (const button of buttons) {
		button.addEventListener('click',event => window.game.handles.click(event))
	}

	document.addEventListener('keypress', event => window.game.handles.keypress(event))
}

function createButtons() {
	const grid = document.querySelector("#buttons-grid")

	for(let i = 0, limit = 16; i < limit; i += 1) {
		const newButton = document.createElement("div")
		newButton.className = "button"
		newButton.dataset.index = i

		grid.appendChild(newButton)
	}
}

window.onload = () => {
	
	const title = document.querySelector("#game > h1")
	title.textContent = "PRESS ENTER TO PLAY"
	createButtons()
	createEventListeners()
	
	window.game = new Game

}