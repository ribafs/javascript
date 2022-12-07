var stage1State = {
	create: function(){
		this.onGame = true;
		this.music = game.add.audio('music');
		this.music.loop = true;
		this.music.volume = .5;
		this.music.play();
		
		this.maze = [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,3,0,0,0,0,0,0,0,0,0,0,0,3,1],
			[1,0,1,1,0,1,0,1,1,1,0,1,1,0,1],
			[1,0,1,3,0,1,3,0,0,1,0,3,1,0,1],
			[1,0,0,0,1,1,1,1,0,1,0,1,1,0,1],
			[1,0,0,0,0,1,0,2,0,0,0,0,0,0,1],
			[1,0,1,3,0,0,0,0,1,0,0,3,1,0,1],
			[1,0,1,1,1,1,0,1,1,0,1,1,1,0,1],
			[1,3,0,0,0,0,0,3,1,0,0,0,0,3,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		], 
	
		this.controls = game.input.keyboard.createCursorKeys();
		
		game.add.sprite(0,0,'bg');
		
		this.blocks = game.add.group();
		this.blocks.enableBody = true;
		this.coinPositions = [];
		
		for(var row in this.maze){
			for(var col in this.maze[row]){
				var tile = this.maze[row][col];
				var x = col * 50;
				var y = row * 50;
				if(tile === 1){
					//adiciona os blocos
					var block = this.blocks.create(x, y,'block');
						block.body.immovable = true;
				} else
				if(tile === 2){
					//adiciona o player
					this.player = game.add.sprite(x + 25, y + 25,'player');
					this.player.anchor.set(.5);
					game.physics.arcade.enable(this.player);
					this.player.body.setSize(18,32,3,0);
					this.player.animations.add('goDown',[0,1,2,3,4,5,6,7],12,true);
					this.player.animations.add('goUp',[8,9,10,11,12,13,14,15],12,true);
					this.player.animations.add('goLeft',[16,17,18,19,20,21,22,23],12,true);
					this.player.animations.add('goRight',[24,25,26,27,28,29,30,31],12,true);
				} else
				if(tile === 3){
					var position = {
						x: x + 25,
						y: y + 25
					};
					this.coinPositions.push(position);
				}
			}
		}
		
		//cria moeda
		this.coin = {};
		this.coin.position = this.coinPositions[Math.floor(Math.random() * this.coinPositions.length)];
		this.coin = game.add.sprite(this.coin.position.x, this.coin.position.y, 'coin');
		this.coin.anchor.set(.5);
		game.physics.arcade.enable(this.coin);
		this.coin.animations.add('spin',[0,1,2,3,4,5,6,7,8,9],10,true).play();
		this.coin.body.setSize(12,12,10,10);
		
		this.sndCoin = game.add.audio('sndCoin');
		this.sndCoin.volume = .5;
		
		this.sndLose = game.add.audio('lose');
		this.sndLose.volume = .5;
		
		
		//inimigo
		this.enemy = game.add.sprite(75,75,'enemy');
		game.physics.arcade.enable(this.enemy);
		this.enemy.anchor.set(.5);
		this.enemy.body.setSize(20,36,2,4);
		this.enemy.animations.add('goDown',[0,1,2,3,4,5,6,7],12,true);
		this.enemy.animations.add('goUp',[8,9,10,11,12,13,14,15],12,true);
		this.enemy.animations.add('goLeft',[16,17,18,19,20,21,22,23],12,true);
		this.enemy.animations.add('goRight',[24,25,26,27,28,29,30,31],12,true);
		
		this.enemy.direction = 'DOWN';
		
		
		//partículas
		this.emitter = game.add.emitter(0,0,15);
		this.emitter.makeParticles('part');
		this.emitter.setXSpeed(-50,50);
		this.emitter.setYSpeed(-50,50);
		this.emitter.gravity.y = 0;
		
		//txtCoins
		this.coins = 0;
		this.txtCoins = game.add.text(10,10,'COINS: ' + this.getText(this.coins),{font:'15px emulogic',fill:'#fff'});
		
		//txtScore
		this.txtScore = game.add.text(game.world.centerX,10,'SCORE: ' + this.getText(game.global.score),{font:'15px emulogic',fill:'#fff'});
		this.txtScore.anchor.set(.5,0);
		
		//time
		this.time = 100;
		this.txtTime = game.add.text(game.width - 10, 10, 'TIME: ' + this.getText(this.time),{font:'15px emulogic',fill:'#fff'});
		this.txtTime.anchor.set(1,0);
		this.clock = game.time.events.loop(1000,function(){
			this.time--;
			this.txtTime.text = 'TIME: ' + this.getText(this.time);
		},this);
	},
	
	update: function(){
		if(this.onGame){
			//colisões
			game.physics.arcade.collide(this.player,this.blocks);
			game.physics.arcade.overlap(this.player,this.coin,this.collectCoin,null,this);
			game.physics.arcade.overlap(this.player,this.enemy,this.loseCoin,null,this);
			
			//mover o player
			this.movePlayer();
			
			this.moveEnemy();
			
			if(this.time < 1 || this.coins >= 10){
				this.gameOver();
			}
		}
	},
	
	moveEnemy: function(){
		if(Math.floor(this.enemy.x - 25)%50 === 0 && Math.floor(this.enemy.y - 25)%50 === 0){
			var enemyCol = Math.floor(this.enemy.x/50);
			var enemyRow = Math.floor(this.enemy.y/50);
			var validPath = [];
			
			if(this.maze[enemyRow][enemyCol-1] !== 1 && this.enemy.direction !== 'RIGHT'){
				validPath.push('LEFT');
			}
			if(this.maze[enemyRow][enemyCol+1] !== 1 && this.enemy.direction !== 'LEFT'){
				validPath.push('RIGHT');
			}
			if(this.maze[enemyRow-1][enemyCol] !== 1 && this.enemy.direction !== 'DOWN'){
				validPath.push('UP');
			}
			if(this.maze[enemyRow+1][enemyCol] !== 1 && this.enemy.direction !== 'UP'){
				validPath.push('DOWN');
			}
			
			this.enemy.direction = validPath[Math.floor(Math.random()*validPath.length)];
		}
		
	
		switch(this.enemy.direction){
			case 'LEFT':
				this.enemy.x -= 1;
				this.enemy.animations.play('goLeft');
				break;
			case 'RIGHT':
				this.enemy.x += 1;
				this.enemy.animations.play('goRight');
				break;
			case 'UP':
				this.enemy.y -= 1;
				this.enemy.animations.play('goUp');
				break;
			case 'DOWN':
				this.enemy.y += 1;
				this.enemy.animations.play('goDown');
				break;
		}
	},
	
	movePlayer: function(){
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
			
		if(this.controls.left.isDown && !this.controls.right.isDown){
			this.player.body.velocity.x = -100;
			this.player.direction = 'left';
		} else
		if(this.controls.right.isDown && !this.controls.left.isDown){
			this.player.body.velocity.x = 100;
			this.player.direction = 'right';
		}
		
		if(this.controls.up.isDown && !this.controls.down.isDown){
			this.player.body.velocity.y = -100;
			this.player.direction = 'up';
		} else
		if(this.controls.down.isDown && !this.controls.up.isDown){
			this.player.body.velocity.y = 100;
			this.player.direction = 'down';
		}
		
		switch(this.player.direction){
			case 'left':
				this.player.animations.play('goLeft'); break;
			case 'right':
				this.player.animations.play('goRight'); break;
			case 'up':
				this.player.animations.play('goUp'); break;
			case 'down':
				this.player.animations.play('goDown'); break;
		}
		
		if(this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0){	
			this.player.animations.stop();
			switch(this.player.direction){
				case 'left':
					this.player.frame = 16; break;
				case 'right':
					this.player.frame = 24; break;
				case 'up':
					this.player.frame = 8; break;
				case 'down':
					this.player.frame = 0; break;
			}
		}
	},
	
	collectCoin: function(){
		this.coins++;
		this.txtCoins.text = 'COINS: ' + this.getText(this.coins);
	
		game.global.score += 5;
		this.txtScore.text = 'SCORE: ' + this.getText(game.global.score);
		
		this.sndCoin.play();
		
		if(game.global.score > game.global.highScore){
			game.global.highScore = game.global.score;
		}
		
		this.emitter.x = this.coin.position.x;
		this.emitter.y = this.coin.position.y;
		this.emitter.start(true,500,null,15);
		
		if(this.coins < 10){
			this.coin.position = this.newPosition();
		} else {
			this.coin.kill();
		}
	},
	
	loseCoin: function(){
		this.sndLose.play();
		if(this.coins > 0){
			this.emitter.x = this.player.position.x;
			this.emitter.y = this.player.position.y;
			this.emitter.start(true,500,null,15);
			
			this.coins = 0;
			this.txtCoins.text = 'COINS: ' + this.getText(this.coins);
		}
		
	},
	
	getText: function(value){
		if(value < 10){
			return '00' + value.toString();
		}
		if(value < 100){
			return '0' + value.toString();
		}
		return value.toString();
	},
	
	newPosition: function(){
		var pos = this.coinPositions[Math.floor(Math.random() * this.coinPositions.length)];
		
		while(pos === this.coin.position){
			pos = this.coinPositions[Math.floor(Math.random() * this.coinPositions.length)];
		}
		
		return pos;
	},
	
	gameOver: function(){
		this.onGame = false;
		game.time.events.remove(this.clock);
		
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
		this.player.animations.stop();
		this.player.frame = 0;
		
		this.enemy.animations.stop();
		this.enemy.frame = 0;
		
		if(this.coins >= 10){
			var txtLevelComplete = game.add.text(game.world.centerX, 150, 'LEVEL COMPLETE',{font:'20px emulogic',fill:'#fff'});
				txtLevelComplete.anchor.set(.5);
			
			//bonus
			var bonus = this.time * 5;
			game.global.score += bonus;
			this.txtScore.text = 'SCORE: ' + this.getText(game.global.score);
			
			//atualiza highScore
			if(game.global.score > game.global.highScore){
				game.global.highScore = game.global.score;
			}
			
			//exibe bônus e score
			var txtBonus = game.add.text(game.world.centerX, 200, 'TIME BONUS: ' + this.getText(bonus),{font:'20px emulogic',fill:'#fff'});
				txtBonus.anchor.set(.5);
			
			var txtFinalScore = game.add.text(game.world.centerX, 250, 'FINAL SCORE: ' + this.getText(game.global.score),{font:'20px emulogic',fill:'#fff'});
				txtFinalScore.anchor.set(.5);
			
		} else {
			var txtGameOver = game.add.text(game.world.centerX, 150, 'GAME OVER',{font:'20px emulogic',fill:'#fff'});
				txtGameOver.anchor.set(.5);
		}
			
		var txtBestScore = game.add.text(game.world.centerX,350, 'BEST SCORE: ' + this.getText(game.global.highScore),{font:'15px emulogic',fill:'#fff'});
			txtBestScore.anchor.set(.5);
		
		game.time.events.add(5000,function(){
			this.music.stop();
			if(this.coins >= 10){
				game.state.start('stage2');
			} else {
				game.state.start('menu');
			}
		},this);
	}
}
