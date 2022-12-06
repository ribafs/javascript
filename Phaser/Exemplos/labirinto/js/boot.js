var bootState = {
	preload: function(){
		game.load.image('progressBar','img/progressBar.png');
	},
	
	create: function(){
		game.state.start('load');
	}
};
