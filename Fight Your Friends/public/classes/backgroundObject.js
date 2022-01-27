function backgroundObject(tempXpos, tempImage) {
  this.xpos = tempXpos
  this.ypos = canvasHeight / 2;
  this.image = tempImage;
  this.scrollSpeed = 0.3;
  this.draw = function () {
    this.wrapAround();
    image(this.image, this.xpos, this.ypos, canvasWidth, canvasHeight);
  }

  this.moveLeft = function () {
    this.xpos += this.scrollSpeed;
  }

  this.moveRight = function () {
    this.xpos -= this.scrollSpeed;
  }

  this.wrapAround = function () {
    if (this.xpos - canvasWidth / 2 > canvasWidth) {
      this.xpos = 0 - (canvasWidth / 2) + 1;
    }
    if (this.xpos + canvasWidth / 2 < 0) {
      this.xpos = canvasWidth * 1.5 - 1;
    }
  }
}
