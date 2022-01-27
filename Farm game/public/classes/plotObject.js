function plotObject(objectX, ObjectY) {
  this.xpos = objectX
  this.ypos = ObjectY
}

plotObject.prototype.draw = function() {
  image(plotSheet, this.xpos + xOffset, this.ypos + yOffset, TILE_SIZE, TILE_SIZE)
}
