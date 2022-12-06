var game = new Phaser.Game(750,500,Phaser.CANVAS);

	game.global = {
		highScore: 0
	};
	
	game.state.add('boot',bootState);
	game.state.add('load',loadState);
	game.state.add('menu',menuState);
	game.state.add('stage1',stage1State);
	game.state.add('stage2',stage2State);
	game.state.add('end',endState);
	
	game.state.start('boot');
