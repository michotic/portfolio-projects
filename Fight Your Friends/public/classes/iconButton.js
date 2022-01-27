function iconButton(tempXpos, tempYpos, tempType) {
  //1 = back button.
  //2 = increase/decrease buttons.
  this.xpos = tempXpos;
  this.ypos = tempYpos;
  this.type = tempType;
  this.length = tileSize;

  this.draw = function () {
    this.checkMouse();
    //UIO Buttons.
    if (this.type < 100) {
      image(uiSheet, this.xpos, this.ypos, this.length, this.length, this.sheetX, floor(this.type - 1) * 16, [16], [16]);
    }
    //Class Buttons.
    if (this.type > 100) {
      push();
      stroke(0);
      strokeWeight(4);
      image(characterSheet, this.xpos, this.ypos, this.length, this.length, 0, (this.type - 101) * 16, [16], [16]);
      pop();
    }
  }

  this.checkMouse = function () {
    if (mouseX > this.xpos - (tileSize / 2) && mouseX < this.xpos + (tileSize / 2) && mouseY > this.ypos - (tileSize / 2) && mouseY < this.ypos + (tileSize / 2)) {
      if (!this.mouseInButton) {
        menuSelectSound.play();
      }
      this.sheetX = 1 * 16;
      this.mouseInButton = true;
      this.length = tileSize + 16;
    } else {
      this.sheetX = 0 * 16;
      this.mouseInButton = false;
      this.length = tileSize;
    }

    if (mouseDown && this.mouseInButton) {
      if (this.type == 1) {
        mouseDown = false;
        menuPressSound.play();
        if (scene == 1) {
          player.ypos = 1000;
        }
        setupScene(0);
      }

      if (this.type == 2.1) {
        if (particleAmount < 100) {
          particleAmount += 0.5;

          particleList = [];
          for (var i = 0; i < int(particleAmount); i++) {
            particleList.push(new particle());
          }
        }
      }

      if (this.type == 2.2) {
        if (soundVolume < 1) {
          soundVolume += 0.005;
          masterVolume(soundVolume);
        }
      }

      if (this.type == 3.1) {
        if (particleAmount > 0) {
          particleAmount -= 0.5;

          particleList = [];
          for (var i = 0; i < int(particleAmount); i++) {
            particleList.push(new particle());
          }
        }
      }

      if (this.type == 3.2) {
        if (soundVolume > 0) {
          soundVolume -= 0.005;
          masterVolume(soundVolume);
        }
      }

      if (this.type > 100) {
        mouseDown = false;
        menuPressSound.play();
        selectedClass = (this.type - 100);
      }
    }
  }
}
