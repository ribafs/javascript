var menuState = {
	create: function(){
		this.music = game.add.audio('music');
		this.music.loop = true;
		this.music.volume = .5;
		this.music.play();
	
		//score
		game.global.score = 0;
		//highScore
		if(!localStorage.getItem('highScore')){
			localStorage.setItem('highScore',0);
		}
		
		if(game.global.highScore > localStorage.getItem('highScore')){
			localStorage.setItem('highScore',game.global.highScore);
		} else {
			game.global.highScore = localStorage.getItem('highScore');
		}
	
		var txtLabirinto = game.add.text(game.world.centerX, 150,'LABIRINTO',{font:'40px emulogic',fill:'#fff'});
			txtLabirinto.anchor.set(.5);
		
		var txtPressStart = game.add.text(game.world.centerX,550,'PRESS START',{font:'20px emulogic', fill: '#fff'});
			txtPressStart.anchor.set(.5);
			
		var txtHighScore = game.add.text(game.world.centerX,350,'HIGH-SCORE: ' + this.getText(localStorage.getItem('highScore')),{font:'20px emulogic', fill:'#F18808'});
			txtHighScore.anchor.set(.5);
			txtHighScore.alpha = 0;
			
		game.add.tween(txtPressStart).to({y: 250},1000).start();
		
		game.time.events.add(1000,function(){
			game.add.tween(txtHighScore).to({alpha: 1},500).to({alpha: 0},500).loop().start();
			
			var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
				enterKey.onDown.addOnce(this.startGame,this);
		},this);
		
		
	},
	
	getText: function(value){
		if(value < 10){
			return '0' + value.toString();
		}
		return value.toString();
	},
	
	startGame: function(){
		this.music.stop();
		game.state.start('stage1');
	}
};
