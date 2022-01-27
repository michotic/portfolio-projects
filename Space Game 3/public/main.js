//Created by Michael Taylor, August 2018


var socket;
var port = 7777;

var tileList = [],
  decalList = [],
  particleList = [],
  interactiveList = [],
  nodeList = [],
  dialogueList = [];

var inventory = [];

//contains all arrays to simplify drawing code,
//ordered by which is drawn last to first
var arrayContainer = [
  decalList,
  nodeList,
  interactiveList,
  particleList,
  tileList
];

//fetches assets before game runs
function preload() {
  //Fonts
  dialogueFont = loadFont("assets/fonts/dialogue.ttf");
  //Sprite sheets
  characterIdleSheet = loadImage("assets/graphics/character/characterIdleSheet.png");
  characterWalkSheet = loadImage("assets/graphics/character/characterWalkSheet.png");
  characterArmedSheet = loadImage("assets/graphics/character/characterArmedSheet.png");
  characterArmedWalkSheet = loadImage("assets/graphics/character/characterArmedWalkSheet.png");
  tileSheet = loadImage("assets/graphics/tiles/tileSheet1.png");

  //Interactive Images
  interactivePromptImage = loadImage("assets/graphics/prompts/interactivePrompt.png")
  crashedShipImage = loadImage("assets/graphics/ship/crashedShip.png");

  //Node Images
  stoneNodeImage = loadImage("assets/graphics/nodes/stoneNode.png");
  plantNodeImage = loadImage("assets/graphics/nodes/plantNode.png");

  //Overlays
  vignetteImage = loadImage("assets/graphics/overlays/vignetteOverlay.png");
  leftBackgroundImage = loadImage("assets/graphics/overlays/leftBackground.PNG");
  rightBackgroundImage = loadImage("assets/graphics/overlays/rightBackground.PNG");
  laserGunImage = loadImage("assets/graphics/items/laserGun.png");

  //SFX
  footstepSound = loadSound("assets/sounds/footstep.wav");
}

function setup() {
  var ip = 'localhost' + port;
  frameRate(60);
  cnv = createCanvas(1024, 576);
  centerCanvas();
  noSmooth();
  imageMode(CENTER);
  textAlign(CENTER);
  rectMode(CENTER);
  ellipseMode(CENTER);
  strokeCap(SQUARE);
  noStroke();
  masterVolume(0.2);

  scene = 0; //0 = game

  xOffset = 0;
  TILE_SIZE = int(width * 0.064) / 2; //1 tile == 16px
  PIXEL_SIZE = TILE_SIZE / 16
  GRAVITY_FORCE = TILE_SIZE / 4 / 60;
  COLLISION_BUFFER = TILE_SIZE * 0.2;
  INTERACT_RANGE = TILE_SIZE * 2.5;
  BEAM_RANGE = TILE_SIZE * 8;
  DIALOGUE_FONT_SIZE = PIXEL_SIZE * 12;
  INVENTORY_SIZE = 5;

  createTerrain(100);

  leftBackgroundObject = new backgroundObject(0, leftBackgroundImage);
  rightBackgroundObject = new backgroundObject(width, rightBackgroundImage);

  for (var i = 0; i < INVENTORY_SIZE; i++) {
    inventory.push(new itemObject(-1,
      "empty",
      0));
  }

  playerVar = new playerObject(width / 2,
    0,
    TILE_SIZE / 2,
    TILE_SIZE * 2,
    8,
    8,
    32);

  playerWeapon = new weaponObject(width / 2,
    0,
    1);
}

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function windowResized() {
  //resizeCanvas(windowWidth,
  //  windowHeight);
  centerCanvas();
}

function keyCheck() {
  if (keyIsDown(65)) {
    playerVar.moveLeft();
  }
  if (keyIsDown(68)) {
    playerVar.moveRight();
  }
}

function keyPressed() {
  if (keyCode == 32) {
    playerVar.jump();
  }

  if (keyCode == 69) {
    for (var i = 0; i < interactiveList.length; i++) {
      if (dist(playerVar.xpos,
        playerVar.ypos,
        interactiveList[i].xpos + xOffset,
        interactiveList[i].ypos) < INTERACT_RANGE) {
        interactiveList[i].interact();
        print('main interact');
      }
    }
  }
}

function keyReleased() {
  if (keyCode == 32) {
    playerVar.yVel *= 0.5;
  }
}

function mouseCheck() {
  if (mouseIsPressed &&
    mouseButton === LEFT) {
    playerWeapon.showBeam();
  }
}

function showInteractiveIcon() {
  for (var i = 0; i < interactiveList.length; i++) {
    if (dist(playerVar.xpos,
      playerVar.ypos,
      interactiveList[i].xpos + xOffset,
      interactiveList[i].ypos) < INTERACT_RANGE) {
      //show E icon
      if (dialogueList.length < 1) {
        image(interactivePromptImage,
          playerVar.xpos,
          playerVar.ypos - (TILE_SIZE * 1.5),
          TILE_SIZE,
          TILE_SIZE);
      }
    }
  }
}

function drawArrays() {
  for (var i = 0; i < arrayContainer.length; i++) {
    for (var j = 0; j < arrayContainer[i].length; j++) {
      if (onScreen(arrayContainer[i][j].xpos + xOffset)) {
        arrayContainer[i][j].draw();

        if (arrayContainer[i][j].life < 0) {
          if (arrayContainer[i][j].destroyedAction !== undefined) {
            arrayContainer[i][j].destroyedAction();
          }
          arrayContainer[i].splice(j, 1);
        }
      }

    }
  }
}

function drawDialogue() {
  for (var i = 0; i < dialogueList.length; i++) {
    dialogueList[i].draw();

    if (dialogueList[i].life < 0) {
      dialogueList.splice(i, 1);
    }
  }
}

function onScreen(x) {
  if (x > 0 - (TILE_SIZE * 2) &&
    x < width + (TILE_SIZE * 2)) {
    return true;
  } else {
    return false;
  }
}

function diff(num1, num2) {
  return num1 - num2;
}

function draw() {
  if (scene == 0) { drawGame(); }
}

function drawGame() {
  //Updates Background.
  leftBackgroundObject.draw();
  rightBackgroundObject.draw();

  keyCheck();
  mouseCheck();
  drawArrays();
  //showInteractiveIcon();
  playerVar.draw();

  if (mouseIsPressed) {
    playerWeapon.draw();
  }

  image(vignetteImage,
    width / 2,
    height / 2,
    width,
    height);
  drawDialogue();

  fill(255);
  textFont(dialogueFont);
  textSize(PIXEL_SIZE * 6);
  //text("Inventory", width / 2, 30);
  /*
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].itemAmount > 0) {
      text(inventory[i].itemName + " x " + inventory[i].itemAmount, width / 2, 30 * (i + 2));
    }
  }*/
}