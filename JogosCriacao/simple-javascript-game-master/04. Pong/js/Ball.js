function Ball(x, y) {
	this.initx = x;
	this.inity = y;
	this.x = x;
	this.y = y;
	this.deltax = -1;
	this.deltay = 1;
	this.radius = RADIUS_BALL;
	drawBall(this.x, this.y, this.radius);
	this.reset = function() {
		this.x = this.initx;
		this.y = this.inity;
	}
	this.move = function() {
		this.x += this.deltax;
		this.y += this.deltay;
		drawBall(this.x, this.y, this.radius);
	}
}