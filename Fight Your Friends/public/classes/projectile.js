function projectile(tempXpos, tempYpos, tempSize, tempDir, tempUUID, tempServerXpos, tempUserUUID, tempLifeSpan, tempType) {
  this.UUID = tempUUID;
  this.userUUID = tempUserUUID;

  this.xpos = tempXpos;
  this.ypos = tempYpos;
  this.size = tempSize;
  this.dir = tempDir;
  this.lifeSpan = tempLifeSpan;
  this.serverXpos = tempServerXpos;
  this.type = tempType;

  if (this.type == 2) {
    this.accelerationRate = 4;
    this.decelerationRate = 0.5;
    this.xVelocity = 0;
    this.xAcceleration = 0;
    this.terminalXVelocity = 8;
    this.yVelocity = 0;
    this.yAcceleration = 0;
    this.terminalYVelocity = 32;
    this.lifeSpan = 30;
  }

  if (this.type == 4) {
    if (this.dir == 1) {
      this.accelerationRate = 0;
      this.decelerationRate = 0.5;
      this.xVelocity = 0;
      this.xAcceleration = 0;
      this.terminalXVelocity = 6;
      this.yVelocity = 0;
      this.yAcceleration = 1;
      this.terminalYVelocity = 16;
      this.lifeSpan = 70;
    } else if (int(this.dir) == 2) {
      this.accelerationRate = 0;
      this.decelerationRate = 0.5;
      this.terminalXVelocity = 15;
      this.yVelocity = 0;
      this.yAcceleration = 0;
      this.terminalYVelocity = 12;
      this.lifeSpan = 25;

      if (this.dir == 2.1) {
        this.xVelocity = 15;
        this.xAcceleration = 3;
      } else if (this.dir == 2.2) {
        this.xVelocity = -15;
        this.xAcceleration = -3;
      }
    }
  }

  if (this.type == 6) {
    this.accelerationRate = 4;
    this.decelerationRate = 0.5;
    this.xVelocity = 0;
    this.xAcceleration = 0;
    this.terminalXVelocity = 16;
    this.yVelocity = 0;
    this.yAcceleration = 0;
    this.terminalYVelocity = 32;
    this.lifeSpan = 30;
  }

  if (this.type == 7) {
    this.accelerationRate = 4;
    this.decelerationRate = 0.5;
    this.xVelocity = 0;
    this.xAcceleration = 0;
    this.terminalXVelocity = 8;
    this.yVelocity = 0;
    this.yAcceleration = 0;
    this.terminalYVelocity = 32;
    this.lifeSpan = 30;
  }


  this.collisionMultiplier = 0.9;
  this.draw = function () {
    this.lifeSpan--;
    this.updatePosition();
    if (this.lifeSpan < 0) {
      this.ypos = canvasHeight * 2;
    }
    var sheetX = (this.dir + 5) * 16;
    var sheetY = (this.type - 1) * 16;
    image(characterSheet, this.xpos, this.ypos, this.size, this.size, sheetX, sheetY, [16], [16]);
  }

  this.drawOtherProjectiles = function () {
    this.drawnXpos = this.xpos + objectXOffset; //+ (canvasWidth / 2);
    this.lifeSpan--;
    var sheetX = (this.dir + 5) * 16;
    var sheetY = (this.type - 1) * 16;
    image(characterSheet, this.drawnXpos, this.ypos, this.size, this.size, sheetX, sheetY, [16], [16]);
  }

  this.updatePosition = function () {
    if (this.yVelocity < this.terminalYVelocity && this.yVelocity > -this.terminalYVelocity) {
      this.yVelocity += this.yAcceleration;
    }

    this.ypos += this.yVelocity;

    if (this.dir == 1) {
      this.xAcceleration = this.accelerationRate;
    }
    if (this.dir == 2) {
      this.xAcceleration = -this.accelerationRate;
    }

    if (this.xVelocity < this.terminalXVelocity && this.xVelocity > -this.terminalXVelocity) {
      this.xVelocity += this.xAcceleration;
    }
    this.xpos += this.xVelocity;
    this.serverXpos = this.xpos - objectXOffset;

    //this.xAcceleration = 0;
    if (this.xVelocity < 0) {
      this.xVelocity += this.decelerationRate
    }
    if (this.xVelocity > 0) {
      this.xVelocity -= this.decelerationRate
    }
  }
}
