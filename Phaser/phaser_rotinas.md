## Dicas de uso do código do Framework Phaser

## index.html básico
```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="pt-br" lang="pt-br">

<head>
	<meta http-equiv="content-type" content="text/html;charset=utf-8" />
	<meta name="generator" content="VSCode" />
	<meta name="viewport" content="width=device-width,initial-scale=1" />
	<title>Labirinto com Phaser</title>
	<link rel="stylesheet" type="text/css" href="#" />
</head>
<body>

<script src="lib/vendor/phaser.js"></script>
</body>
</html>
```

## Formas de trabalhar com JavaScript

1) function preload(){}

Este deixa tudo global e os demais abaixo encapsula em objetos.
No primeiro exemplo: var game = ... é declarado a nível globa do jogo e assim várias outras variáveis.
Nos demais as mesmas ficam encapsuladas em objetos/funções.

2) menu: function(){
   		preload: function() {}
   }

3) var menu = {
	preload: function(){}
}

ou
```js
Candy.Game = function(game){}
Candy.Game.prototype = {
	create: function(){}
	update: function(){}
}
Candy.item = {}
```

## Instanciar objeto Phaser.Game

// Criar uma instância do Phaser.Game em 750x500 do tipo CANVAS
```js
var game = new Phaser.Game(750,500,Phaser.CANVAS);

outra:
var width = 750;
var height = 500;
var game = new Phaser.Game(width, height, Phaser.AUTO, null, {preload: preload, create: create, update: update});

ou:
    game = new Phaser.Game(750, 500, Phaser.AUTO, '', {
        preload: carregaAssets,
        create: criaCenario, 
        update: atualizaJogo
    });
```

Obs.: podemos usar o Phaser.AUTO que detectará se a máquina tem WebGL e o usar. Mas para melhor desempenho devemos usar
Phaser.CANVAS

preload() - carregamento para a memória de todos os recursos do jogo: imagens, spritesheets, áudio, etc

create() - após finalizar o carregamento do preload então o create configura o state inicial do jogo

loop do jogo:
-	update()
-	render() - onde o último state do jogo é desenhado (renderizado) na tela

Do update vai para o render e do render, após algum tempo, volta para o update.

## Controlar a escala do jogo, para que redimensione automaticamente, dependendo das dimensões do dispositivo
```js
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
```

## Adicionar um sprite ao jogo
O Phaser carrega imagens para que no jogo sejam chamadas de sprites.

Carregar a imagem através do método preload():
```js
	game.load.image('bg','img/bg.png'); // Nesta etapa ainda não mostra nada no jogo
```

## Carregar spritesheet:
	game.load.spritesheet('player','img/player.png',24,32);// 'nome', 'path', largura, altura

Carregar o sprite no método create():
	this.coin = game.add.sprite(75,0,'coin'); // x = 75, y = 0, imagem 'coin'. Agora ele aparece na tela
ou

	player = game.add.sprite(width*0.5, height*0.5, 'player');// no centro em x e em y

## Adicionar áudio ao jogo
Carregar o arquivo de áudio no método preload():
	game.load.audio('music','audio/music.ogg');

##Adicionar ao método create():
```js
	this.music = game.add.audio('music'); // 'music' é o arquivo de áudio carregado acima
	this.music.loop = true;
	this.music.volume = .5;
	this.music.play();
```

## Adicionar um state, ou seja, uma parte a mais no jogo (menu, jogo em si, game_over, etc)
São adicionados no início do jogo:
```js
	game.state.add('load',loadState);
	game.state.add('menu',menuState);
	game.state.add('fase1',fase1State);
```

## Adicionar texto ao jogo
```js
var loadState = {
	preload: function(){
		(X, Y, 'Texto', {estiloo do texto})
		var txtLoading = game.add.text(game.world.centerX,150,'LOADING...',{font:'15px emulogic',fill:'#fff'});
```
outro:
```js
    textoMoedas = game.add.text(25, 30, "Pontuação: " + contadorMoedas + " moedas" , {
        font: "18px Arial",
        fill: "#",
        align: "left"
    });
```
outro com quebra de linha
	var pausedText = this.add.text(100, 250, "Game paused.\nTap anywhere to continue.", this._fontStyle);

## Adicionar um botão
```js
    preload : function() {
		// Carrega a imagem
        game.load.image('menu', 'img/menu.png');
    },
    create: function () {
		// Adiciona o botão, na posição 0,0, usando a imagem 'menu', chamando a função startGame, no contexto atual (this)
        this.add.button(0, 0, 'menu', this.startGame, this);
    },
    startGame: function () {
        this.state.start('Game');
    }
```

## Iniciar um state do jogo
```js
	create: function(){
		game.state.start('fase1');
	}
```

## Trabalhando com teclado
Adicionar o controle do jogador pelas setas do teclado
```js
	create():
	cursors = game.input.keyboard.createCursorKeys();
```

Adicionar os controles e as teclas no update():
```js
	// Manter o player parado inicialmente e sempre que nenhuma tecla estiver sendo pressionada
	this.player.body.velocity.x = 0;
	this.player.body.velocity.y = 0;
	
	if(this.controls.left.isDown){
		this.player.body.velocity.x = -100;
	} else if(this.controls.right.isDown){
		this.player.body.velocity.x = 100;
	}
		
	if(this.controls.up.isDown){
		this.player.body.velocity.y = -100;
	} else if(this.controls.down.isDown){
		this.player.body.velocity.y = 100;
	}
```

## Mudar a cor de fundo do Stage atual
```js
	preload():
    game.stage.backgroundColor = '#061f27';
```

## Adicionar suporte a Física no Jogo

No método preload(), a física do tipo ARCADE:
	
game.physics.startSystem(Phaser.Physics.ARCADE);

## Usando a física detectar colisão entre dois objetos do jogo:
```js
	update():
	game.physics.arcade.collide(this.player,this.blocks);
	// Assim o player esbarrará nos blocos
```

## Usando a física com detecção de colisão mas sem esbarrar
```js
	update():
	game.physics.arcade.overlap(this.player,this.coin,this.getCoin,null,this);
	// A função getCoin conterá o comportamento para a colisão
```

## Habilitar a física para o enemy:
```js
	update():
	game.physics.arcade.enable(this.enemy);
```

Assim ele pode colidir com outros objetos

## Testar se jogador colidiu com as bordas do canvas
```js
	create():
	player.body.collideWorldBounds = true;
```

## Desabilitar colisão com o fundo
```
	create():
    game.physics.arcade.checkCollision.down = false;
```

## Alinhamento de objetos com a física
```
	create():
	this.txtTimer.anchor.set(1,0); // Totalmente colado à direita (1 em x) e colado acima (0 em y)
```

## Habilitar física em um objeto
```js
	create():
	game.physics.arcade.enable(this.coin);
```
ou?	

	this.blocks.enableBody = true;

## Checar se game object colide com bordas do canvas
```js
	create():
	ball.checkWorldBounds = true;
```

## Tornar um objeto inamovível, fixo, parado
```js
	create():
	block.body.immovable = true;
```
## Matar/destruir objeto do jogo
```js
	update():
	this.coin.kill();
```
## Usando o efeito tween

Adicionar ao create():
```js
	game.add.tween(txtPressStart).to({y:250},1000).start();
		
	game.time.events.add(1000,function(){
		game.add.tween(txtHighScore).to({alpha:1},500).to({alpha:0},500).loop().start();
		
		var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
			enterKey.onDown.addOnce(this.startGame,this);
	},this);
```
## Adicionar grupo
```js
	create():
	this.blocks = game.add.group();
```
Adicionar elementos ao grupo
```js
	this.blocks.create(width*0.1, height*0.1, 'block');
	this.blocks.create(width*0.9, height*0.1, 'block');
	this.blocks.create(width*0.1, height*0.9, 'block');
	this.blocks.create(width*0.9, height*0.9, 'block');
```
## Criar animação de sprites
```js
	create():
	Um spritesheet tem 4 conjuntos de 8 sprites cada, em 4 linhas, sendo 32, de 0 a 31
	this.player.animations.add('goDown',[0,1,2,3,4,5,6,7],12,true);
	this.player.animations.add('goUp',[8,9,10,11,12,13,14,15],12,true);
	this.player.animations.add('goLeft',[16,17,18,19,20,21,22,23],12,true);
	this.player.animations.add('goRight',[24,25,26,27,28,29,30,31],12,true);
```
## Fazer bola rebater nas bordas do canvas
```js
	create():
    ball.body.bounce.set(1);
```

## // add a timer that periodically increases 
```js
	create():
    // the ball speed while playing.
    game.time.events.loop(Phaser.Timer.SECOND * SPEEDUP_TIMEOUT, speedUpBall, this);
```
## Remover força da graficade
```js
	create():
	objeto.gravity = 0;
```
## Mudar efeito sonoro
```js
	create():
    // add our game sounds from preloaded audio data
    smallBlipSound = game.add.audio('small-blip', 1, false);
```

## Testando se barra de espaços está pressionada
```js
	update():
	if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
```
## Visibilidade de objeto
```js
	objeto.visible = true/false;
```
## Faz texto seguir câmera
```js
	create():
    textoMoedas.fixedToCamera = true;
```
## Faz câmera seguir jogador
```js
	create():
    game.camera.follow(jogador);
```
## Impedir jogador de girar
```js
	create():
    jogador.body.fixedRotation = true;
```

## Define com quais grupos de colisão o inimigo irá colidir
```js
    inimigo.body.collides([playerCG, groundCG, platformCG, enemyboundsCG]);
```
## Controlar pause
```js
	this.game.paused = false;
```
## loop foreach
```js
	// loop through all candy on the screen
	this._candyGroup.forEach(function(candy){
		// to rotate them accordingly
		candy.angle += candy.rotateMe;
	});
```
## Suporte de áudio no Phaser:
- mp3
- ogg
- wav
- m4a (iOS)

Tabela no site do W3C (https://www.w3schools.com/html/html5_audio.asp)
```html
Browser 			MP3 	Wav 	Ogg

Internet Explorer 	YES 	NO 		NO
Chrome 				YES 	YES 	YES
Firefox 			YES 	YES 	YES
Safari 				YES 	YES 	NO
Opera 				YES 	YES 	YES
```
Ver também - https://sonos.custhelp.com/app/answers/detail/a_id/80/~/supported-audio-formats

## Matemática no Phaser

Phaser.Math

Ver também Phaser.Utils

## Alguns métodos:

- angleBetween
- average
- ceilTo
- degToRad
- difference
- distance
- factorial
- floorTo
- isEven
- isOdd
- linear
- max
- maxAdd
- min
- minSub
- percent
- radToDeg
- roundTo
- sign
- sinCosGenerator

## Documentação
https://photonstorm.github.io/phaser-ce/

https://photonstorm.github.io/phaser-ce/Phaser.Math.html

http://phaser.io/docs/2.6.2/Phaser.Math.html

http://phaser.io/docs/2.6.2/Phaser.Time.html

http://phaser.io/docs/2.6.2/Phaser.Timer.html


