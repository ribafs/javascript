function Player(x, y) { //set player topmost position
	this.initx = x;
	this.inity = y;
	this.x = x;
	this.y = y;
	drawPlayer(this.x, this.y, LENGTH);
	this.reset = function() {
		this.x = this.initx;
		this.y = this.inity;
	}
}


Player.prototype.movePong = function(direction){
	if(direction == MOVE_DOWN) {
		this.y += MOVE_DOWN;
		if(this.y + LENGTH > canvas.height) this.y += MOVE_UP;
		drawPlayer(this.x, this.y, LENGTH);
	} else if(direction == MOVE_UP) {
		this.y += MOVE_UP;
		if(this.y < 0) this.y += MOVE_DOWN;
		drawPlayer(this.x, this.y, LENGTH);
	} else drawPlayer(this.x, this.y, LENGTH);
}