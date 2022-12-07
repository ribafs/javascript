var time = Date.now();
var snake;
var food;
var score;
var game_state = MAIN_MENU;
var firstPressed = 0;

window.onload = function() {
	requestAnimationFrame(gameStart);
}

function resetGame() {
	clearScreen();
	time = Date.now();
	snake = new Snake();
	food = new Food();
	score = 0;
	document.getElementById("score").innerHTML = score;
}

function gameStart() {
	requestAnimationFrame(gameStart);
	if(game_state == MAIN_MENU) {
		displayMainMenu();
	} else if(game_state == IN_GAME && firstPressed == 1) {
		resetGame();
		firstPressed = 0;
	} else if(game_state == IN_GAME) {
		var current_time = Date.now();
		var elapsed = current_time - time;
		if(elapsed > FPS_INTERVAL) {
			time = current_time - (elapsed % FPS_INTERVAL);
			snake.addBody();
			if(isCollision(snake) == true) {
				game_state = DEAD;
				return ;
			}
			if(food.ateBySnake(snake) == true) {
				food.generate(snake);
				score++;
				document.getElementById("score").innerHTML = score;
			}
			else snake.eraseBody();
		}
	} else if(game_state == DEAD){
		deadScreen();
	}
}