function Enemy( x, y ) {

	this.x = x;
	this.y = y;
	this.vx = 0;
	this.vy = 0;
	this.width = 12;
	this.height = 30;

	this.isDead = false;
	this.rotation = 0;
	this.rotationDelta = 0;

	this.path = [];

	this.lastUpdate = 0;
	this.state = 0; //0=idle, 1=run right, 2=run up/down, 3=run left
	this.frame = 0;
	this.img = new Image();
	this.img.src = 'assets/images/sprite.png';

}

Enemy.prototype = {

	update : function( delta ) {

		if( this.isDead ) {
			
			this.vy *= 0.99;
			this.vy += 0.5;
			this.rotation += this.rotationDelta;
			
		} else if( this.path.length ) {

			var dx = this.path[0].x - this.x,
				dy = this.path[0].y - this.y;

			if( dx < 4 && dx > -4 ) dx = 0;
			if( dy < 4 && dy > -4 ) dy = 0;

			//path node reached
			if( dx < 2 && dx > -2 && 
				dy < 2 && dy > -2 ) {
				this.vx = 0;
				this.vy = 0;
				this.path.shift();
			}

			//(Abbruchbedingung) wenn der nächste Pfadknoten nicht mehr begehbar ist, 
			//bleibe auf der aktuellen Position
			if( this.path[0] && !this.path[0].isWalkable ) {
				this.path = [ getTileAt(this.x+tilesize/2, this.y+tilesize/2) ];
			}

			if( dx < 0 ) this.vx = -1;
			if( dx > 0 ) this.vx = 1;
			if( dy < 0 ) this.vy = -1;
			if( dy > 0 ) this.vy = 1;
		
		} else {

			//console.log('no path');

			this.vx = 0;
			this.vy = 0;
		}

		

		this.x += this.vx;
		this.y += this.vy;

		this.checkStates();
	},

	draw : function( ctx ) {

		var	w = this.width,
			h = this.height,
			x = this.x,
			y = this.y;

		//frame update
		if((new Date() - this.lastUpdate) > (!this.state ? 750 : 200) ) {
			this.lastUpdate = new Date();
			this.frame = 1 - this.frame;
		}

		var showFrame = this.frame + (this.state*2);

		if( this.isDead ) {

			ctx.save();
			ctx.translate( x+(tilesize/2), y+(tilesize/2) );
			ctx.rotate((90 + this.rotation) * Math.PI/180);
			ctx.drawImage( this.img, 1*12, 30, 12, 29, -w/2, -h/2, w, h);
			ctx.restore();

		} else {

			//draw path
			/*if( this.path.length ) {

				ctx.beginPath();
				ctx.moveTo(this.path[0].x + tilesize/2, this.path[0].y + tilesize/2);

				for( var i=1;i< this.path.length;i++) {

					ctx.lineTo(this.path[i].x + tilesize/2, this.path[i].y + tilesize/2);
				}
				//ctx.closePath();
				ctx.strokeStyle = 'red';
				ctx.stroke();
			}*/

			//draw character
			ctx.save();
			ctx.translate( x+(tilesize/2), y+(tilesize/2) );
			ctx.drawImage( this.img, showFrame*12, 30, 12, 29, -w/2, -h/2, w, h);
			ctx.restore();

		}
		
	},

	checkStates: function() {

		if( this.vx > 0 ) this.state = 1;
		if( this.vx < 0 ) this.state = 3;
		if( this.vy !== 0 ) this.state = 2;
		if( !this.path.length ) this.state = 0;
	},

	checkPath: function() {

		if( this.isDead ) return;

		//wenn auf dem zuvor berechneten Pfad ein Hindernis ist,
		//berechne keinen neuen Pfad (Abbruchbedingung oben)
		for(var i=0; i<this.path.length; i++) {
			if( !this.path[i].isWalkable ) return;
		}

		var startNode = getTileAt(this.x + (tilesize/2), this.y + (tilesize/2));
		var endNode = getTileAt(player.x, player.y);

		var astar = new Astar(startNode, endNode);
		this.path = astar.getPath();
	},

	checkTraps: function() {

		if( this.isDead ) return;

		var	x = this.x + (tilesize/2),
			y = this.y + (tilesize/2),
			w = this.width/2,
			h = this.height/2;

		if( !getTileAt(x-w,y-h).isWalkable || !getTileAt(x+w, y+h).isWalkable ) {
			this.isDead = true;
			this.path = [];
			this.vy = -12;
			this.rotationDelta = (-1 + Math.random()*2)*4;
			aa.play('kill');

			for(var i=0; i<enemies.length;i++) {
				if(!enemies[i].isDead) return;
			}

			if( exit ) exit.type = 7;
			aa.play('unlock');

		}
	}
};