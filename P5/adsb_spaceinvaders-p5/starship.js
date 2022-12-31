class Starship {
	constructor() {
		this.x = width/2
		this.y = SCREEN_HEIGHT - 100;
		this.xvel = 0
		this.accel = 0.7
		this.decell = 0.5
		this.maxSpeed = 5
		this.hitRadius = 15
		
		this.numShots = 1;
		this.coolDown = 15;
		this.fireRate = 30;
	}

	display() {
		// stroke(255,255,255);
		// fill(255,255,255);
		// strokeWeight(1);
		// triangle(this.x, this.y - 20, this.x + 10, this.y, this.x - 10, this.y);


		// image is 32x32, offsets by 16
		image(playerImage, this.x-16, this.y-16);
	}

	update() {
		this.x += this.xvel
		
		// movement wraps around the edges
		if (this.x <= 0) {
			this.x = width;
		} else if (this.x >= width) {
			this.x = 0;
		}

		if (this.coolDown > 0) {
			this.coolDown--;
		}

		for (let i = 0; i < lasers.length; i++) {
			if (Math.pow(this.x - lasers[i].x, 2) + Math.pow(this.y - lasers[i].y, 2) <= Math.pow(this.hitRadius, 2)) {
				currentGameState = "runLoseMenu";
			}
		}
	}

	// TODO: make it so that the velocity never goes above the max speed
	// say that vel is 7, accell is 4, don't go up to 11, but to 10
	detectInput() {
		// detecting a shot by space bar
		if (keyIsDown(32)) {
			if (this.coolDown == 0) {
				this.coolDown = this.fireRate;
				
				if(this.numShots == 1) {
					torpedos.push(new Torpedo(this.x, this.y - 40, 0));
				} else if(this.numShots == 2) {
					torpedos.push(new Torpedo(this.x + 10, this.y - 40, 0));
					torpedos.push(new Torpedo(this.x - 10, this.y - 40, 0));
				} else if(this.numShots == 3) {
					torpedos.push(new Torpedo(this.x, this.y - 40, -4));
					torpedos.push(new Torpedo(this.x, this.y - 40, 0));
					torpedos.push(new Torpedo(this.x, this.y - 40, 4));
				}
				
			}
		}

		if (keyIsDown(LEFT_ARROW)) {
			if (this.xvel > -this.maxSpeed) {
				this.xvel -= this.accel;
			}
		} else if (keyIsDown(RIGHT_ARROW)) {
			if (this.xvel < this.maxSpeed) {
				this.xvel += this.accel;
			}
		} else {
			if (this.xvel > 0) {
				this.xvel -= this.decell
			} else if (this.xvel < 0) {
				this.xvel += this.decell
			}
		}
	}
}