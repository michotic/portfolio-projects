function cropObject(objectX, objectY) {
  this.xpos = objectX
  this.ypos = objectY
  this.stage = 0
  this.maxStage = 3
  this.age = 0
  this.growthRate = 2 + random(-1, 2) //time between stages in seconds
  this.life = 1
}

cropObject.prototype.interact = function() {
  this.life = -10
  inventory.push(new itemObject(2, 'seeds', floor(random(1, 2.5))))
  inventory.push(new itemObject(3, 'wheat', 1))
}

cropObject.prototype.destroyedAction = function() {
  harvestSound.play()
  for (var i = 0; i < int(random(5, 9)); i++) {
    particleList.push(
      new particleObject(
        this.xpos,
        this.ypos,
        PIXEL_SIZE,
        122,
        232,
        15,
        floor(random(-1, 1)),
        30,
        random(0.5, 1.5),
        random(-2.5, -3)
      )
    )
  }
}

cropObject.prototype.draw = function() {
  push()
  this.sheetX = this.stage * 16
  var xScale, yScale
  if (this.stage == this.maxStage) {
    xScale = bobXScale
    yScale = bobYScale
    scale(xScale, yScale)
  } else {
    xScale = 1
    yScale = 1
  }
  image(
    wheatSheet,
    (this.xpos + xOffset) / xScale,
    (this.ypos + yOffset) / yScale,
    TILE_SIZE,
    TILE_SIZE,
    this.sheetX,
    0,
    16,
    16
  )
  this.age++
  if (this.age > 60 * this.growthRate && this.stage < this.maxStage) {
    this.age = 0
    this.stage++
    if (this.stage == this.maxStage) {
      interactiveList.push(this)
    }
  }
  pop()
}
