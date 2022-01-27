function ai(tempXpos, tempYpos, tempSize, tempType, tempUUID, tempFrame) {
  this.xpos = tempXpos;
  this.ypos = tempYpos;
  this.size = tempSize;
  this.type = tempType;
  this.UUID = tempUUID;
  this.frame = tempFrame;
  this.damageCoolDown = 0;

  this.draw = function () {
    this.damageCoolDown--;
    this.attackCheck();
    this.drawnXpos = this.xpos + objectXOffset;
    var sheetX,
      sheetY;

    sheetX = this.frame * 16;
    sheetY = (this.type - 1) * 16;

    push();
    if (this.damageCoolDown > 0) {
      tint(damageTint);
    }
    image(aiSheet, this.drawnXpos, this.ypos, this.size, this.size, sheetX, sheetY, [16], [16]);
    pop();
  }

  this.attackCheck = function () {
    if (player.attackType == 'melee') {
      if (dist(player.xpos, player.ypos, this.drawnXpos, this.ypos) < this.size && player.attacking == true) {
        if (!otherPlayerDamagedSound.isPlaying() && this.damageCoolDown < 0) {
          otherPlayerDamagedSound.play();
          this.damageCoolDown = 30;
        }
      }
    }

    for (var i = 0; i < player.projectileList.length; i++) {
      if (dist(this.drawnXpos, this.ypos, player.projectileList[i].xpos, player.projectileList[i].ypos) < this.size * 0.75 && player.projectileList[i].lifeSpan > 0) {
        if (!otherPlayerDamagedSound.isPlaying() && this.damageCoolDown < 0) {
          otherPlayerDamagedSound.play();
          this.damageCoolDown = 30;
        }
      }
    }
  }
}
