class Laser {
    yvel = 6
    
    constructor(x, y, xvel) {
		this.x = x
		this.y = y
		this.xvel = xvel
	}

	display() {
		stroke(255, 0, 255)
		strokeWeight(5)
		line(this.x - this.xvel, this.y - 20, this.x, this.y)
	}

	update() {
		this.y += this.yvel;
		this.x += this.xvel;
		
		if (this.y > height) {
			lasers.shift();
		}
	}
}