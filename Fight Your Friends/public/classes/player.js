function playerObject(tempXpos, tempYpos, tempSize, tempUsername, tempClass) {
  this.xpos = tempXpos;
  this.ypos = tempYpos;
  this.size = tempSize;
  this.width = tempSize;
  this.height = tempSize;
  this.username = tempUsername;
  this.class = tempClass;

  this.healthRegenTimer = 0;
  this.healthRegenTime = 4 * 60;

  //Default class.
  this.maxLives = 1;
  this.lives = this.maxLives;
  this.accelerationRate = 1;
  this.terminalXVelocity = 3.5;
  this.jumpAmount = tileSize / 7;
  this.collisionWidth = 12 * 4;
  this.primaryAttackDuration = 20;
  this.secondaryAttackDuration = 30;
  this.attackType = 'melee';

  //Knight.
  if (this.class == 1) {
    this.maxLives = 5;
    this.lives = this.maxLives;
    this.accelerationRate = 1;
    this.terminalXVelocity = 3.5;
    this.jumpAmount = tileSize / 7;
    this.collisionWidth = 12 * 4;
    this.primaryAttackDuration = 20;
    this.secondaryAttackDuration = 30;
    this.attackType = 'melee';
  }
  //Mage.
  if (this.class == 2) {
    this.maxLives = 4;
    this.lives = this.maxLives;
    this.accelerationRate = 1;
    this.terminalXVelocity = 3.5;
    this.jumpAmount = tileSize / 7;
    this.collisionWidth = 12 * 4;
    this.primaryAttackDuration = 25;
    this.secondaryAttackDuration = 60;
    this.attackType = 'range';
  }
  //Rogue.
  if (this.class == 3) {
    this.maxLives = 3;
    this.lives = this.maxLives;
    this.accelerationRate = 2;
    this.terminalXVelocity = 3.6;
    this.jumpAmount = tileSize / 7;
    this.collisionWidth = 12 * 4;
    this.primaryAttackDuration = 22;
    this.secondaryAttackDuration = 25;
    this.attackType = 'melee';
  }
  //Paladin.
  if (this.class == 4) {
    this.maxLives = 7;
    this.lives = this.maxLives;
    this.accelerationRate = 1;
    this.terminalXVelocity = 3;
    this.jumpAmount = tileSize / 7;
    this.collisionWidth = 14 * 4;
    this.primaryAttackDuration = 30;
    this.secondaryAttackDuration = 40;
    this.attackType = 'range';
  }
  //Ninja.
  if (this.class == 5) {
    this.maxLives = 3;
    this.lives = this.maxLives;
    this.accelerationRate = 2;
    this.terminalXVelocity = 4.25;
    this.jumpAmount = tileSize / 6;
    this.collisionWidth = 12 * 4;
    this.primaryAttackDuration = 18;
    this.secondaryAttackDuration = 120;
    this.attackType = 'melee';
  }
  //Archer.
  if (this.class == 6) {
    this.maxLives = 3;
    this.lives = this.maxLives;
    this.accelerationRate = 1;
    this.terminalXVelocity = 3.5;
    this.jumpAmount = tileSize / 7;
    this.collisionWidth = 12 * 4;
    this.primaryAttackDuration = 25;
    this.secondaryAttackDuration = 40;
    this.attackType = 'range';
  }
  //Slime summoner.
  if (this.class == 7) {
    this.maxLives = 4;
    this.lives = this.maxLives;
    this.accelerationRate = 1;
    this.terminalXVelocity = 3.5;
    this.jumpAmount = tileSize / 7;
    this.collisionWidth = 12 * 4;
    this.primaryAttackDuration = 25;
    this.secondaryAttackDuration = 120;
    this.attackType = 'range';
  }

  this.kills = 0;
  this.killStreak = 0;
  this.deaths = 0;
  this.accelerationRate = 1;
  this.decelerationRate = 0.5;
  this.xVelocity = 0;
  this.xAcceleration = 0;
  this.yVelocity = 0;
  this.yAcceleration = 0;
  this.terminalYVelocity = 32;
  this.collisionMultiplier = 1.1;
  this.primaryAttackCooldown = 0;
  this.secondaryAttackCooldown = 0;
  this.attacking = false;
  this.damageCooldown = 0;
  this.projectileList = [];
  this.serverXpos = 0;
  objectXOffset = 0;

  this.attackFrames = [3, 5];
  this.idleFrame = 1;
  this.dir = 'right';
  this.frame = 1;

  this.respawn = function () {
    leftBackgroundObject.xpos = 0;
    rightBackgroundObject.xpos = canvasWidth;
    playerDeathSound.play();
    this.deaths++;
    this.ypos = 0;
    this.lives = this.maxLives;
    this.xVelocity = 0;
    this.xAcceleration = 0;
    this.yVelocity = 0;
    this.yAcceleration = 0;
    this.serverXpos = 0;
    this.killStreak = 0;
    this.damageCooldown = 0;
    this.primaryAttackCooldown = 0;
    this.secondaryAttackCooldown = 0;
    objectXOffset = 0;
  }

  this.draw = function () {
    this.updateHitBox();
    if (this.lives <= 0) {
      this.respawn();
    }

    if (this.healthRegenTimer >= this.healthRegenTime) {
      this.lives++;
      this.healthRegenTimer = 0;
    }

    if (this.lives < this.maxLives && this.damageCooldown <= 0) {
      this.healthRegenTimer++;
    } else {
      this.healthRegenTimer = 0;
    }

    if (pvp == true) {
      this.attackCheck();
    }
    this.updateSprite();
    this.lifeCheck();
    this.collisionCheck();
    this.updatePosition();
    this.drawText();
    this.updateProjectiles();
    //this.drawHitBox();

    var sheetX = (this.frame - 1) * 16;
    var sheetY = (this.class - 1) * 16;

    push();
    if (this.damageCooldown > 0 && this.secondaryAttackCooldown < 0) {
      tint(damageTint);
    }
    image(characterSheet, this.xpos, this.ypos, this.width, this.height, sheetX, sheetY, [16], [16]);
    pop();

    if (this.damageCooldown > 0) {
      this.damageCooldown--;
    }
  }

  this.drawHitBox = function () {
    fill(255);
    push();
    if (this.leftCollision == true) {
      fill(255, 0, 0);
    }
    rect(this.hitBox.left, this.ypos, 4, this.height);
    pop();
    push();
    if (this.rightCollision == true) {
      fill(255, 0, 0);
    }
    rect(this.hitBox.right, this.ypos, 4, this.height);
    pop();
    push();
    if (this.topCollision == true) {
      fill(255, 0, 0);
    }
    rect(this.xpos, this.hitBox.top, this.collisionWidth, 4);
    pop();
    push();
    if (this.bottomCollision == true) {
      fill(255, 0, 0);
    }
    rect(this.xpos, this.hitBox.bottom, this.collisionWidth, 4);
    pop();
  }

  this.updateHitBox = function () {
    this.hitBox = {
      left: this.xpos - (this.collisionWidth / 2),
      right: this.xpos + (this.collisionWidth / 2),
      top: this.ypos - (this.height * 0.4),
      bottom: this.ypos + (this.height / 2)
    };
  }

  this.updateSprite = function () {
    if (this.dir == 'left') {
      this.attackFrames = [4, 6];
      this.idleFrame = 2;
    }
    if (this.dir == 'right') {
      this.attackFrames = [3, 5];
      this.idleFrame = 1;
    }

    if (this.frame > this.idleFrame && this.frame < 5) {
      this.frame = this.attackFrames[0];
    }
    if (this.frame > this.attackFrames[0]) {
      this.frame = this.attackFrames[1];
    }

    this.primaryAttackCooldown--;
    this.secondaryAttackCooldown--;
    if (this.frame > 2) {
      if (this.frame == this.attackFrames[0]) {
        if (this.primaryAttackCooldown - (this.primaryAttackDuration / 2) <= 0) {
          this.frame = this.idleFrame;
          this.attacking = false;
        }
      } else if (this.frame == this.attackFrames[1]) {
        if (this.secondaryAttackCooldown - (this.secondaryAttackDuration * 2) <= 0) {
          this.frame = this.idleFrame;
          this.attacking = false;
        }
      }
    }
  }

  this.lifeCheck = function () {
    if (this.lives > this.maxLives) {
      this.lives = this.maxLives;
    }
  }

  this.drawText = function () {
    push();
    stroke(0);
    strokeWeight(3);
    fill(255);
    textAlign(CENTER);
    textFont(mainFont);
    textSize(20);
    text('Kills: ' + this.kills, canvasWidth / 2, 70);
    text('Deaths: ' + this.deaths, canvasWidth / 2, 50);
    text('Killstreak: ' + this.killStreak, canvasWidth / 2, 30);
    textAlign(CENTER);
    textFont(mainFont);
    strokeWeight(3);
    fill(50, 50, 150);
    textSize(24);
    text(this.username, this.xpos, this.ypos + this.size * 0.75);
    pop();
  }

  this.updateProjectiles = function () {
    for (var i = 0; i < this.projectileList.length; i++) {
      if (this.projectileList[i].lifeSpan < 1) {
        this.projectileList.splice(i);
      }
    }
    this.drawProjectiles();
  }

  this.drawProjectiles = function () {
    for (var i = 0; i < this.projectileList.length; i++) {
      this.projectileList[i].draw();
    }
  }

  this.collisionCheck = function () {
    this.bottomCollision = false;
    this.leftCollision = false;
    this.topCollision = false;
    this.rightCollision = false;
    for (var i = 0; i < tileList.length; i++) {
      if (dist(this.xpos, this.ypos, tileList[i].xpos + objectXOffset, tileList[i].ypos) < tileSize * 1.5) {
        if (this.ypos >= tileList[i].ypos - tileSize && this.ypos <= tileList[i].ypos - (tileSize * 0.75)) {
          if (this.xpos >= tileList[i].xpos + objectXOffset - (tileSize / 2) && this.xpos <= tileList[i].xpos + objectXOffset + (tileSize / 2)) {
            this.ypos = (int(this.ypos / tileSize) * tileSize) + (tileSize / 2) - 8;
            this.bottomCollision = true;
          }
        }
        if (this.hitBox.top <= tileList[i].hitBox.bottom && this.ypos >= tileList[i].ypos) {
          if (this.xpos >= tileList[i].xpos + objectXOffset - (this.collisionWidth * 0.9) && this.xpos <= tileList[i].xpos + objectXOffset + (this.collisionWidth * 0.9)) {
            this.ypos = tileList[i].hitBox.bottom + (tileSize / 2) + 8;
            this.yVelocity = gravityForce;
            this.topCollision = true;
          }
        }
        if (this.xpos >= tileList[i].xpos + objectXOffset - (tileSize / 2) && this.xpos <= tileList[i].xpos + objectXOffset + this.collisionWidth) {
          if (this.ypos > tileList[i].ypos - (tileSize / 1) && this.ypos < tileList[i].ypos + (tileSize / 1)) {
            this.xVelocity = 0;
            this.leftCollision = true;
          }
        }
        if (this.xpos >= tileList[i].xpos + objectXOffset - this.collisionWidth && this.xpos <= tileList[i].xpos + objectXOffset + (tileSize / 2)) {
          if (this.ypos > tileList[i].ypos - (tileSize / 1) && this.ypos < tileList[i].ypos + (tileSize / 1)) {
            this.xVelocity = 0;
            this.rightCollision = true;
          }
        }
      }
    }
  }

  this.attackCheck = function () {
    for (var i = 0; i < playerList.length; i++) {
      if (dist(this.xpos, this.ypos, playerList[i].drawnXpos, playerList[i].ypos) < this.size) {
        if (playerList[i].attacking == true) {
          if (this.damageCooldown <= 0) {
            playerDamagedSound.play();
            this.lives -= 1;
            this.damageCooldown = 20;

            if (this.lives == 0) {
              data = {
                killerUUID: playerList[i].UUID,
                victimUUID: UUID,
                type: 'melee'
              }
              socket.emit('killData', data);
            }

            if (playerList[i].dir == 'right') {
              this.xVelocity += 5;
            }

            if (playerList[i].dir == 'left') {
              this.xVelocity -= 5;
            }
          }
        }
      }
    }

    for (var i = 0; i < projectileList.length; i++) {
      if (dist(this.xpos, this.ypos, projectileList[i].drawnXpos, projectileList[i].ypos) < this.size * 0.75 && this.damageCooldown <= 0 && projectileList[i].lifeSpan > 0) {
        playerDamagedSound.play();
        projectileList[i].lifeSpan = 0;
        this.lives -= 1;
        this.damageCooldown = 20;

        if (this.lives == 0) {
          data = {
            killerUUID: projectileList[i].userUUID,
            victimUUID: UUID,
            type: 'range'
          }
          socket.emit('killData', data);
        }

        if (projectileList[i].dir == 'right') {
          this.xVelocity += 5;
        }

        if (projectileList[i].dir == 'left') {
          this.xVelocity -= 5;
        }
      }
    }
  }

  this.updatePosition = function () {
    /* Y AXIS PHYSICS */
    if (!this.bottomCollision) {
      this.yAcceleration = gravityForce;
    } else if (this.bottomCollision == true && this.yVelocity > 0) {
      if (!playerLandingSound.isPlaying()) {
        playerLandingSound.play();
        this.jumping = false;
      }
      this.yAcceleration = 0;
      this.yVelocity = 0;
    }

    if (this.yVelocity < this.terminalYVelocity) {
      this.yVelocity += this.yAcceleration;
    }
    this.ypos += this.yVelocity;

    /* X AXIS PHYSICS */
    if (this.xVelocity < this.terminalXVelocity && this.xVelocity > -this.terminalXVelocity) {
      this.xVelocity += this.xAcceleration;
    }
    this.serverXpos += this.xVelocity;
    objectXOffset -= this.xVelocity;
    this.xAcceleration = 0;
    if (this.xVelocity < 0) {
      this.xVelocity += this.decelerationRate
    }
    if (this.xVelocity > 0) {
      this.xVelocity -= this.decelerationRate
    }

    if (!this.bottomCollision) {
      this.fallToDeath();
    }
  }

  this.fallToDeath = function () {
    if (this.ypos > canvasHeight) {
      this.respawn();
    }
  }

  this.moveLeft = function () {
    this.dir = 'left';
    if (this.frame < this.attackFrames[0]) {
      this.frame = this.idleFrame;
    }

    if (!this.leftCollision) {
      if (!playerFootstepSound.isPlaying()) {
        playerFootstepSound.play();
      }
      leftBackgroundObject.moveLeft();
      rightBackgroundObject.moveLeft();
      this.xAcceleration -= this.accelerationRate;
    }
  }

  this.moveRight = function () {
    this.dir = 'right';
    if (this.frame < this.attackFrames[0]) {
      this.frame = this.idleFrame;
    }
    if (!this.rightCollision) {
      if (!playerFootstepSound.isPlaying() && this.bottomCollision == true) {
        playerFootstepSound.play();
      }
      leftBackgroundObject.moveRight();
      rightBackgroundObject.moveRight();
      this.xAcceleration += this.accelerationRate;
    }
  }

  this.jump = function () {
    if (this.jumping == false) {
      if (this.bottomCollision && !this.topCollision) {
        if (!playerJumpingSound.isPlaying()) {
          playerJumpingSound.play();
        }
        this.jumping = true;
        this.yAcceleration = -this.jumpAmount;
      }
    }
  }

  this.mainAttack = function () {
    if (this.frame < this.attackFrames[0] && this.primaryAttackCooldown <= 0) {
      if (this.class == 1) {
        playerMeleeAttackSound.play();
        this.frame = this.attackFrames[0];
        this.primaryAttackCooldown = this.primaryAttackDuration * 1.5;
        this.attacking = true;
      } else if (this.class == 2) {
        playerRangeAttackSound.play();
        this.frame = this.attackFrames[0];
        this.primaryAttackCooldown = this.primaryAttackDuration * 1.5;
        this.attacking = false;

        this.projectileList.push(new projectile(this.xpos, this.ypos, this.size, this.idleFrame, random(10000), this.serverXpos, UUID, 20, this.class));
      } else if (this.class == 3) {
        playerMeleeAttackSound.play();
        this.frame = this.attackFrames[0];
        this.primaryAttackCooldown = this.primaryAttackDuration * 1.5;
        this.attacking = true;
      } else if (this.class == 4) {
        playerRangeAttackSound.play();
        this.frame = this.attackFrames[0];
        this.primaryAttackCooldown = this.primaryAttackDuration * 1.5;
        this.attacking = false;

        this.projectileList.push(new projectile(this.xpos, this.ypos, this.size, 2 + (0.1 * this.idleFrame), random(10000), this.serverXpos, UUID, 20, this.class));
      } else if (this.class == 5) {
        playerMeleeAttackSound.play();
        this.frame = this.attackFrames[0];
        this.primaryAttackCooldown = this.primaryAttackDuration * 1.5;
        this.attacking = true;
      } else if (this.class == 6) {
        playerRangeAttackSound.play();
        this.frame = this.attackFrames[0];
        this.primaryAttackCooldown = this.primaryAttackDuration * 1.5;
        this.attacking = false;

        this.projectileList.push(new projectile(this.xpos, this.ypos, this.size, this.idleFrame, random(10000), this.serverXpos, UUID, 30, this.class));
      } else if (this.class == 7) {
        playerRangeAttackSound.play();
        this.frame = this.attackFrames[0];
        this.primaryAttackCooldown = this.primaryAttackDuration * 1.5;
        this.attacking = false;

        this.projectileList.push(new projectile(this.xpos, this.ypos, this.size, this.idleFrame, random(10000), this.serverXpos, UUID, 20, this.class));
      }

    }
  }

  this.secondaryAttack = function () {
    if (this.frame < this.attackFrames[0] && this.secondaryAttackCooldown <= 0) {
      if (this.class == 1) {
        knightSpecialSound.play();
        this.frame = this.attackFrames[1];
        this.damageCooldown = this.secondaryAttackDuration;
        this.secondaryAttackCooldown = this.secondaryAttackDuration * 3;
        this.attacking = false;
        return;
      } else if (this.class == 2) {
        if (this.lives < this.maxLives) {
          mageSpecialSound.play();
          this.frame = this.attackFrames[1];
          this.secondaryAttackCooldown = this.secondaryAttackDuration * 3;
          this.attacking = false;

          this.lives++;
          return;
        }
      } else if (this.class == 3) {
        if ((this.dir == 'right' && this.rightCollision == false) || (this.dir == 'left' && this.leftCollision == false)) {
          rogueSpecialSound.play();
          this.frame = this.attackFrames[1];
          this.secondaryAttackCooldown = this.secondaryAttackDuration * 3;
          this.attacking = true;

          this.damageCooldown = this.secondaryAttackDuration;
          dashAmount = 8;
          if (this.dir == 'right') {
            this.xAcceleration = dashAmount;
          } else if (this.dir == 'left') {
            this.xAcceleration = -dashAmount;
          }
          this.xVelocity += this.xAcceleration;
          return;
        }
      } else if (this.class == 4) {
        paladinSpecialSound.play();
        this.frame = this.attackFrames[1];
        this.secondaryAttackCooldown = this.secondaryAttackDuration * 3;
        this.attacking = false;

        hammerSpread = 1;
        hammerAmount = 3;
        for (var i = -1; i < 2; i++) {
          this.projectileList.push(new projectile(this.xpos + (tileSize * (i * hammerSpread)), 0, this.size, 1, random(10000), this.serverXpos, UUID, 60, this.class));
        }
        return;
      } else if (this.class == 5) {
        ninjaSpecialSound.play();
        this.frame = this.attackFrames[1];
        this.secondaryAttackCooldown = this.secondaryAttackDuration * 3;
        this.attacking = false;

        this.damageCooldown = this.secondaryAttackDuration;
        return;
      } else if (this.class == 6) {
        if ((this.dir == 'right' && this.leftCollision == false) || (this.dir == 'left' && this.rightCollision == false)) {
          archerSpecialSound.play();
          this.frame = this.attackFrames[1];
          this.secondaryAttackCooldown = this.secondaryAttackDuration * 3;

          this.damageCooldown = this.secondaryAttackDuration;
          dashAmount = 16;
          this.projectileList.push(new projectile(this.xpos, this.ypos, this.size, this.idleFrame, random(10000), this.serverXpos, UUID, 30, this.class));
          if (this.dir == 'right') {
            this.xAcceleration = -dashAmount;
          } else if (this.dir == 'left') {
            this.xAcceleration = dashAmount;
          }
          this.xVelocity += this.xAcceleration;
          return;
        }
      } else if (this.class == 7) {
        mageSpecialSound.play();
        this.frame = this.attackFrames[1];
        this.secondaryAttackCooldown = this.secondaryAttackDuration * 3;
        this.attacking = false;

        var data = {
          x: this.serverXpos,
          y: this.ypos,
          type: 5
        };
        socket.emit('summonData', data);
        return;
      }
    }
  }
}