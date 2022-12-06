//set largura and altura variables for game
var largura = 480;
var altura = 320;
//create game object and initialize the canvas
var game = new Phaser.Game(largura, altura, Phaser.AUTO, null, {preload: preload, create: create, update: update});

//initialize some variables
var jogador;
var alimento;
var cursors;
var velocidade = 175;
var pontos = 0;
var pontosTexto;

function preload() {
	//set background color of canvas
	game.stage.backgroundColor = '#eee';

	//load assets
	game.load.image('jogador', 'img/blue-square.png');
	game.load.image('alimento', 'img/red-square.png');
}
function create() {
	//start arcade physics engine
	game.physics.startSystem(Phaser.Physics.ARCADE);

	//initialize keyboard arrows for the game controls
	cursors = game.input.keyboard.createCursorKeys();

	//add jogador sprite
	jogador = game.add.sprite(largura*0.5, altura*0.5, 'jogador');
	//set anchor point to center of the sprite
	jogador.anchor.set(0.5);
	//enable physics for the jogador body
	game.physics.enable(jogador, Phaser.Physics.ARCADE);
	//make the jogador collide with the bounds of the world
	jogador.body.collideWorldBounds = true;

	//create a group called alimento and add 4 alimento pieces to the game
	alimento = game.add.group();
	alimento.create(largura*0.1, altura*0.1, 'alimento');
	alimento.create(largura*0.9, altura*0.1, 'alimento');
	alimento.create(largura*0.1, altura*0.9, 'alimento');
	alimento.create(largura*0.9, altura*0.9, 'alimento');
	//set the anchors of their sprites to the center
	for (var i in alimento.children) {
		alimento.children[i].anchor.set(0.5);
	}
	//enable physics for the alimento
	game.physics.enable(alimento, Phaser.Physics.ARCADE);

	//place pontos text on the screen
	pontosTexto = game.add.text(5, 3, pontos);
}
function update() {

	//move the jogador up and down based on keyboard arrows
	if (cursors.up.isDown) {
		jogador.body.velocity.y = -velocidade;
	}
	else if (cursors.down.isDown) {
		jogador.body.velocity.y = velocidade;
	}
	else {
		jogador.body.velocity.y = 0;
	}

	//move the jogador right and left based on keyboard arrows
	if (cursors.left.isDown) {
		jogador.body.velocity.x = -velocidade;
	}
	else if (cursors.right.isDown) {
		jogador.body.velocity.x = velocidade;
	}
	else {
		jogador.body.velocity.x = 0;
	}

	//call eatalimento function when the jogador and a piece of alimento overlap
	game.physics.arcade.overlap(jogador, alimento, eatalimento);
}
//eatalimento function
function eatalimento(jogador, alimento) {
	//remove the piece of alimento
	alimento.kill();
	//update the pontos
	pontos++;
	pontosTexto.text = pontos;
}
