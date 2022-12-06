function Player( x, y ) {

	this.x = x + tilesize/2;
	this.y = y + tilesize/2;
	this.vx = 0;
	this.vy = 0;
	this.width = 12;
	this.height = 30;

	this.isDead = false;
	this.rotation = 0;
	this.rotationDelta = 0;

	this.lastUpdate = 0;
	this.state = 0; //0=idle, 1=run right, 2=run up/down, 3=run left
	this.frame = 0;
	this.img = new Image();
	this.img.src = 'assets/images/sprite.png';

}

Player.prototype = {

	move: function(x, y) {

		if( this.isDead ) return;

		this.vx = x;
		this.vy = y;

		this.checkStates();
	},

	stop: function(x, y) {

		if( this.isDead ) return;

		if( x ) this.vx = 0;
		if( y ) this.vy = 0;

		this.checkStates();
	},

	checkStates: function() {

		if( this.vx > 0 ) this.state = 1;
		if( this.vx < 0 ) this.state = 3;
		if( this.vy !== 0 ) this.state = 2;
		if( this.vx === 0 && this.vy === 0 ) this.state = 0;
	},

	update : function( delta ) {

		if( this.isDead ) {
			
			this.vy *= 0.99;
			this.vy += 0.5;
			this.rotation += this.rotationDelta;

			this.x += this.vx;
			this.y += this.vy;

			return;
		}

		var	x = this.x,
			y = this.y,
			w = this.width/2,
			h = this.height/2,
			desiredX = x + this.vx * 1.5,
			desiredY = y + this.vy * 1.5;

		//X movement
		if( this.vx < 0 && getTileAt(desiredX-w,desiredY).isWalkable ||
			this.vx > 0 && getTileAt(desiredX+w,desiredY).isWalkable ) {

			this.x = desiredX;
		}

		//Y movement
		if( this.vy < 0 && getTileAt(desiredX,desiredY-h).isWalkable ||
			this.vy > 0 && getTileAt(desiredX,desiredY+h).isWalkable ) {

			this.y = desiredY;
		}

		//enemy check
		for(var i=0;i<enemies.length;i=i+1) {

			var e = enemies[i],
				ex = e.x + tilesize/2,
				ey = e.y + tilesize/2,
				dx = ex - x,
				dy = ey - y;	

			if( e.isDead ) continue;
			
			//x and y overlap
			if( Math.abs(dx) < e.width/2 + (w-4) && 
				Math.abs(dy) < e.height/2 + (h-4) ) {

				this.die();
			}
		}

		//exit check
		if( getTileAt(x,y).type === 7 )
			nextMap();

		//gem check
		if( getTileAt(x,y).type === 8 ) {
			endReached = true;
			$('#instructions').innerHTML = 'You survived and found the treasure.<br />Thanks for playing.';
			aa.play('win');
		}
	},

	draw : function( ctx ) {

		var	w = this.width,
			h = this.height,
			x = this.x,
			y = this.y;

		//frame update
		if((new Date() - this.lastUpdate) > (!this.state ? 500 : 200) ) {
			this.lastUpdate = new Date();
			this.frame = 1 - this.frame;
		}

		var showFrame = this.frame + (this.state*2);
		
		//draw character
		ctx.save();
		ctx.translate( x, y );
		ctx.rotate(this.rotation * Math.PI/180);
		ctx.drawImage( this.img, showFrame*12, 0, 12, 29, -w/2, -h/2, w, h);
		ctx.restore();
	},

	checkTraps: function() {

		var	x = this.x,
			y = this.y,
			w = this.width/2,
			h = this.height/2;

		//if( !getTileAt(x-w,y-h).isWalkable || !getTileAt(x+w,y+h).isWalkable ) {
		if( getTileAt(x-w,y-h).type === 2 || getTileAt(x+w,y+h).type === 2 ) {
			
			this.die();
		}
	},

	die: function() {

		this.isDead = true;
		this.state = 0;
		this.vy = -12;
		this.rotation = 90;
		this.rotationDelta = (-1 + Math.random()*2)*4;
		aa.play('die');
		
		setTimeout(function() {
			aa.play('respawn');
			loadMap();
		}, 1500);
	}
};