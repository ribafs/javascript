class Invader {
	speed = random(0.2, 0.8);
	hitRadius = 20;
	isAlive = true;
		
	xvel = 0;
	
	coolDown = Math.floor(random(100, 250));
	fireRate = Math.floor(random(130, 250));
	
	powerupDropPercent = 20;

	constructor(x, y) {
		this.x = x;
		this.y = y;
		
	}

	display() {
		if (this.isAlive) {

			image(invaderImage, this.x-16, this.y-16);

			this.y += this.speed
		}
	}

	update() {
		if (this.isAlive) {
			for (let i = 0; i < torpedos.length; i++) {
				if (Math.pow(this.x - torpedos[i].x, 2) + Math.pow(this.y - torpedos[i].y, 2) <= Math.pow(this.hitRadius, 2)) {
					
					this.isAlive = false;
					points++;
					
					if(random(100) <= this.powerupDropPercent) {
						powerUps.push(new PowerUp(this.x, this.y));
					}

					if (!this.hasCompanions()) {
						level++;
						nextWave();
					}
				}
			}

			this.x += this.xvel;

			if (this.y > height) {
				currentGameState = "runLoseMenu";
			}

			if (this.coolDown == 0) {
				this.coolDown = this.fireRate;
				lasers.push(new Laser(this.x, this.y + 40, 0));
			} else {
				this.coolDown--;
			}
		}
	}

	hasCompanions() {
		for (let i = 0; i < invaders.length; i++) {
			if (invaders[i].isAlive) {
				return true;
			}
		}
		return false;
	}
}