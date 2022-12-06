var time = Date.now();
var player1 = new Player(PADDING, MID_HEIGHT - HALF_LENGTH); //left side of screen
var player2 = new Player(SCREEN_WIDTH - PADDING, MID_HEIGHT - HALF_LENGTH); //left side of screen
var PLAYER_1_DIRECTION = 0;
var PLAYER_2_DIRECTION = 0;
var ball = new Ball((SCREEN_WIDTH + (SCREEN_WIDTH % 2)) / 2, SCREEN_HEIGHT / 2);
var SPEED = 10;
var score1 = 0;
var score2 = 0;
var game_stats = 0;

window.onload = function() {
	requestAnimationFrame(gameStart);
}

function gameStart() {
	requestAnimationFrame(gameStart);
	var current_time = Date.now();
	var elapsed = current_time - time;
	if(game_stats == 0) {
		ball.reset();
		player1.reset();
		player2.reset();
		PLAYER_1_DIRECTION = 0;
		PLAYER_2_DIRECTION = 0;
		SPEED = 10;
		game_stats = 1;
	}
	if(elapsed > FPS_INTERVAL) {
		clearScreen();
		updateScore();
		time = current_time - (elapsed % FPS_INTERVAL);
		for(var i = 0;i < SPEED;i++) {
			player1.movePong(PLAYER_1_DIRECTION);
			player2.movePong(PLAYER_2_DIRECTION);
			if(hitYBound(ball.y)) ball.deltay *= -1;
			if(hitPlayer(player1, 1, ball) == true) {
				ball.deltax *= -1;
				SPEED += INCREMENT;
			}
			if(hitPlayer(player2, 0, ball) == true) {
				ball.deltax *= -1;
				SPEED += INCREMENT;
			}
			ball.move();
			var result = checkBorder(ball.x);
			if(result == 1) {
				score2++;
				game_stats = 0;
			} else if(result == 2) {
				score1++;
				game_stats = 0;
			}
		}
	}
}