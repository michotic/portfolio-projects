//Created by Michael Taylor, August 2018

var socket
var port = 7777

var tileList = [],
  decalList = [],
  particleList = [],
  interactiveList = [],
  nodeList = [],
  dialogueList = [],
  plotList = [],
  cropList = []

var inventory = []

//contains all arrays to simplify drawing code,
//ordered by which is drawn last to first
var arrayContainer = [
  decalList,
  nodeList,
  interactiveList,
  tileList,
  plotList,
  cropList,
  particleList
]

//fetches assets before game runs
function preload() {
  //Fonts
  dialogueFont = loadFont('assets/fonts/dialogue.ttf')
  //Sprite sheets
  characterIdleSheet = loadImage('assets/graphics/character/character.png')
  tileSheet = loadImage('assets/graphics/tiles/tileSheet.png')
  plotSheet = loadImage('assets/graphics/tiles/plotTile.png')
  wheatSheet = loadImage('assets/graphics/tiles/wheatTile.png')
  bridgeSheet = loadImage('assets/graphics/tiles/bridgeTile.png')
  boatSheet = loadImage('assets/graphics/tiles/boatTile.png')

  //Interactive Images
  interactivePromptImage = loadImage('assets/graphics/prompts/interactivePrompt.png')

  //Overlays
  tilePlaceOverlay = loadImage('assets/graphics/overlays/tilePlaceOverlay.png')
  hotbarOverlay = loadImage('assets/graphics/overlays/hotbarOverlay.png')
  itemSelectedOverlay = loadImage('assets/graphics/overlays/itemSelectedOverlay.png')
  leftBackgroundImage = loadImage('assets/graphics/overlays/leftBackground.png')
  rightBackgroundImage = loadImage('assets/graphics/overlays/rightBackground.png')

  //Icons
  hoeIcon = loadImage('assets/graphics/icons/hoeIcon.png')
  seedIcon = loadImage('assets/graphics/icons/seedIcon.png')
  wheatIcon = loadImage('assets/graphics/icons/wheatIcon.png')

  //SFX
  footstepSound = loadSound('assets/sounds/footstep.wav')
  impactSound = loadSound('assets/sounds/impact.wav')
  selectSound = loadSound('assets/sounds/select.wav')
  harvestSound = loadSound('assets/sounds/harvest.wav')
}

function setup() {
  var ip = 'localhost' + port
  frameRate(60)
  pixelDensity(1)
  cnv = createCanvas(1280, 720)
  centerCanvas()
  noSmooth()
  imageMode(CENTER)
  textAlign(CENTER)
  rectMode(CENTER)
  ellipseMode(CENTER)
  strokeCap(SQUARE)
  noStroke()
  masterVolume(0.2)

  scene = 0 //0 = game

  xOffset = 0
  yOffset = 0
  TILE_SIZE = 64 //1 tile == 16px
  PIXEL_SIZE = TILE_SIZE / 16
  GRAVITY_FORCE = TILE_SIZE / 4 / 60
  COLLISION_BUFFER = TILE_SIZE * 0.2
  INTERACT_RANGE = TILE_SIZE * 1
  DIALOGUE_FONT_SIZE = PIXEL_SIZE * 12
  INVENTORY_SIZE = 4

  createTerrain(5)

  leftBackgroundObject = new backgroundObject(0, leftBackgroundImage)
  rightBackgroundObject = new backgroundObject(width, rightBackgroundImage)

  hotbar = new hotbarObject()
  icons = [hoeIcon, seedIcon, wheatIcon]

  inventory.push(new itemObject(1, 'hoe', 1))
  inventory.push(new itemObject(2, 'seeds', 3))

  playerVar = new playerObject(width / 2, height / 2, TILE_SIZE, TILE_SIZE, 1, 16, 16)
}

function centerCanvas() {
  var x = (windowWidth - width) / 2
  var y = (windowHeight - height) / 2
  cnv.position(x, y)
}

function windowResized() {
  //resizeCanvas(windowWidth, windowHeight)
  centerCanvas()
}

function keyCheck() {
  if (keyIsDown(65)) {
    playerVar.moveLeft()
  }
  if (keyIsDown(68)) {
    playerVar.moveRight()
  }
  if (keyIsDown(87)) {
    playerVar.moveUp()
  }
  if (keyIsDown(83)) {
    playerVar.moveDown()
  }
}

function keyPressed() {
  if (keyCode >= 49 && keyCode <= 52) {
    hotbar.selSlot = keyCode - 48
  }

  if (keyCode == 69) {
    for (var i = 0; i < interactiveList.length; i++) {
      if (
        dist(
          playerVar.xpos,
          playerVar.ypos,
          interactiveList[i].xpos + xOffset,
          interactiveList[i].ypos + yOffset
        ) < INTERACT_RANGE
      ) {
        interactiveList[i].interact()
        return
      }
    }
  }
}

function showInteractiveIcon() {
  for (var i = 0; i < interactiveList.length; i++) {
    if (
      dist(
        playerVar.xpos,
        playerVar.ypos,
        interactiveList[i].xpos + xOffset,
        interactiveList[i].ypos + yOffset
      ) < INTERACT_RANGE
    ) {
      //show E icon
      image(
        interactivePromptImage,
        playerVar.xpos,
        playerVar.ypos - TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
      )
    }
  }
}

function drawArrays() {
  for (var i = 0; i < arrayContainer.length; i++) {
    for (var j = 0; j < arrayContainer[i].length; j++) {
      if (
        onScreen(arrayContainer[i][j].xpos + xOffset, arrayContainer[i][j].ypos + yOffset)
      ) {
        arrayContainer[i][j].draw()

        if (arrayContainer[i][j].life < 0) {
          if (arrayContainer[i][j].destroyedAction !== undefined) {
            arrayContainer[i][j].destroyedAction()
          }
          arrayContainer[i].splice(j, 1)
        }
      }
    }
  }
}

function drawDialogue() {
  for (var i = 0; i < dialogueList.length; i++) {
    dialogueList[i].draw()

    if (dialogueList[i].life < 0) {
      dialogueList.splice(i, 1)
    }
  }
}

function getTile(x, y) {
  for (var i = 0; i < tileList.length; i++) {
    if (dist(x, y, tileList[i].xpos, tileList[i].ypos) < TILE_SIZE / 1.9) {
      return tileList[i].type
    }
  }
}

function tileFree(x, y) {
  var free = false
  for (var i = 0; i < tileList.length; i++) {
    if (dist(x, y, tileList[i].xpos, tileList[i].ypos) < TILE_SIZE) {
      return free
    }
  }
  free = true
  return free
}

function plotFree(x, y) {
  var free = false
  for (var i = 0; i < plotList.length; i++) {
    if (dist(x, y, plotList[i].xpos, plotList[i].ypos) < TILE_SIZE / 2) {
      return free
    }
  }
  free = true
  return free
}

function cropFree(x, y) {
  var free = false
  for (var i = 0; i < cropList.length; i++) {
    if (dist(x, y, cropList[i].xpos, cropList[i].ypos) < TILE_SIZE / 2) {
      return free
    }
  }
  free = true
  return free
}

function onScreen(x, y) {
  if (
    x > 0 - TILE_SIZE * 2 &&
    x < width + TILE_SIZE * 2 &&
    y < height + TILE_SIZE * 2 &&
    y > 0 - TILE_SIZE * 2
  ) {
    return true
  } else {
    return false
  }
}

function diff(num1, num2) {
  return num1 - num2
}

function draw() {
  if (scene == 0) {
    drawGame()
  }
}

function drawGame() {
  //Updates Background.
  leftBackgroundObject.draw()
  rightBackgroundObject.draw()

  bobXScale = map(sin(frameCount / 5), -1, 1, 1.1, 1)
  bobYScale = map(sin(frameCount / 5), -1, 1, 0.9, 1)

  keyCheck()
  drawArrays()
  image(
    tilePlaceOverlay,
    int((mouseX + TILE_SIZE / 2 - xOffset) / TILE_SIZE) * TILE_SIZE + xOffset,
    int((mouseY + TILE_SIZE / 2 - yOffset) / TILE_SIZE) * TILE_SIZE + yOffset,
    TILE_SIZE,
    TILE_SIZE
  )

  playerVar.draw()
  showInteractiveIcon()
  drawDialogue()

  inventoryCheck()
  hotbar.draw()

  /*fill(255)
  textFont(dialogueFont)
  textSize(PIXEL_SIZE * 6)
  text('Inventory', width / 2, 30)
  for (var i = 0; i < inventory.length; i++) {
    text(inventory[i].itemName + ' x ' + inventory[i].itemAmount, width / 2, 30 * (i + 2))
  }*/
}

function mousePressed() {
  var mX = int((mouseX + TILE_SIZE / 2 - xOffset) / TILE_SIZE) * TILE_SIZE,
    mY = int((mouseY + TILE_SIZE / 2 - yOffset) / TILE_SIZE) * TILE_SIZE

  if (hotbar.selSlot - 1 < hotbar.slot.length) {
    //till the ground
    if (
      getTile(mX, mY) == 46 &&
      plotFree(mX, mY) &&
      hotbar.slot[hotbar.selSlot - 1].itemID == 1
    ) {
      if (!impactSound.isPlaying()) {
        impactSound.play()
      }
      plotList.push(new plotObject(mX, mY))
    } else if (
      getTile(mX, mY) == 46 &&
      !plotFree(mX, mY) &&
      cropFree(mX, mY) &&
      hotbar.slot[hotbar.selSlot - 1].itemID == 1
    ) {
      for (var i = 0; i < plotList.length; i++) {
        if (plotList[i].xpos == mX && plotList[i].ypos == mY) {
          if (!impactSound.isPlaying()) {
            impactSound.play()
          }
          plotList.splice(i, 1)
        }
      }
    }
    if (
      !plotFree(mX, mY) &&
      hotbar.slot[hotbar.selSlot - 1].itemID == 2 &&
      cropFree(mX, mY)
    ) {
      if (!impactSound.isPlaying()) {
        impactSound.play()
      }
      cropList.push(new cropObject(mX, mY))
      for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].itemID == 2) {
          inventory[i].itemAmount--
          inventoryCheck()
        }
      }
    }
  }
}

function mouseWheel(event) {
  var mouseChange
  if (event.delta > 0) {
    mouseChange = 1
  } else {
    mouseChange = -1
  }

  if (hotbar.selSlot >= 1 && hotbar.selSlot <= 4) {
    hotbar.selSlot += mouseChange
    selectSound.play()
    if (hotbar.selSlot < 1) {
      hotbar.selSlot = 4
    } else if (hotbar.selSlot > 4) {
      hotbar.selSlot = 1
    }
  }
}

function inventoryCheck() {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].itemAmount < 1) {
      inventory.splice(i, 1)
      break
    }

    for (var j = 0; j < inventory.length; j++) {
      if (inventory[i].itemID == inventory[j].itemID && i != j) {
        inventory[i].itemAmount += inventory[j].itemAmount
        inventory[j].itemAmount = 0
        break
      }
    }
  }
}
