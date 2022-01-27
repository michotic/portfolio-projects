function tileObject(objectX, objectY, objectWidth, objectHeight, objectType, objectID) {
  this.xpos = objectX
  this.ypos = objectY
  this.type = objectType
  this.width = objectWidth
  this.height = objectHeight
  this.ID = objectID

  this.hitbox = {
    top: this.ypos - this.height / 2 + yOffset,
    bottom: this.ypos + this.height / 2 + yOffset,
    left: this.xpos - this.width / 2 + xOffset,
    right: this.xpos + this.width / 2 + xOffset
  }

  this.updateHitbox = function() {
    this.hitbox = {
      top: this.ypos - this.height / 2 + yOffset,
      bottom: this.ypos + this.height / 2 + yOffset,
      left: this.xpos - this.width / 2 + xOffset,
      right: this.xpos + this.width / 2 + xOffset
    }
  }
}

tileObject.prototype.draw = function() {
  this.sheetY = int(this.type / 8) * 16
  this.sheetX = (this.type - (this.sheetY / 16) * 8) * 16
  if (this.ID == 0) {
    this.sheet = tileSheet
  } else if (this.ID == 1) {
    this.sheet = bridgeSheet
  } else if (this.ID == 2) {
    this.sheet = boatSheet
  }

  image(
    this.sheet,
    this.xpos + xOffset,
    this.ypos + yOffset,
    this.width,
    this.height,
    this.sheetX,
    this.sheetY,
    [this.width / 4],
    [this.height / 4]
  )
  this.updateHitbox()
}
