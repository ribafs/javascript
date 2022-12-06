//---------------variables---------------------
const board = document.querySelector('#board');
const background = document.querySelector('#background');
const footer = document.querySelector("footer");
const victory_text = document.querySelector("#victory-text");

let overlays = Array.from(document.getElementsByClassName('overlay-text'));
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let timer = document.getElementById('time');
let ticker = document.getElementById('flips');
let matchedCards = [];
let totalClicks = 0;
let totalTime = 0;
let boardSize = 16;
let currentTheme = 'farm';
let farm = document.getElementById("farm");
let ballroom = document.getElementById("ballroom");
let game_info = document.getElementById("game-info");



farm.addEventListener("click", ()=>changeTheme('farm'));
ballroom.addEventListener("click", ()=>changeTheme('ballroom'));


const ballroomImages = ['book','carrage','castle','crown','dragon','girl','king','pot','princess','rainbow',
'rings','shoe','treasure','trees','unicorn','wizard'];
const farmImages = ['cat','chicken','cow','dog','duck','piggy','rabbit','sheep']
currentTheme === 'farm' ? images = [...farmImages.slice(0,8)] : images = [...ballroomImages.slice(0,16)];

images = [...farmImages.slice(0,8)];
let tempImages = [...images, ...images];
//--------------------------overlay------------------------------
overlays.forEach(overlay => {
	overlay.addEventListener('click', () => {
		overlay.classList.remove('visible');
		startNewGame();
		});
});
//----------------change size-----------------------------------
const changeTheme = (theme) => {
    if (theme === 'farm'){
        boardSize = 16;
        currentTheme = theme;
        images = farmImages.slice(0,boardSize/2);
        board.classList.add('farm');
        board.classList.remove('ballroom');
        background.classList.add('farm');
        background.classList.remove('ballroom');
        game_info.classList.add('farmstyle');
        game_info.classList.remove('ballroomstyle');
        footer.classList.add('farmstyle');
        footer.classList.remove('ballroomstyle');
        victory_text.classList.add('farmstyle');
        victory_text.classList.remove('ballroomstyle');

    } else { 
        boardSize = 32;
        currentTheme = theme;
        images = ballroomImages.slice(0,boardSize/2); 
        board.classList.add('ballroom');
        board.classList.remove('farm'); 
        background.classList.add('ballroom');
        background.classList.remove('farm'); 
   		game_info.classList.add('ballroomstyle');
        game_info.classList.remove('farmstyle');
        footer.classList.add('ballroomstyle');
        footer.classList.remove('farmstyle');
        victory_text.classList.add('ballroomstyle');
        victory_text.classList.remove('farmstyle');
    };   
    startNewGame();
}
//--------------Create Cards------------------------
const createCovers = (card) => {
    let cover = document.createElement('div');
    cover.classList.add('cover');
    card.appendChild(cover);
    let coverImg = document.createElement('img');
    coverImg.classList.add('back-face');
    coverImg.classList.add(currentTheme);
    if (currentTheme==='ballroom') {
    	coverImg.setAttribute('src', 'img/ballroom/fleur.png');
    } else coverImg.setAttribute('src', 'img/farm/sun.png');
    cover.appendChild(coverImg);
}

const addImage = (card) => {
    let rand = Math.floor(Math.random()*tempImages.length);
    let src = tempImages[rand];
    tempImages.splice(rand, 1);
    let image = document.createElement('img');
    image.classList.add('front-face');
    if (currentTheme==='ballroom') {
    image.setAttribute('src', 'img/ballroom/'+src+'.png');
    image.classList.add('ballroom');
	} else {image.setAttribute('src', 'img/farm/'+src+'.png');
	image.classList.add('farm');}
    card.appendChild(image);
}
//-------------------board creation-----------------
const generateBoard = () => {
    board.innerHTML = '';
    for (let i = 0; i < boardSize; i++) {
        let newEl = document.createElement('div');
        newEl.classList.add('memory-card');
        board.appendChild(newEl);
    }
    cards = document.querySelectorAll('.memory-card');
    Array.from(cards).forEach(card => {
        card.addEventListener('click', flipCard);
        createCovers(card);
    	addImage(card);
    });
    
}
//---------------functions---------------------------
function flipCard () {
	if (lockBoard) return;
	if (this === firstCard) return;
	this.classList.add('flip');
	totalClicks++;
	ticker.innerText = totalClicks;
	console.log(totalClicks);

	if (!hasFlippedCard) {
		hasFlippedCard = true;
		firstCard = this;

		return;
	}

	hasFlippedCard = false;
	secondCard = this;

	checkForMatch()
	
}

function checkForMatch() {
	let isMatch = firstCard.querySelector('img.front-face').getAttribute('src') === 
	secondCard.querySelector('img.front-face').getAttribute('src')
		
	isMatch ? hideCards() : unflipCards()
}

function hideCards() {
	firstCard.removeEventListener('click',flipCard);
	secondCard.removeEventListener('click',flipCard); 

	matchedCards++;
    matchedCards++;
    lockBoard = true;
	setTimeout(() => {
		firstCard.classList.add('hide');
		secondCard.classList.add('hide');

		resetBoard();
	}, 500);

	if (matchedCards === boardSize) victory();
}

function unflipCards() {
	lockBoard = true;
	setTimeout(() => {
		firstCard.classList.remove('flip');
		secondCard.classList.remove('flip');

		resetBoard();
	}, 850);
}

function resetBoard() {
	[hasFlippedCard, lockBoard] = [false, false];
	[firstCard, secondCard] = [null, null];
}

function victory() {
	document.getElementById('victory-text').classList.add('visible');
}

function startNewGame() {
	matchedCards = [];
	totalClicks = 0;
	ticker.innerText = totalClicks;
	tempImages = [...images, ...images];

	generateBoard();
}
