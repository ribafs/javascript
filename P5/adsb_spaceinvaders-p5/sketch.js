let invaders = [];
let torpedos = [];
let lasers = [];
let powerUps = [];
let player;
let points;

let currentGameState;
let level = 0;

let exoFont;
let bgImage;
let playerImage;
let invaderImage;
let powerUpImage;

let SCREEN_WIDTH = 700;
let SCREEN_HEIGHT = 700;

function setup() {
	createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
	player = new Starship();
	points = 0;

	currentGameState = "runStartMenu";
	
	// load assets into memory
	bgImage = loadImage("assets/spacebg2.jpg");
	playerImage = loadImage("assets/spaceship2.png");
	invaderImage = loadImage("assets/saucer1.png");

	exoFont = loadFont('assets/Exo2-BlackItalic.ttf');
	textFont(exoFont);
	textSize(20);
}

function draw() {
	switch(currentGameState) {
		case "runGame":
			runGame();
			break;
		case "runLoseMenu":
			runLoseMenu();
			break;
		case "runStartMenu":
			runStartMenu();
			break;
	}
} 

function runGame() {
	background(bgImage);

	stroke(255,255,255);
	fill(255,255,255);
	strokeWeight(0);
	textSize(20);
	text(`Score: ${points}   Level: ${level + 1}`, width/2, height - 20);

	player.display();

	for (let i = 0; i < invaders.length; i++) {
		invaders[i].display();
		invaders[i].update();
	}

	for (let i = 0; i < lasers.length; i++) {
		lasers[i].display();
		lasers[i].update();
	}

	for (let i = 0; i < torpedos.length; i++) {
		torpedos[i].display();
		torpedos[i].update();
	}

	for (let i = 0; i < powerUps.length; i++) {
		powerUps[i].display();
		powerUps[i].update();
	}

	player.detectInput();
	player.update();
}

function runStartMenu() {
	background(bgImage);
	
	stroke(255,255,255);
	fill(255,255,255);
	strokeWeight(0);
	
	textAlign(CENTER);
	textSize(40);
	text("Space Invaders", width/2, height/2 - 40);

	textSize(20);
	text("Press Space to Play", width/2, height/2 + 50);

	if(keyIsDown(32)) {
		currentGameState = "runGame";
		points = 0;
		invaders = [];
		torpedos = [];
		lasers = [];
		player = new Starship();
		nextWave();
	}
}

function runLoseMenu() {
	background(bgImage);
	
	stroke(255,255,255);
	fill(255,255,255);
	strokeWeight(0);
	
	textSize(30);
	text(`Score: ${points}`, width/2 ,250);
	text("Game Over :(", width/2, 200);

	text("Press Space to Try Again", width/2, 300);

	if(keyIsDown(32)) {
		currentGameState = "runGame";
		points = 0;
		invaders = [];
		torpedos = [];
		lasers = [];
		player = new Starship();
		level = 0;
		nextWave();
	}
}

function nextWave() {
	invaders = [];
	numEnemies = 5 + Math.floor(level/3);
	spacing = (width)/(numEnemies + 1);

	for (let i = 0; i < numEnemies; i++) {
		invaders.push(new Invader(Math.round((i+1)*spacing), -20));
	}
}