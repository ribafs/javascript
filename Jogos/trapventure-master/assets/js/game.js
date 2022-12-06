var game = game || {};


	var	canvas = $('#game'),
		ctx = canvas.getContext('2d'),
		lastUpdate = new Date(),
		aa = new ArcadeAudio(),
		player,
		tilesize = 40,
		instructions = [
			'Find the treasure inside the dungeon.',
			'Press <em>space</em> to reverse traps.'
		],
		names = [
			'trapventure',
			'dusty stairways',
			'the trap',
			'the fork way',
			'the large hall',
			'no snakes here',
			'the prison',
			'the persian room',
			'the only way',
			'shattered pillars',
			'test of will',
			'the last chamber'
		],
		maps = [
			[
				[4,1,1,1,7]
			],
			[
				[4,1,1,2,1,1,3,1,1,7]
			],
			[
				[4,1,1,1,2,2,1,6,1,5]
			],
			[
				[6,1,1,1,1,1,1,6,5],
				[0,0,0,0,1,0,0,0,0],
				[0,0,0,0,2,0,0,0,0],
				[4,1,1,1,1,0,0,0,0]
			],
			[
				[0,0,1,1,1,1,6,0,0],
				[0,0,1,1,1,1,1,0,0],
				[4,1,1,1,3,1,1,1,5],
				[0,0,1,1,1,1,6,0,0],
				[0,0,1,1,1,1,1,0,0]
			],
			[
				[6,0,1,6,1,0,1,6,1,0],
				[1,0,1,0,1,0,1,0,1,0],
				[1,0,2,0,2,0,3,0,1,5],
				[1,0,1,0,1,0,1,0,0,0],
				[1,4,1,0,1,6,1,0,0,0]
			],
			[
				[0,0,0,6,0,0,0,0,0,0,0,0,0],
				[0,0,0,2,1,1,1,3,1,6,0,0,0],
				[0,0,0,1,0,0,0,2,2,1,0,0,0],
				[0,0,0,1,0,3,6,2,6,0,0,0,0],
				[0,0,0,3,0,6,0,1,1,1,2,6,5],
				[0,0,0,3,0,1,0,0,0,0,0,0,0],
				[6,1,4,1,2,2,2,6,6,6,0,0,0]
			],
			[
				[0,1,3,1,2,6,2,1,3,6,0],
				[1,3,1,2,1,3,1,2,1,3,1],
				[4,2,3,1,2,6,2,1,3,2,5],
				[1,3,1,2,1,3,1,2,1,3,1],
				[0,1,3,1,2,6,2,1,3,6,0]
			],
			[
				[4,1,1,1,1,6],
				[0,0,3,0,0,0],
				[0,0,1,0,0,0],
				[0,0,1,0,0,0],
				[0,0,1,0,0,0],
				[0,0,6,0,0,0],
				[0,0,2,0,0,0],
				[0,0,1,1,1,5]
			],
			[
				[0,0,0,0,4,0,0,0,0],
				[0,0,1,2,1,3,1,0,0],
				[0,0,6,0,1,0,1,0,0],
				[6,0,1,0,1,0,6,0,1],
				[1,1,1,1,5,1,1,1,1],
				[1,0,6,0,1,0,1,0,6],
				[0,0,1,3,1,2,6,0,0]
			],
			[
				[0,6,1,0,6,0,1,6,0],
				[0,0,1,1,1,1,1,0,0],
				[0,0,1,1,1,1,1,0,0],
				[4,1,1,1,3,1,1,1,6],
				[0,0,1,1,1,1,6,0,0],
				[0,0,1,1,6,1,1,0,0],
				[0,0,0,0,5,0,0,0,0]
			],
			[
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,6,1,1,1,1,1,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,1,0,0,1,1,1],
				[4,1,1,1,1,1,1,1,1,2,1,1,8,1],
				[0,0,0,0,0,0,0,0,1,0,0,1,1,1],
				[0,0,0,6,1,1,1,1,1,0,0,0,0,0]
			]
		],
		map,
		enemies = [],
		tiles = [],
		world = [],
		exit,
		animFrame,
		music,
		isMusic = true,
		pathInterval,
		lastToggle = new Date(),
		endReached = false;


	game.init = function() {

		aa.add('music', 2, [
			[1,,0.7701,0.0022,0.9,0.47,,-0.5,0.02,0.0573,,0.2199,0.16,,0.2284,0.9413,-0.8104,0.5374,0.0495,0.1138,-0.5678,0.3631,0.9268,0.2],
			[1,,0.7701,0.0022,0.9,0.47,,0,0.02,0.0573,,0.2199,0.16,,0.2284,0.9413,-0.8104,0.5374,0.0495,0.1138,-0.5678,0.3631,0.9268,0.2],
			[1,,0.7701,0.0022,0.9,0.47,,0.5,0.02,0.0573,,0.2199,0.16,,0.2284,0.9413,-0.8104,0.5374,0.0495,0.1138,-0.5678,0.3631,0.9268,0.2],
			[1,,0.7701,0.0022,0.9,0.47,,1,0.02,0.0573,,0.2199,0.16,,0.2284,0.9413,-0.8104,0.5374,0.0495,0.1138,-0.5678,0.3631,0.9268,0.2]
		]);

		aa.add('win', 2, [
			[2,0.2401,0.5158,0.5032,0.91,0.38,,-0.02,,0.0092,0.1956,-0.125,-0.2412,,-0.0988,,0.0758,0.3728,0.5567,0.3993,0.3231,0.0068,-0.2971,0.5]
		]);

		aa.add('traps', 10,
		  [
		    [1,0.0592,0.0217,0.0742,0.39,0.8641,,-0.56,0.0873,0.0726,0.5921,-0.1226,0.4539,0.0532,0.6772,0.3002,0.6834,-0.7991,0.836,-0.0011,0.9134,0.1809,0.3207,0.56]
		  ]
		);

		aa.add('die', 2, 
			[
				[0,,0.3644,0.2851,0.4672,0.5159,,,-0.0944,0.4041,0.6285,-0.8575,0.8297,,0.3028,-0.0975,-0.0359,-0.012,0.93,0.1857,,0.1225,,0.56]
			]
		);

		aa.add('respawn', 2,
		  [
		    [0,0.3391,0.01,0.5415,0.5428,0.2102,,,-0.095,,0.3503,0.5185,,-0.1944,-0.8553,0.5259,0.2493,0.2691,0.8178,0.0824,0.7013,0.1288,-0.0006,0.5]
		  ]
		);

		aa.add('kill', 10,
		  [
		    [2,0.0708,0.1102,0.4156,0.8265,0.5,,-0.2134,-0.3753,-0.0018,,-0.2358,-0.6747,0.662,-0.2579,,,0.1023,0.9993,0.0498,0.329,0.2427,0.0014,0.56]
		  ]
		);

		aa.add('exit', 2, 
			[
				[2,0.134,0.8654,0.4633,0.3,0.1216,,0.3067,-0.5325,,-0.8813,0.8807,,0.9535,0.3137,0.24,0.2148,0.0101,0.8141,0.0372,0.7263,,-0.2908,0.56]
			]
		);
		aa.add('unlock', 2, 
			[
			  [0,,0.0891,0.5663,0.3068,0.8345,,,,,,0.5995,0.5384,,,,,,1,,,,,0.56]
			]
		);

		document.addEventListener('keydown', function(e) {

			var x = player.vx,
				y = player.vy,
				k = e.which;

			if( k === 65 || k === 37 ) x = -1; //left
			if( k === 68 || k === 39 ) x = 1; //right
			if( k === 87 || k === 38 ) y = -1; //up
			if( k === 83 || k === 40 ) y = 1; //down
			if( k === 32 ) toggleTraps();

			player.move(x, y);
		});

		document.addEventListener('keyup', function(e) {

			var x = y = false,
				k = e.which;

			if( e.which === 65 || e.which === 68 || k === 37 || k === 39) x = true;
			if( e.which === 87 || e.which === 83 || k === 38 || k === 40) y = true;

			player.stop(x, y);
		});

		$('#music').addEventListener('click', function(e) {
			isMusic = !isMusic;
			if( isMusic ) {
				musicLoop();
				this.classList.remove('off');
			} else {
				clearInterval(music);
				this.classList.add('off');
			}
		});

		setTimeout(function() {
			$('#black').classList.add('hidden');
		}, 1000);
		
			aa.play('music');
		musicLoop();
		loadMap();
	};


	function musicLoop() {
		music = setInterval(function() {
			aa.play('music');
		}, 3000);
	}

	function loadMap() {

		map = maps[0]; //because we shift maps on finish
		enemies = [];
		tiles = [];
		world = [];

		$('#name').innerHTML = '[' + names[0] + ']';
		$('#instructions').innerHTML = instructions[0] || '';

		//build world
		for(var y=0; y<map.length; y++) {

			tiles[y] = [];
			for(var x=0; x<map[0].length; x++) {

				if( map[y][x] === 4 ) {
					player = new Player(x*tilesize, y*tilesize);
					tiles[y][x] = new Tile(x*tilesize, y*tilesize, 1);
					world.push( tiles[y][x] );
				} else if( map[y][x] === 6 ) {
					var enemy = new Enemy(x*tilesize, y*tilesize);
					enemies.push( enemy );
					tiles[y][x] = new Tile(x*tilesize, y*tilesize, 1);
					world.push( tiles[y][x] );
				}  else {
					tiles[y][x] = new Tile(x*tilesize, y*tilesize, map[y][x]);
					world.push( tiles[y][x] );

					if(map[y][x] === 5) exit = tiles[y][x];
				}
			}
		}

		for(var i=0;i<enemies.length;i=i+1) {
			world.push( enemies[i] );
		}

		world.push( player );

		if( !animFrame ) 
			animFrame = requestAnimationFrame( loop );


		initPaths();

	}

	function nextMap() {
		endReached = true;
		aa.play('exit');
		$('#black').classList.remove('hidden');
		$('#name').classList.remove('hidden');
		$('#title').classList.add('hidden');
		setTimeout(function() {
			maps.shift();
			names.shift();
			instructions.shift();
			loadMap();
			endReached = false;
			$('#black').classList.add('hidden');
		}, 600);
	}

	function initPaths() {

		clearInterval(pathInterval);
		pathInterval = setInterval(function() {

			for(var i=0;i<enemies.length;i=i+1) {
				enemies[i].checkPath();
			}
		}, 1000);
	}

	function toggleTraps() {

		var thisToggle = new Date(),
			delta = (thisToggle - lastToggle);

		if( delta < 300 ) return;
		lastToggle = thisToggle;

		for(var i=0;i<world.length;i=i+1) {
			if( world[i] instanceof Tile ) world[i].toggle();
			if( world[i] instanceof Enemy ) world[i].checkTraps();
		}

		for(var i=0;i<enemies.length;i=i+1) {
			enemies[i].checkPath();
		}

		aa.play('traps');

		player.checkTraps();
	}

	function getTileAt(x,y) {

		var x = Math.floor(x/tilesize),
	    	y = Math.floor(y/tilesize);

	    if( tiles[y] && tiles[y][x]) {
	    	return tiles[y][x];
	    } else {
	    	return {
	    		type: 0,
	    		isWalkable: false
	    	};
	    }
	}


	function loop() {

		if( !endReached ) {

			var thisUpdate = new Date(),
				delta = (thisUpdate - lastUpdate) / 1000,
				amount = world.length;

			ctx.clearRect(0,0,canvas.width, canvas.height);

	        var offx = map[0].length*tilesize/2,
	        	offy = map.length*tilesize/2;
	        ctx.save();
	        ctx.translate(320-offx,240-offy);

			for(var i=0;i<amount;i=i+1) {

				world[ i ].update( delta );
				world[ i ].draw( ctx );
			}

			//redraw active traps
			for(var i=0;i<amount;i=i+1) {

				if( world[ i ] instanceof Tile && world[i].type === 2)
					world[ i ].draw( ctx );
			}

			ctx.restore();

			lastUpdate = thisUpdate;
		}

		animFrame = requestAnimationFrame( loop );
	}


	function $( elem ) {
		return document.querySelector( elem );
	}