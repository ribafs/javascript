function drawSnakeBody(x, y){
	ctx.fillStyle = SNAKE_COLOR;
	ctx.fillRect(x * BLOCKSIZE, y * BLOCKSIZE, BLOCKSIZE, BLOCKSIZE);
	ctx.strokeStyle = BACKGROUND_COLOR;
	ctx.strokeRect(x * BLOCKSIZE, y * BLOCKSIZE, BLOCKSIZE, BLOCKSIZE);
}

function eraseSnakeBody(x, y){
	ctx.fillStyle = BACKGROUND_COLOR;
	ctx.fillRect(x * BLOCKSIZE, y * BLOCKSIZE, BLOCKSIZE, BLOCKSIZE);
	ctx.strokeStyle = BACKGROUND_COLOR;
	ctx.strokeRect(x * BLOCKSIZE, y * BLOCKSIZE, BLOCKSIZE, BLOCKSIZE);
}

function drawFood(x, y) {
	ctx.beginPath();
    ctx.arc(x * BLOCKSIZE + BLOCKSIZE/2, y * BLOCKSIZE + BLOCKSIZE/2, BLOCKSIZE/2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = FOOD_COLOR;
    ctx.fill();
}

function drawInitalBody(snake) {
	for(var snakeBody of snake.position) {
		drawSnakeBody(snakeBody[0], snakeBody[1]);
	}
}

function clearScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function displayMainMenu() {
	clearScreen();
	ctx.fillStyle = SNAKE_COLOR;
	ctx.font = "30px Arial";
	ctx.fillText("WELCOME To SNAKE", LEFTSIDE, UPSIDE);
	ctx.font = "20px Arial";
	ctx.fillText("PRESS W/A/S/D or", LEFTSIDE, UPSIDE + OFFSET);
	ctx.fillText("Arrow key to change direction", LEFTSIDE, UPSIDE + 2 * OFFSET);
	ctx.font = "20px Arial";
	ctx.fillText("PLAY GAME", LEFTSIDE + OFFSET / 2, UPSIDE + 4 * OFFSET);
	ctx.strokeStyle = SNAKE_COLOR;
	ctx.strokeRect(LEFTSIDE, UPSIDE + 3 * OFFSET, WIDTH_BOX, HEIGHT_BOX / 2);
}

function deadScreen() {
	clearScreen();
	ctx.font = "30px Arial";
	ctx.fillText("YOU ARE DEAD", LEFTSIDE, UPSIDE);
	var result = "Score " + score;
	ctx.fillText(result, LEFTSIDE, UPSIDE + OFFSET);
	ctx.font = "20px Arial";
	ctx.fillText("BACK TO MAIN", LEFTSIDE + OFFSET / 2, UPSIDE + 4 * OFFSET);
	ctx.strokeStyle = SNAKE_COLOR;
	ctx.strokeRect(LEFTSIDE, UPSIDE + 3 * OFFSET, WIDTH_BOX, HEIGHT_BOX / 2);
}