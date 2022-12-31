// declaring variables globally
var backgroundImg, backgroundImage, invisibleGround;
var ground,groundImage;
var mario, marioImage, marioCollided;
var brick,brickImage;
var obstacle, obstacleImage;
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var bricksGroup, obstaclesGroup;
var gameOver, gameOverImage, restart, restartImage;
var jumpSound, dieSound, checkPointSound;

// to load all the images and sounds
function preload(){
  backgroundImage = loadImage("bg.png");
  
  groundImage=loadImage("ground2.png");
  
  marioImage = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");
  
  brickImage = loadImage("brick.png");
  
  obstacleImage = loadAnimation("obstacle1.png", "obstacle2.png", "obstacle3.png", "obstacle4.png");
  
  marioCollided = loadAnimation("collided.png");
  
  gameOverImage = loadImage("gameOver.png");
  
  restartImage = loadImage("restart.png");
  
  // loading sounds
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  
}

function setup(){
  createCanvas(600,300);
  // creating the background
  backgroundImg = createSprite(300,180,600,10);
  backgroundImg.addImage("background", backgroundImage);
 // backgroundImg.scale = 2;
  
  // creating ground
  ground=createSprite(200,280,600,10);
  ground.addImage("ground",groundImage);
  
  // creating mario
  mario = createSprite(50,240,30,50);
  mario.addAnimation("marioRunning", marioImage); 
  mario.addAnimation("marioCollided", marioCollided);
  mario.scale = 1.4;
  
  // to set the collision radius of Mario
  mario.setCollider("rectangle", 0,0,20,30);
  //mario.debug = true;
  
  // creating invisible ground
  invisibleGround = createSprite(0,252,600,20);
  invisibleGround.visible = false;
  
  // creating groups
  bricksGroup = new Group();
  obstaclesGroup = new Group();
  
  gameOver = createSprite(300,110,10,10);
  gameOver.addImage(gameOverImage);
  gameOver.scale=0.5;
  
  restart=createSprite(300,150,10,10);
  restart.addImage(restartImage)
  restart.scale=0.5;
  
}

function draw(){
    background("white");
  
  if(gameState === PLAY){
    
    gameOver.visible = false;
    restart.visible = false;
    
    // to make mario jump
    if(keyDown("space") && mario.y > 200){
      jumpSound.play();
      mario.velocityY = -10;
      
    }
    
    // to add gravity
    mario.velocityY = mario.velocityY + 0.5;
     
      
    // backward velocity to background
    ground.velocityX = -(4 + 3* score/100);
    
      
    // logic to create illusion for the infinite loop
    if(ground.x < 0){
      ground.x = ground.width/2;
    }
    
    // if mario touches bricks
    if(mario.isTouching(bricksGroup)){
      score = score + 10;
      bricksGroup[0].destroy();
    }
    
    if(score > 0 && score % 100 === 0){
      checkPointSound.play();
    }
    
    // to check if mario touches obstacles
    if(mario.isTouching(obstaclesGroup)){
      gameState = END;
      dieSound.play();
    }
    
    // spawn the bricks and obstacles
    spawnBricks();
    spawnObstacles();
    
  }
  
  // if game state is end
  else if(gameState === END){
    // setting velocities of ground and mario to 0
      mario.velocityX = 0;
      mario.velocityY = 0;
      ground.velocityX =0;
    
      mario.changeAnimation("marioCollided",marioCollided);
      gameOver.visible = true;
      restart.visible = true;  
    
    // setting negative lifetime so that they do not get vanish 
      bricksGroup.setLifetimeEach(-1);
      obstaclesGroup.setLifetimeEach(-1);
      
    // setting velocity X to 0 for both the groups
      bricksGroup.setVelocityXEach(0);
      obstaclesGroup.setVelocityXEach(0); 
      
  }
  
  // to prevent mario from falling down
  mario.collide(ground);
  
  // if restart is pressed, reset the game
  if(mousePressedOver(restart)){
    reset(); // calling function reset()
  }
  
  drawSprites();
  
  fill("black");
  text("Score : " +score ,500,70);
  //score = score + Math.round(frameCount/120);
}
// to spawn the bricks
function spawnBricks(){
  
  if(frameCount % 60 === 0){
    // creating bricks
    brick = createSprite(600,150,20,20);
    
    brick.y = Math.round(random(120,170));
    brick.addImage("brick", brickImage);
    // to set the lifetime to the brick variable
    brick.lifetime = 200;
    
    brick.velocityX = -5;
    
    // adjust the depth
    brick.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //console.log(brick.depth); 
    //console.log(mario.depth);
    
    // adding brick sprites to one group
    bricksGroup.add(brick);  
  }
}

// to draw the obstacles
function spawnObstacles(){
  if(frameCount % 110 === 0){
    
    // creating obstacles
    obstacle = createSprite(600,215,20,20);
    obstacle.addAnimation("obstacle", obstacleImage);
    obstacle.velocityX = -5;
    // to set the lifetime to the obstacle variable
    obstacle.lifetime = 200;
    
    // adding obstacle sprites to one group
    obstaclesGroup.add(obstacle);
  }
}

// declaring function reset() to reset the game
function reset(){
  // reseting game state to play again
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  // to destroy the obstacles and bricks when the game is reset
  obstaclesGroup.destroyEach();
  bricksGroup.destroyEach();
  
  // mario.changeAnimation("Mario", marioImage);
  mario.changeAnimation("marioRunning",marioImage);
  
  // reset the score
  score = 0;
}
