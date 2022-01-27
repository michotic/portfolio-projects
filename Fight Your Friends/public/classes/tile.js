//Tile class
function tile(tempXpos, tempYpos, tempSize, tempType) {
  this.xpos = tempXpos;
  this.ypos = tempYpos;
  this.size = tempSize;
  this.width = tempSize;
  this.height = tempSize;
  this.type = tempType;

  this.draw = function () {
    this.updateHitBox();
    //this.drawHitBox();
    this.drawnXpos = this.xpos + objectXOffset;
    var sheetX = 0 * 16;
    var sheetY = (this.type - 1) * 16;
    image(tileSheet, this.drawnXpos, this.ypos, this.width, this.height, sheetX, sheetY, [16], [16]);
  }

  this.drawHitBox = function () {
    fill(255);
    rect(this.hitBox.left + objectXOffset, this.ypos, 4, this.height);
    rect(this.hitBox.right + objectXOffset, this.ypos, 4, this.height);
    rect(this.xpos + objectXOffset, this.hitBox.top, this.width, 4);
    rect(this.xpos + objectXOffset, this.hitBox.bottom, this.width, 4);
  }

  this.updateHitBox = function () {
    this.hitBox = {
      left: this.xpos - (this.width / 2),
      right: this.xpos + (this.width / 2),
      top: this.ypos - (this.height / 2),
      bottom: this.ypos + (this.height / 2)
    };
  }
}
