function menuButton(tempXpos, tempYpos, tempLabel, tempScene) {
  this.xpos = tempXpos;
  this.ypos = tempYpos;
  this.label = tempLabel;
  this.scene = tempScene;
  this.width = tileSize * 2;
  this.height = this.width / 2;
  this.textSize = 24;

  //this.mouseInButton = false;

  this.draw = function () {
    this.checkMouse();
    var sheetX = (4) * 16;
    image(uiSheet, this.xpos, this.ypos, this.width, this.height, sheetX, this.sheetY, [32], [16]);
    push();
    stroke(0);
    strokeWeight(3);
    fill(255);
    textAlign(CENTER);
    textFont(mainFont);
    textSize(this.textSize);
    text(this.label, this.xpos, this.ypos + 6);
    pop();
  }

  this.checkMouse = function () {
    if (mouseX > this.xpos - tileSize && mouseX < this.xpos + tileSize && mouseY > this.ypos - tileSize / 2 && mouseY < this.ypos + tileSize / 2) {
      if (!this.mouseInButton) {
        menuSelectSound.play();
      }
      this.sheetY = 1 * 16
      this.mouseInButton = true;
      this.width = (tileSize * 2) + 16;
      this.height = this.width / 2;
      this.textSize = 30;
    } else {
      this.sheetY = 0 * 16;
      this.mouseInButton = false;
      this.width = (tileSize * 2);
      this.height = this.width / 2;
      this.textSize = 24;
    }

    if (mouseDown && this.mouseInButton) {
      menuPressSound.play();
      setupScene(this.scene);
      mouseDown = false;
    }
  }
}
