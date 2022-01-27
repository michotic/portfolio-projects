function particle() {
  this.xpos = random(canvasWidth);
  this.ypos = random(canvasHeight);
  this.yVelocity = random(0.2, 1);
  this.xVelocity = 0;
  this.terminalXVelocity = 2;
  this.sheetY = floor(random(0, 2)) * 16;

  this.draw = function () {
    this.drawnXpos = this.xpos;
    this.xAcceleration = random(-0.2, 0.2);
    this.updatePosition();
    image(uiSheet, this.drawnXpos, this.ypos, tileSize / 2 * (1 + (this.yVelocity / 10)), tileSize / 2 * (1 + (this.yVelocity / 10)), 8 * 16, this.sheetY, [16], [16]);
  }

  this.updatePosition = function () {
    if (this.xVelocity < this.terminalXVelocity && this.xVelocity > -this.terminalXVelocity) {
      this.xVelocity += this.xAcceleration;
    } else {
      this.xVelocity = 0;
    }
    this.ypos += this.yVelocity;
    this.xpos += this.xVelocity;
    if (scene == 1) {
      this.xpos -= player.xVelocity;
    }

    if (this.ypos > canvasHeight) {
      this.xpos = random(canvasWidth);
      this.ypos = random(-40, 0);
      this.yVelocity = random(0.2, 1);
      this.xVelocity = 0;
      this.sheetX = ceil(random(1, 3)) * 16;
    }
    if (this.xpos > canvasWidth) {
      this.xpos = 0;
      this.xVelocity = 0;
    }
    if (this.xpos < 0) {
      this.xpos = canvasWidth;
      this.xVelocity = 0;
    }
  }
}
