function drawPlayer(x, y, LENGTH){ //draw Player
	ctx.beginPath();
	ctx.fillStyle = PONG_COLOR;
	ctx.fillRect(x, y, THICKNESS, LENGTH);
	ctx.closePath();
}

function drawBall(x, y, radius) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.strokeStyle = '#000000';
	ctx.stroke();
	ctx.fillStyle = '#000000';
	ctx.fill();
	ctx.closePath();
}

function clearScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateScore() {
	ctx.fillStyle = PONG_COLOR;
	ctx.font = "25px Arial";
	ctx.fillText(score1, MID_WIDTH - OFFSET, LOCATION_SCORE_Y);
	ctx.fillText(score2, MID_WIDTH + OFFSET, LOCATION_SCORE_Y);

	// ctx.font = "25px Arial";
	// ctx.fillText("PLAYER 1", MID_WIDTH - OFFSET * 3, INFO_Y);
	// ctx.fillText("PLAYER 2", MID_WIDTH + OFFSET, INFO_Y);
}