Tile = function(x, y, type) {

	this.x = x;
	this.y = y;
	this.color = 'rgba(255,255,255,0.25)';
	this.hasChanged = false; //editor
	this.isTarget = false; //debug
	this.isWalkable = false;
	this.animStep = 0.2;

	this.img = new Image();
	this.img.src = 'assets/images/sprite.png';

	/* 
	0 = empty
	1 = walkway
	2 = toggle area on
	3 = toggle area off
	(4 = player)
	5 = exit (locked)
	(6 = enemy)
	7 = exit (open)
	8 = gem
	*/
	this.type = type || 0;

	if( '13578'.indexOf(type) > -1 ) {
		this.isWalkable = true;
	}

	//Astar Pathfinding Variables
	this.astar = {
		g: 0,
		h: 0,
		f: 0,
		parent: null
	}

}

Tile.prototype = {

	toggle: function() {

		if( this.type < 2 || this.type > 3 ) return;
		this.type = this.type === 2 ? 3 : 2;
		this.isWalkable = !this.isWalkable;
		this.animStep = 0;
	},

	getNeighbours: function() {

		var neighbours = [],
			x = this.x/tilesize,
			y = this.y/tilesize;

		neighbours = this.safeAddNeighbour(x+1, y, neighbours);
		neighbours = this.safeAddNeighbour(x, y-1, neighbours);
		neighbours = this.safeAddNeighbour(x, y+1, neighbours);
		neighbours = this.safeAddNeighbour(x-1, y, neighbours);

		return neighbours;
	},


	safeAddNeighbour: function( x, y, neighbours ) {

		if( tiles[y] && tiles[y][x] && tiles[y][x].isWalkable ) {
			neighbours.push( tiles[y][x] );	
		}

		return neighbours;
	},

	update: function( delta ) {

		if( '23'.indexOf(this.type) !== -1 ) {
			this.animStep += delta;

			if( this.animStep > 0.2 ) this.animStep = 0.2;
		}
	},

	draw: function(ctx) {

		var x = this.x/tilesize,
			y = this.y/tilesize,
			step = (this.animStep/0.2)*20;

		if( '123578'.indexOf(this.type) !== -1 ) {

			ctx.fillStyle = 'rgba(0,0,0,1)';
			ctx.fillRect(this.x, this.y, tilesize, tilesize);

			if( !tiles[y-1] || !tiles[y-1][x] || tiles[y-1][x].type === 0 ) {

				ctx.fillStyle = '#276059';
			//	ctx.fillRect(this.x, this.y-20, tilesize, 20);
			}

		} 

		if( this.type === 2 ) {

			ctx.fillStyle = '#89ccca';
			ctx.fillRect(this.x, this.y - step, tilesize, tilesize);

			ctx.fillStyle = '#679997';
			ctx.fillRect(this.x, this.y+40-step, tilesize, step);

		} else if( this.type === 3 ) {

			ctx.fillStyle = '#333';
			ctx.fillRect(this.x, this.y - (20-step), tilesize, tilesize);	

			ctx.fillStyle = '#222';
			ctx.fillRect(this.x, this.y+40-(20-step), tilesize, (20-step));

		} else if( this.type === 5 ) {

			ctx.drawImage( this.img, 30, 60, 30, 30, this.x+5, this.y+5, 30, 30);

			ctx.strokeStyle = '#407876';
			ctx.strokeRect(this.x+4, this.y+4, tilesize-8, tilesize-8);	

		} else if( this.type === 7 ) {

			ctx.drawImage( this.img, 0, 60, 30, 30, this.x+5, this.y+5, 30, 30);

			ctx.strokeStyle = '#407876';
			ctx.strokeRect(this.x+4, this.y+4, tilesize-8, tilesize-8);	

		} else if( this.type === 8 ) {

			ctx.drawImage( this.img, 60, 60, 30, 30, this.x+5, this.y+5, 30, 30);
		}
		
	}

};