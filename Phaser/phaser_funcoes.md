## Funções s Subrotinas úteis

## Chamada quando a tela é clicada ou tapped
```js
    /**
     * Called when the screen is clicked or tapped.
     */
    function touchScreen()
    {
        // is the left or right side of the screen clicked?
        if (game.input.x < (game.world.width / 2))
        {
            // left side touch
            if (!isGameOver)
            {
                // if the ball is already in play, move the left paddle.
                if (!releaseBall())
                {
                    leftPlayer.targetY = game.input.y;
                }
            }
            else
            {
                // start a new single player game
                isMultiplayer = false;
                resetGame();
                resetBall();
            }
        }
        else
        {
            // right side touch
            if (!isGameOver)
            {
                // // if the ball is already in play, move the right paddle.
                if (!releaseBall())
                {
                    rightPlayer.targetY = game.input.y;
                }
            }
            else
            {
                // start a new multiplayer game
                isMultiplayer = true;
                resetGame();
                resetBall();
            }
        }
    }
```

## Chamando:
game.input.onDown.add(touchScreen, this);

## Desenhar blocos na tela. 3 linhas e 7 colunas
```js
function initBricks() {
    brickInfo = {
        width: 50,
        height: 20,
        count: {
            row: 7,
            col: 3
        },
        offset: {
            top: 50,
            left: 60
        },
        padding: 10
    }
    bricks = game.add.group();
    for(c=0; c<brickInfo.count.col; c++) {
        for(r=0; r<brickInfo.count.row; r++) {
            var brickX = (r*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
            var brickY = (c*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;
            newBrick = game.add.sprite(brickX, brickY, 'brick');
            game.physics.enable(newBrick, Phaser.Physics.ARCADE);
            newBrick.body.immovable = true;
            newBrick.anchor.set(0.5);
            bricks.add(newBrick);
        }
    }
}
```
	
## Desenhar um labirinto
```js
var fase1State = {
	create: function(){
		// Mostrar o sprite de fundo para o labirinto (espaços vazios), no canto esquerdo da tela
		game.add.sprite(0,0,'bg');
		// Objeto da matriz para o labirinto
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
		];
		// Criar grupo de blocos
		this.blocks = game.add.group();
		// Transformação da matriz no labirinto pelos 2 fors	
		for(var row in this.maze){
			for(var col in this.maze[row]){
				var tile = this.maze[row][col];
				// Cada célula tem 50x50
				var x = col * 50;
				var y = row * 50;
				// Troque todos os 1 por block
				if(tile === 1){
					// Desenho do block onde tem 1
					var block = this.blocks.create(x,y,'block');
				}
			}
		}
	}
};
```
