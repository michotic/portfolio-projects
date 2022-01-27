function otherPlayer(tempXpos, tempYpos, tempDir, tempUUID, tempLives, tempAttacking, tempUsername, tempClass, tempAttackType) {
  this.xpos = tempXpos;
  this.ypos = tempYpos;
  this.UUID = tempUUID;
  this.size = tileSize;
  this.dir = 1;
  this.lives = tempLives;
  this.attacking = tempAttacking;
  this.username = NaN;
  this.username = tempUsername;
  this.soundCoolDown = 0;
  this.class = tempClass;
  this.attackType = tempAttackType;
  this.frame = 1;

  this.draw = function () {
    this.attackCheck();
    this.soundCoolDown--;
    this.drawnXpos = this.xpos + objectXOffset + (canvasWidth / 2);
    this.drawText();
    var sheetX = (this.frame - 1) * 16;
    var sheetY = (this.class - 1) * 16;
    push();
    if (this.soundCoolDown > 0) {
      tint(damageTint);
    }
    image(characterSheet, this.drawnXpos, this.ypos, this.size, this.size, sheetX, sheetY, [16], [16]);
    pop();
  }

  this.drawText = function () {
    push();
    stroke(0);
    strokeWeight(3);
    fill(255);
    textAlign(CENTER);
    textFont(mainFont);
    textSize(24);
    text('' + this.username, this.drawnXpos, this.ypos + this.size * 0.75);
    pop();
  }

  this.attackCheck = function () {
    if (player.attackType == 'melee') {
      if (dist(player.xpos, player.ypos, this.drawnXpos, this.ypos) < this.size && player.attacking == true) {
        if (!otherPlayerDamagedSound.isPlaying() && this.soundCoolDown < 0) {
          otherPlayerDamagedSound.play();
          this.soundCoolDown = 30;
        }
      }
    }

    for (var i = 0; i < player.projectileList.length; i++) {
      if (dist(this.drawnXpos, this.ypos, player.projectileList[i].xpos, player.projectileList[i].ypos) < this.size * 0.75 && player.projectileList[i].lifeSpan > 0) {
        if (!otherPlayerDamagedSound.isPlaying() && this.soundCoolDown < 0) {
          otherPlayerDamagedSound.play();
          this.soundCoolDown = 30;
        }
      }
    }
  }
}
