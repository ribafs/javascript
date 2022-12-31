class Torpedo {
	constructor(x, y, xvel) {
		this.x = x
		this.y = y
		this.yvel = -10
		this.xvel = xvel
		this.offScreen = false;
	}

	display() {
		if(!this.offScreen) {
			stroke(255, 0, 0);
			strokeWeight(5);
			line(this.x, this.y, this.x, this.y + 20);
		}
	}

	update() {
		this.y += this.yvel
		this.x += this.xvel
		

		if (this.y < 0) {
			this.offScreen = true;
		}
	}
}