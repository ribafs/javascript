function Snake() {
	this.position = [[STARTX, STARTY], [STARTX - 1, STARTY], [STARTX - 2, STARTY]];
	this.directionX = 1;
	this.directionY = 0;
	drawInitalBody(this);
	this.addBody = function() {
		var head = this.position[0];
		var newX = (this.directionX + head[0] + WIDTH_GAME) % WIDTH_GAME;
		var newY = (this.directionY + head[1] + HEIGHT_GAME) % HEIGHT_GAME;
		drawSnakeBody(newX, newY);
		this.position.unshift([newX, newY]);
	}
	this.eraseBody = function() {
		var tail = this.position.pop();
		eraseSnakeBody(tail[0], tail[1]);
	}
}