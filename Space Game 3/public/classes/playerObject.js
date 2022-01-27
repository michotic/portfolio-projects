function playerObject(
  objectX,
  objectY,
  objectWidth,
  objectHeight,
  objectAnimationFrames,
  objectFrameWidth,
  objectFrameHeight
) {
  this.xpos = objectX
  this.ypos = objectY

  this.width = objectWidth
  this.height = objectHeight
  this.dir = 1

  this.xAccel = 0
  this.X_ACCEL_RATE = (TILE_SIZE / 2) * 0.04
  this.xVel = 0
  this.TERMINAL_X_VEL = TILE_SIZE / 2
  this.yVel = 0
  this.yAccel = 0
  this.TERMINAL_Y_VEL = 32

  this.sheetX = 1
  this.maxSheetX = objectAnimationFrames
  this.sheet = characterIdleSheet
  this.sheetName = 'characterIdleSheet'

  this.animationFrame = 0
  this.animationTime = 0.1 //Time between frames in seconds.
  this.animationIncrement = 0
  this.animationFrameWidth = objectFrameWidth
  this.animationFrameHeight = objectFrameHeight

  this.hitbox = {
    top: this.ypos - this.height / 2,
    bottom: this.ypos + this.height / 2,
    left: this.xpos - this.width / 2,
    right: this.xpos + this.width / 2,
  }

  this.moveLeft = function () {
    this.dir = -1
    if (
      this.xAccel <= this.TERMINAL_X_VEL &&
      this.xAccel >= -this.TERMINAL_X_VEL &&
      this.leftCollision == false
    ) {
      this.xAccel += this.X_ACCEL_RATE
    }
  }

  this.moveRight = function () {
    this.dir = 1
    if (
      this.xAccel <= this.TERMINAL_X_VEL &&
      this.xAccel >= -this.TERMINAL_X_VEL &&
      this.rightCollision == false
    ) {
      this.xAccel -= this.X_ACCEL_RATE
    }
  }

  this.jump = function () {
    if (this.bottomCollision) {
      this.ypos -= 2
      this.yVel = -(TILE_SIZE * 0.15)
    }
  }

  this.updatePosition = function () {
    if (this.xVel <= this.TERMINAL_X_VEL && this.xVel >= -this.TERMINAL_X_VEL) {
      this.xVel += this.xAccel
    }
    xOffset += this.xVel

    this.xAccel *= 0.5
    this.xVel *= 0.5

    if (this.xVel < 0.2 && this.xVel > -0.2) {
      this.xVel = 0
    }

    if (!this.bottomCollision && this.yVel <= this.TERMINAL_Y_VEL) {
      this.yVel += GRAVITY_FORCE
    } else if (this.bottomCollision) {
      this.yVel = 0
    }

    if (this.ypos <= 0) {
      this.ypos = height
    }

    this.ypos += this.yVel
  }

  this.updateHitbox = function () {
    this.hitbox = {
      top: this.ypos - this.height / 2,
      bottom: this.ypos + this.height / 2,
      left: this.xpos - this.width / 2,
      right: this.xpos + this.width / 2,
    }
  }

  this.collisionCheck = function () {
    this.bottomCollision = false
    this.rightCollision = false
    this.leftCollision = false

    for (var i = 0; i < tileList.length; i++) {
      if (onScreen(tileList[i].xpos + xOffset)) {
        if (
          dist(this.xpos, this.ypos, tileList[i].xpos + xOffset, tileList[i].ypos) <
          TILE_SIZE * 1.6
        ) {
          if (
            this.hitbox.right > tileList[i].hitbox.left + COLLISION_BUFFER &&
            this.hitbox.left < tileList[i].hitbox.right - COLLISION_BUFFER &&
            this.hitbox.bottom >= tileList[i].hitbox.top
          ) {
            this.bottomCollision = true
            if (this.hitbox.bottom > tileList[i].hitbox.top) {
              this.ypos -= diff(this.hitbox.bottom, tileList[i].hitbox.top)
            }
          }

          if (
            this.hitbox.right > tileList[i].hitbox.left - COLLISION_BUFFER &&
            this.hitbox.right < tileList[i].hitbox.right - COLLISION_BUFFER &&
            this.hitbox.bottom > tileList[i].hitbox.top
          ) {
            this.rightCollision = true
            if (
              this.hitbox.right > tileList[i].hitbox.left &&
              this.hitbox.bottom < tileList[i].hitbox.top
            ) {
              xOffset += diff(this.hitbox.right, tileList[i].hitbox.left)
            }
          }

          if (
            this.hitbox.left < tileList[i].hitbox.right + COLLISION_BUFFER &&
            this.hitbox.left > tileList[i].hitbox.left + COLLISION_BUFFER &&
            this.hitbox.bottom > tileList[i].hitbox.top
          ) {
            this.leftCollision = true
            if (
              this.hitbox.left < tileList[i].hitbox.right &&
              this.hitbox.bottom < tileList[i].hitbox.top
            ) {
              xOffset += diff(this.hitbox.left, tileList[i].hitbox.right)
            }
          }
        }
      }
    }
  }

  this.draw = function () {
    this.updateHitbox()
    this.collisionCheck()
    this.updatePosition()
    this.animationLoop()

    push()
    scale(this.dir, 1)
    image(
      this.sheet,
      this.dir * this.xpos,
      this.ypos,
      this.width,
      this.height,
      this.sheetX,
      0,
      [this.animationFrameWidth],
      [this.animationFrameHeight]
    )
    pop()
  }

  this.animationLoop = function () {
    this.animationIncrement++

    if (!this.bottomCollision && !mouseIsPressed) {
      this.sheet = characterIdleSheet
      this.sheetName = 'characterIdleSheet'
    } else if (this.xVel != 0 && !mouseIsPressed) {
      this.sheet = characterWalkSheet
      this.sheetName = 'characterWalkSheet'
    } else if (this.xVel == 0 && mouseIsPressed) {
      this.sheet = characterArmedSheet
      this.sheetName = 'characterArmedSheet'
    } else if (this.xVel != 0 && this.bottomCollision && mouseIsPressed) {
      this.sheet = characterArmedWalkSheet
      this.sheetName = 'characterArmedWalkSheet'
    } else if (mouseIsPressed) {
      this.sheet = characterArmedSheet
      this.sheetName = 'characterArmedSheet'
    } else {
      this.sheet = characterIdleSheet
      this.sheetName = 'characterIdleSheet'
    }

    if (this.bottomCollision && this.xVel != 0) {
      if (!footstepSound.isPlaying()) {
        footstepSound.loop()
      }
      if (Math.random() > 0.75) {
        particleList.push(
          new particleObject(
            this.xpos - xOffset,
            this.ypos + this.height / 2 - 3,
            random(2, 4),
            53,
            137,
            198,
            this.dir,
            20
          )
        )
      }
    } else if (footstepSound.isPlaying()) {
      footstepSound.stop()
    }

    if (
      this.animationIncrement > this.animationTime * frameRate() &&
      this.animationFrame < this.maxSheetX
    ) {
      this.animationFrame++
      this.animationIncrement = 0

      if (this.animationFrame >= this.maxSheetX) {
        this.animationFrame = 0
      }
    }
    this.sheetX = this.animationFrame * this.animationFrameWidth
  }
}
