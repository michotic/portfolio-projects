// "Fight Your Friends" (previously "Night Game")
//Made by Michael Taylor
//Started in January 11th, 2018

var ip = 'localhost';
var port = 7777;
var pvp = true;
var damageTint = (255, 100, 100);


//Beginning of declared variables.
var amountOfClasses = 6;
var selectedClass = 1;

var canvasWidth = 960,
  canvasHeight = 600;

var canvas,
  tileSize,
  socket,
  player,
  gravityForce,
  UUID,
  scene,
  screenState,
  particleAmount,
  soundVolume;

var tileList = [];
var aiList = [];
var projectileList = [];
var particleList = [];
var playerList = [];
var playerAmount = 0;
var aiAmount = 0;

var objectXOffset = 0; //Objects offset from player (used for scrolling effect.)
//End of declared variables.

//Loads assets before executing setup.
function preload() {
  //Images.
  leftBackgroundImage = loadImage("assets/sprites/leftBackground.PNG");
  rightBackgroundImage = loadImage("assets/sprites/rightBackground.PNG");
  vignetteImage = loadImage("assets/sprites/vignette.PNG");
  tileSheet = loadImage("assets/sprites/tileSheet.PNG");
  characterSheet = loadImage("assets/sprites/characterSheet.PNG");
  aiSheet = loadImage("assets/sprites/aiSheet.PNG");
  uiSheet = loadImage("assets/sprites/uiSheet.PNG");

  //Fonts.
  mainFont = loadFont("assets/fonts/mainFont.ttf");
  secondaryFont = loadFont("assets/fonts/secondaryFont.ttf");

  menuSelectSound = loadSound("assets/sounds/menus/menuSelect.wav"); //Menu sounds.
  menuPressSound = loadSound("assets/sounds/menus/menuPress.wav");

  playerMeleeAttackSound = loadSound("assets/sounds/player/attack/playerMeleeAttack.wav"); //Player attack sounds.
  playerRangeAttackSound = loadSound("assets/sounds/player/attack/playerRangeAttack.wav");

  playerDamagedSound = loadSound("assets/sounds/player/damage/playerDamaged.wav"); //Player damage sounds.
  otherPlayerDamagedSound = loadSound("assets/sounds/player/damage/otherPlayerDamaged.wav");
  playerDeathSound = loadSound("assets/sounds/player/damage/playerDeath.wav");

  playerFootstepSound = loadSound("assets/sounds/player/movement/playerFootstep.wav"); //Player movement sounds.
  playerJumpingSound = loadSound("assets/sounds/player/movement/playerJumping.wav");
  playerLandingSound = loadSound("assets/sounds/player/movement/playerLanding.wav");

  knightSpecialSound = loadSound("assets/sounds/specials/knightSpecial.wav"); //Special attack sounds.
  mageSpecialSound = loadSound("assets/sounds/specials/mageSpecial.wav");
  rogueSpecialSound = loadSound("assets/sounds/specials/rogueSpecial.wav");
  paladinSpecialSound = loadSound("assets/sounds/specials/paladinSpecial.wav");
  ninjaSpecialSound = loadSound("assets/sounds/specials/ninjaSpecial.wav");
  archerSpecialSound = loadSound("assets/sounds/specials/archerSpecial.wav");
  unavailableSpecialSound = loadSound("assets/sounds/specials/unavailableSpecial.wav");
}

//Fetches user's desired username.
function getUsername() {
  var nameList = ['Harold', 'John', 'Walter', 'Cesar', 'William'];
  //username = prompt("Please enter your name, (3-20 Characters)");
  //if (username == null) {
  username = nameList[int(random(nameList.length))];
  //}
  username = username.toUpperCase();
  //Ensures username is valid.
  if (username.length > 20) {
    alert("Username too long");
    getUsername();
  } else if (username.length < 3) {
    alert("Username too short");
    getUsername();
  }
}

//Centers canvas.
function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas.position(x, y);
}

//Recenters canvas on page when resized.
function windowResized() {
  centerCanvas();
}

//Sets up initial values.
function setup() {
  screenState = fullscreen();
  canvas = createCanvas(canvasWidth, canvasHeight);
  centerCanvas();
  frameRate(60);
  noStroke();
  noSmooth();
  noCursor();
  rectMode(CENTER);
  ellipseMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER);

  UUID = Math.floor(Math.random() * 9999999999); //Sets user's UUID.
  tileSize = 64;
  mouseDown = false;
  particleAmount = 25;
  soundVolume = 0.2;
  musicVolume = 0.5;

  getUsername();
  socket = io.connect('http://' + ip + ':' + port); //Connects to node.js server.
  enableSockets();

  masterVolume(soundVolume);

  particleList = [];
  for (var i = 0; i < int(particleAmount); i++) {
    particleList.push(new particle());
  }

  scene = -1;
  setupScene(0);
}

//Turns on all sockets.
function enableSockets() {
  receiveAIData();
  receiveData();
  receiveTerrainData();
  socket.on('clientAmount',
    function (clientAmount) {
      playerAmount = clientAmount; //Detects # of players online and sets 'playerAmount' to said #.
    }
  );

  socket.on('AIAmount',
    function (AIAmount) {
      aiAmount = AIAmount; //Detects # of players online and sets 'playerAmount' to said #.
    }
  );
}

//Runs setup for desired scene, (tempScene = scene #).
function setupScene(tempScene) {
  if (tempScene == 0) {
    scene = 0;
    setupMainMenuScene();
  }
  if (tempScene == 1) {
    scene = 1;
    setupGameScene();
  }
  if (tempScene == 2) {
    scene = 2;
    setupClassSelectionScene();
  }
  if (tempScene == 3) {
    scene = 3;
    setupOptionsScene();
  }
}

//Sets up main scene.
function setupMainMenuScene() {
  mainMenuBackgroundObject = new backgroundObject(canvasWidth / 2, rightBackgroundImage);
  playButton = new menuButton(canvasWidth / 2, (canvasHeight / 2) - tileSize, 'Play', 1);
  classButton = new menuButton(canvasWidth / 2, (canvasHeight / 2), 'Classes', 2);
  optionsButton = new menuButton(canvasWidth / 2, (canvasHeight / 2) + tileSize, 'Options', 3);
}

//Sets up game scene.
function setupGameScene() {
  leftBackgroundObject = new backgroundObject(0, leftBackgroundImage);
  rightBackgroundObject = new backgroundObject(canvasWidth, rightBackgroundImage);
  gravityForce = 0.5;
  player = new playerObject(canvasWidth / 2, -canvasHeight, tileSize, username, selectedClass);
  backButton = new iconButton(tileSize, tileSize, 1);

  for (var i = 0; i < playerList.length; i++) {
    playerList[i].ypos = -canvasHeight;
  }
}

//Sets up class selection scene.
function setupClassSelectionScene() {
  classMenuBackgroundObject = new backgroundObject(canvasWidth / 2, rightBackgroundImage);
  backButton = new iconButton(tileSize, tileSize, 1);
  classButtonList = [];

  for (var y = 1; y <= ceil(amountOfClasses / 6); y++) {
    for (var x = -2; ((x <= amountOfClasses - ((y - 1) * 3)) && x <= 3); x++) {
      classButtonList.push(new iconButton(((tileSize * 2) * (x - 1)) + (canvasWidth / 2) + tileSize, (y * tileSize * 2) + (canvasHeight / 5), 100 + (x + 3) + ((y - 1) * 6)));
    }
  }
}

function setupOptionsScene() {
  optionsBackgroundObject = new backgroundObject(canvasWidth / 2, rightBackgroundImage);
  backButton = new iconButton(tileSize, tileSize, 1);
  particleIncreaseButton = new iconButton(canvasWidth / 2 + tileSize * 4, (96 * 1.5) + (36 * 1.5), 2.1);
  particleDecreaseButton = new iconButton(canvasWidth / 2 + tileSize * 2, (96 * 1.5) + (36 * 1.5), 3.1);
  volumeIncreaseButton = new iconButton(canvasWidth / 2 + tileSize * 4, (96 * 1.5) + (36 * 3.5), 2.2);
  volumeDecreaseButton = new iconButton(canvasWidth / 2 + tileSize * 2, (96 * 1.5) + (36 * 3.5), 3.2);
}

drawTimer = 0;
//Called 60x per second, (hopefully).
function draw() {
  drawTimer++;
  if (scene == 0) {
    drawMainMenuScene();
  }
  if (scene == 1 && drawTimer >= 1) {
    drawGameScene();
    drawTimer = 0;
  }
  if (scene == 2) {
    drawClassSelectionScene();
  }
  if (scene == 3) {
    drawOptionsScene();
  }

  pointer = image(uiSheet, mouseX, mouseY, tileSize, tileSize, 9 * 16, 0, [16], [16]); //Draws cursor.
}

//Draws main menu.
function drawMainMenuScene() {
  push();
  mainMenuBackgroundObject.draw();
  vignette = image(vignetteImage, canvasWidth / 2, canvasHeight / 2, canvasWidth, canvasHeight);

  //Draws particles.
  for (var i = 0; i < particleList.length; i++) {
    particleList[i].draw();
  }

  strokeWeight(8);
  stroke(0);
  fill(255);
  textFont(secondaryFont);
  textSize(96);
  text("Fight Your Friends", canvasWidth / 2, 96 * 1.5);
  textFont(mainFont);
  textSize(36);
  noStroke();
  text("by michael taylor", canvasWidth / 2, 96 * 2);
  playButton.draw();
  classButton.draw();
  optionsButton.draw();
  pop();
}

//Game loop.
function drawGameScene() {
  //Updates Background.
  leftBackgroundObject.draw();
  rightBackgroundObject.draw();

  //Checks for key presses and executes their corresponding actions.
  eventCheck();

  //Draws particles.
  for (var i = 0; i < particleList.length; i++) {
    particleList[i].draw();
  }

  //Draws tiles on screen.
  for (i = 0; i < tileList.length; i++) {
    if (onScreen(tileList[i].xpos + objectXOffset) == true) {
      tileList[i].draw();
    }
  }

  //Draws enemies on screen.
  for (i = 0; i < aiAmount && i < aiList.length; i++) {
    if (onScreen(aiList[i].xpos + objectXOffset) == true) {
      aiList[i].draw();
    }
  }
  if (aiAmount == 0) {
    aiList = [];
  }

  //Draws other players.
  for (var i = 0; i < playerList.length; i++) {
    if (i < playerAmount - 1) {
      if (onScreen(playerList[i].xpos + objectXOffset + (canvasWidth / 2)) == true) {
        playerList[i].draw();
      }
    }
  }

  //Draws user.
  player.draw();

  //Draws projectiles.
  for (i = 0; i < projectileList.length; i++) {
    projectileList[i].drawOtherProjectiles();
    if (projectileList[i].lifeSpan < 0) {
      projectileList.splice(i, 1); //Removes "dead" projectiles.
    }
  }

  vignette = image(vignetteImage, canvasWidth / 2, canvasHeight / 2, canvasWidth, canvasHeight);
  backButton.draw();
  push();
  textAlign(LEFT);
  textFont(secondaryFont);
  textSize(48);
  strokeWeight(8);
  fill(255);
  stroke(0);
  strokeWeight(8);
  text('HP: ' + player.lives + '/' + player.maxLives, tileSize / 4, canvasHeight - tileSize / 4);
  if (player.secondaryAttackCooldown > 0) {
    image(uiSheet, tileSize * 3.75, canvasHeight - tileSize / 2, tileSize, tileSize, 2 * 16, 0, [16], [16]);
  } else {
    image(uiSheet, (tileSize * 3.75) + random(-1, 1), (canvasHeight - tileSize / 2) + random(-1, 1), tileSize, tileSize, 3 * 16, 0, [16], [16]);
  }
  pop();
  //Sends user data.
  sendData(player.serverXpos, player.ypos, player.dir, UUID, player.lives, player.attacking, player.username, player.class, player.attackType, player.frame);
}

//Draws class selection menu.
function drawClassSelectionScene() {
  push();
  classMenuBackgroundObject.draw();
  vignette = image(vignetteImage, canvasWidth / 2, canvasHeight / 2, canvasWidth, canvasHeight);
  backButton.draw();

  //Draws particles.
  for (var i = 0; i < particleList.length; i++) {
    particleList[i].draw();
  }

  strokeWeight(8);
  stroke(0);
  fill(255);
  textFont(secondaryFont);
  textSize(96);
  text("Class Selection", canvasWidth / 2, 96 * 1.5);
  //Highlight behind selected class.
  var y = ceil(selectedClass / 6)
  selectedClassButton = image(uiSheet, tileSize * ((-12 * y) + (2 * selectedClass) + 10) + (canvasWidth / 2) + (tileSize * -5), (tileSize * 2 * y) + (canvasHeight / 5), tileSize * 2, tileSize * 2, 6 * 16, 0 * 16, [32], [32]);

  //Draws class buttons.
  for (var i = 0; i < classButtonList.length; i++) {
    classButtonList[i].draw();
  }
  pop();
}

//Draws options menu.
function drawOptionsScene() {
  push();
  optionsBackgroundObject.draw();
  vignette = image(vignetteImage, canvasWidth / 2, canvasHeight / 2, canvasWidth, canvasHeight);
  backButton.draw();

  //Draws particles.
  for (var i = 0; i < particleList.length; i++) {
    particleList[i].draw();
  }

  strokeWeight(8);
  stroke(0);
  fill(255);
  textFont(secondaryFont);
  textSize(96);
  text("Options", canvasWidth / 2, 96 * 1.5);
  textFont(mainFont);
  textSize(36);
  strokeWeight(4);
  textAlign(RIGHT);
  text("Amount of Snow: " + int(particleAmount), canvasWidth / 2, (96 * 1.5) + (36 * 1.5));
  text("Volume: " + int(soundVolume * 100) + '%', canvasWidth / 2, (96 * 1.5) + (36 * 3.5));

  particleIncreaseButton.draw();
  particleDecreaseButton.draw();
  volumeIncreaseButton.draw();
  volumeDecreaseButton.draw();
  pop();
}

//Takes user data as parameters, condenses and sends to server.
function sendData(xpos, ypos, xdir, tempUUID, tempLives, tempAttacking, tempUsername, tempClass, tempAttackType, tempFrame) {
  var data = {
    x: xpos,
    y: ypos,
    dir: xdir,
    UUID: tempUUID,
    life: tempLives,
    attacking: tempAttacking,
    username: tempUsername,
    class: tempClass,
    attackType: tempAttackType,
    frame: tempFrame
  };
  socket.emit('playerData', data);

  for (var i = 0; i < player.projectileList.length; i++) {
    var data = {
      x: player.projectileList[i].serverXpos,
      y: player.projectileList[i].ypos,
      dir: player.projectileList[i].dir,
      size: player.projectileList[i].size,
      UUID: player.projectileList[i].UUID,
      userUUID: player.projectileList[i].userUUID,
      lifeSpan: player.projectileList[i].lifeSpan,
      type: player.projectileList[i].type
    }
    socket.emit('projectileData', data);
  }
}

//Receives world data from server.
function receiveTerrainData() {
  socket.on('tileData',
    function (data) {
      tileList.push(new tile(data.x, data.y, data.size, data.type));
    }
  );
}

//Receives AI data from server.
function receiveAIData() {
  socket.on('aiData',
    function (data) {
      //Removes killed AI players.
      if (aiList.length > (aiAmount)) {
        aiList = [];
      }

      //Checks if received data is a new ai or not.
      var newAI = true;
      for (var i = 0; i < aiList.length; i++) {
        if (data.ID == aiList[i].UUID) {
          newAI = false;
        }
      }

      //Creates object for new enemies.
      if (aiList.length <= aiAmount - 1 && newAI == true) {
        aiList.push(new ai(data.x, -data.y, data.size, data.type, data.ID, data.frame));
      }

      //Updates pre-existing enemies.
      for (var i = 0; i < aiList.length; i++) {
        if (data.ID == aiList[i].UUID && onScreen(data.x + objectXOffset) == true) {
          aiList[i].xpos = data.x;
          aiList[i].ypos = data.y;
          aiList[i].frame = data.frame;
        }
        if (data.ID == aiList[i].UUID && onScreen(data.x + objectXOffset) == false) {
          aiList[i].ypos = -canvasHeight;
        }
      }
    }
  );
}

//Receives player and projectile data from server.
function receiveData() {
  //Player data portion.
  socket.on('playerData',
    function (data) {
      //Removes disconnected players.
      if (playerList.length > (playerAmount - 1)) {
        for (var i = 0; i < playerAmount; i++) {
          playerList.pop();
        }
      }

      //Checks if received data is a newly connected player or not.
      var newPlayer = true;
      for (var i = 0; i < playerList.length; i++) {
        if (data.UUID == playerList[i].UUID) {
          newPlayer = false;
        }
      }

      //Creates object for new players.
      if (playerList.length <= playerAmount - 1 && newPlayer == true) {
        playerList.push(new otherPlayer(data.x, -canvasHeight, data.dir, data.UUID, data.life, data.attacking, data.username, data.class, data.attackType));
      }

      //Updates pre-existing players.
      for (var i = 0; i < playerList.length; i++) {
        if (data.UUID == playerList[i].UUID) {
          playerList[i].xpos = data.x;
          playerList[i].ypos = data.y;
          playerList[i].dir = data.dir;
          playerList[i].lives = data.life;
          playerList[i].attacking = data.attacking;
          playerList[i].class = data.class;
          playerList[i].attackType = data.attackType;
          playerList[i].frame = data.frame;
        }
      }

    }
  );

  //Projectile data portion.
  socket.on('projectileData',
    function (data) {
      //Determines whether or not projectile is newly created.
      var newProjectile = true;
      for (var i = 0; i < projectileList.length; i++) {
        if (data.UUID == projectileList[i].UUID) {
          newProjectile = false;
        }
      }

      //Creates object for new projectiles.
      if (newProjectile == true) {
        projectileList.push(new projectile(data.x, data.y, data.size, data.dir, data.UUID, data.userUUID, 0, data.lifeSpan, data.type));
      }

      //Updates pre-existing projectiles.
      for (var i = 0; i < projectileList.length; i++) {
        if (data.UUID == projectileList[i].UUID) {
          projectileList[i].xpos = data.x;
          projectileList[i].ypos = data.y;
          projectileList[i].dir = data.dir;
          projectileList[i].userUUID = data.userUUID;
          projectileList[i].lifeSpan = data.lifeSpan;
          projectileList[i].type = data.type;
        }
      }
    }
  );

  //Receives information on kills that occur.
  socket.on('killData',
    function (data) {
      //Determines which user got the kill.
      if (data.killerUUID == UUID) {
        player.kills++
        player.killStreak++;
        //User gains life more melee kills.
        if (data.type == 'melee') {
          player.lives++;
        }
        //Invalidates 'killerUUID' so user kills only goes up once.
        data.killerUUID = 'invalid';
      }
    }
  );
}

//Checks if x is on screen
function onScreen(x) {
  if (x + tileSize > 0 && x - tileSize < canvasWidth) {
    return true;
  } else {
    return false;
  }
}

//Receives keyboard events and executes corresponding actions.
function eventCheck() {
  if (keyIsDown(65)) {
    player.moveLeft();
  }
  if (keyIsDown(68)) {
    player.moveRight();
  }
  if (keyIsDown(32)) {
    player.jump();
  }
  if (keyIsDown(37)) {
    player.mainAttack();
  }
  if (keyIsDown(40)) {
    player.secondaryAttack();
  }
}

function mousePressed() {
  mouseDown = true;
}

function mouseReleased() {
  mouseDown = false;
}
