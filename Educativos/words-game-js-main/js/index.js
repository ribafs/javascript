import handleStart from './game.js';

document.addEventListener("keypress", event => {
	event.key === 'Enter' && handleStart();
});