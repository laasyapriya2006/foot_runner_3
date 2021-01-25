const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var runningMan,runningManImg,collidedMan,jumpingMan,invisibleGround;
var birdImg,bg,bgImg,startBg;
var food1Img,food2Img;
var foodGroup,birdGroup;
var foodScore = 0;
var playButton,restartButton,playImg,restartImg;
var fruit_Coin_Sound,jumpingSound,bird_Rock_Sound;  
var gameState = "start";
var life1,life2,life3,lifeImg,lifeCount = 3;

function preload()
{
	runningManImg = loadAnimation("images/rm1.png","images/rm2.png","images/rm3.png","images/rm4.png");
	collidedMan = loadAnimation("images/collidedMan.png");
	jumpingMan = loadAnimation("images/rm1.png");

	birdImg = loadAnimation("images/bird1.png","images/bird2.png","images/bird3.png");

	food1Img = loadImage("images/food1.png");
	food2Img = loadImage("images/food2.png");

	bgImg = loadImage("images/background1.jpeg");
	startBg = loadImage("images/startBackground.jpg");

	playImg = loadImage("images/playButton.png");
	restartImg = loadImage("images/restartButton.png");

	lifeImg = loadImage("images/lives.png");

	fruit_Coin_Sound = loadSound("sounds/collectFruitCoin.mp3");
	jumpingSound = loadSound("sounds/touchBirdCoin.mp3");
	bird_Rock_Sound = loadSound("sounds/jumping.m4a");

}

function setup() {
	createCanvas(displayWidth-5,displayHeight-145);
	
	engine = Engine.create();
	world = engine.world;

	bg = createSprite(width/2,height/2,displayWidth-5,displayHeight-145);
    bg.addImage("backgroundImage",bgImg);
	bg.velocityX = -4;
	bg.scale = 1.25;
	bg.visible = false;

	runningMan = createSprite(300,350);
	runningMan.addAnimation("running",runningManImg);
	runningMan.addAnimation("collided",collidedMan);
	runningMan.visible = false;

	playButton = createSprite(300,300);
	playButton.addImage("playButton",playImg);
	playButton.scale = 5/20;
	playButton.visible = false;

	restartButton = createSprite(800,10);
	restartButton.addImage("restartButton",restartImg);
	restartButton.visible = false;

	life1 = createSprite(displayWidth-200,50);
	life1.addImage(lifeImg);
	life1.scale = 0.05;
	life1.visible = false;

	life2 = createSprite(displayWidth-250,50);
	life2.addImage(lifeImg);
	life2.scale = 0.05;
	life2.visible = false;

	life3 = createSprite(displayWidth-300,50);
	life3.addImage(lifeImg);
	life3.scale = 0.05;
	life3.visible = false;

	invisibleGround = createSprite(displayWidth/2,displayHeight-240,displayWidth,10);
	invisibleGround.visible = false;

	foodGroup = new Group();
	birdGroup = new Group();

	Engine.run(engine);
  
}

function draw() {
  rectMode(CENTER);
  //background("black");



  if(gameState === "start")
  {
	  //bg.changeImage("startBackground",startBg);
	  background(startBg);
	  fill("black");
	  textSize(20);
	  textFont("Verdana");
	  text("Rob was on his way to the park when he saw a cave which he went through \n" + 
	  "and he saw a spooky jungle, to his wonder the cave disappeared.Now the only\n"+
	  "way to reach back to the park was to survive the jungle by facing different \n"+
	  "challenges.You must help him now!\n"+
	  "                                  \n"+
	  " INSTRUCTIONS: \n"+
	  "- You have three lives\n"+
	  "- Escape from the birds and rocks\n"+
	  "- Collect the food and coins\n"+
	  "- You can jump using the up-arrow",30,30);

	  text("Click here to play",30,300);
	  playButton.visible = true;

	  drawSprites();
  }

  if(mousePressedOver(playButton))
  {
	  gameState = "play";
  }

  if(gameState === "play")
  {
	background("white");

	if (bg.x < 470)
	{
	  bg.x = width/2;
	}

	bg.visible = true;
	runningMan.visible = true;
	playButton.visible = false;
	life1.visible = true;
	life2.visible = true;
	life3.visible = true;

	spawnBirds();
	spawnFood();
	collectFood();  
	touchBird();

	drawSprites();

	fill("black");
	textSize(20);
	text("Score: "+foodScore,50,50);

	if(keyWentDown("UP_ARROW"))
	{
		runningMan.velocityY = -10;
		runningMan.changeAnimation("jumpingMan",jumpingMan);
	}
	runningMan.velocityY = runningMan.velocityY+0.5;

	runningMan.collide(invisibleGround);
  } 
 
}

function spawnBirds(){
	if(frameCount%500 === 0){
	
		var bird = createSprite(displayWidth,random(displayHeight-350,displayHeight-450));
		bird.addAnimation("birdFlying",birdImg);
		bird.velocityX = -5;
		bird.scale = 0.5;
		bird.lifetime = 300;
		bird.mirrorX(bird.mirrorX()*-1);

		birdGroup.add(bird);
	}
}

function spawnFood(){
	if(frameCount%200 === 0){
		
		var food = createSprite(displayWidth-5,random(displayHeight-350,displayHeight-550));
		var rand = Math.round(random(1,2));
    	switch (rand) {
		case 1:
			food.addImage("strawberry",food1Img);
			break;
		case 2:
			food.addImage("carrot",food2Img);
			break;
		default:
			break;
		}

	food.scale = 0.5;
	food.velocityX = -4;
	
	foodGroup.add(food);
	}
}

function spawnRocks(){
	if (frameCount%500 === 0)
	{
		var rock = createSprite(displayWidth-5,displayHeight-500);
		rock.velocityX = -2;
	}
}

function spawnCoins(){
	if(frameCount%200 === 0)
	{
		var coin = createSprite(displayWidth-5,random(displayHeight-350,displayHeight-550));
		coin.velocityX = -3;
	}
}

function collectFood(){
	for(var i = 0;i<foodGroup.length;i = i+1)
	{	
		if(runningMan.isTouching(foodGroup.get(i)))
		{
			foodGroup.get(i).lifetime = 0;
			foodGroup.get(i).remove();
			foodScore = foodScore+1;
			fruit_Coin_Sound.play();
		}

	}

}

function touchBird(){
	if(runningMan.isTouching(birdGroup))
	{
		foodScore = foodScore-1;
		bird_Rock_Sound.play();
		birdGroup.destroyEach();
		console.log(lifeCount);
		if(lifeCount === 3)
		{
			life1.destroy();
			//add sound 
			lifeCount = lifeCount-1;
			
		}
		else if(lifeCount === 2)
		{
			life2.destroy();
			//add sound
			lifeCount = lifeCount-1;
		}
		else if(lifeCount === 1)
		{
			life3.destroy();
			//add sound
			lifeCount = lifeCount-1;
			gameState = "end";
		}
		
	}
}