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
  this.ACCEL_RATE = (TILE_SIZE / 2) * 0.03
  this.xVel = 0
  this.TERMINAL_VEL = TILE_SIZE / 4
  this.yVel = 0
  this.yAccel = 0

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
    right: this.xpos + this.width / 2
  }

  this.moveLeft = function () {
    this.dir = -1
    if (this.xAccel <= this.TERMINAL_VEL &&
      this.xAccel >= -this.TERMINAL_VEL &&
      this.leftCollision) {
      this.xAccel += this.ACCEL_RATE
    }
  }

  this.moveRight = function () {
    this.dir = 1
    if (this.xAccel <= this.TERMINAL_VEL &&
      this.xAccel >= -this.TERMINAL_VEL &&
      this.rightCollision) {
      this.xAccel -= this.ACCEL_RATE
    }
  }

  this.moveUp = function () {
    this.dir = -1
    if (this.yAccel <= this.TERMINAL_VEL &&
      this.yAccel >= -this.TERMINAL_VEL &&
      this.topCollision) {
      this.yAccel += this.ACCEL_RATE
    }
  }

  this.moveDown = function () {
    this.dir = 1
    if (this.yAccel <= this.TERMINAL_VEL &&
      this.yAccel >= -this.TERMINAL_VEL &&
      this.bottomCollision) {
      this.yAccel -= this.ACCEL_RATE
    }
  }

  this.updatePosition = function () {
    if (this.xVel <= this.TERMINAL_VEL &&
      this.xVel >= -this.TERMINAL_VEL) {
      this.xVel += this.xAccel
    }
    xOffset += this.xVel

    this.xAccel *= 0.5
    this.xVel *= 0.5

    if (this.xVel < 0.2 && this.xVel > -0.2) {
      this.xVel = 0
    }

    if (this.yVel <= this.TERMINAL_VEL && this.yVel >= -this.TERMINAL_VEL) {
      this.yVel += this.yAccel
    }
    yOffset += this.yVel

    this.yAccel *= 0.5
    this.yVel *= 0.5

    if (this.yVel < 0.2 && this.yVel > -0.2) {
      this.yVel = 0
    }
  }

  this.updateHitbox = function () {
    this.hitbox = {
      top: this.ypos - this.height / 2,
      bottom: this.ypos + this.height / 2,
      left: this.xpos - this.width / 2,
      right: this.xpos + this.width / 2
    }
  }

  this.collisionCheck = function () {
    this.bottomCollision = false
    this.rightCollision = false
    this.leftCollision = false
    this.topCollision = false

    for (var i = 0; i < tileList.length; i++) {
      if (onScreen(tileList[i].xpos + xOffset, tileList[i].ypos + yOffset)) {
        if (dist(this.xpos, this.ypos, tileList[i].xpos + xOffset, tileList[i].ypos + yOffset) < TILE_SIZE * 1.5) {
          if (this.hitbox.bottom > tileList[i].hitbox.top - COLLISION_BUFFER &&
            this.hitbox.top < tileList[i].hitbox.top - COLLISION_BUFFER &&
            this.hitbox.left > tileList[i].hitbox.left - COLLISION_BUFFER * 3 &&
            this.hitbox.right < tileList[i].hitbox.right + COLLISION_BUFFER * 3) {
            this.bottomCollision = true
          }

          if (this.hitbox.top < tileList[i].hitbox.bottom - COLLISION_BUFFER &&
            this.hitbox.bottom > tileList[i].hitbox.bottom - COLLISION_BUFFER &&
            this.hitbox.left > tileList[i].hitbox.left - COLLISION_BUFFER * 3 &&
            this.hitbox.right < tileList[i].hitbox.right + COLLISION_BUFFER * 3) {
            this.topCollision = true
          }

          if (this.hitbox.right > tileList[i].hitbox.left - COLLISION_BUFFER &&
            this.hitbox.right < tileList[i].hitbox.right - COLLISION_BUFFER &&
            this.hitbox.bottom > tileList[i].hitbox.top + COLLISION_BUFFER) {
            this.rightCollision = true
          }

          if (this.hitbox.left < tileList[i].hitbox.right + COLLISION_BUFFER &&
            this.hitbox.left > tileList[i].hitbox.left + COLLISION_BUFFER &&
            this.hitbox.bottom > tileList[i].hitbox.top + COLLISION_BUFFER) {
            this.leftCollision = true
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
    image(this.sheet, this.xpos, this.ypos, this.width, this.height, this.sheetX, 0, [this.animationFrameWidth], [this.animationFrameHeight])
  }

  this.animationLoop = function () {
    this.animationIncrement++
    this.sheet = characterIdleSheet
    this.sheetName = 'characterIdleSheet'

    if (this.xVel != 0 || this.yVel != 0) {
      if (!footstepSound.isPlaying()) {
        footstepSound.loop()
      }
    }
    else if (footstepSound.isPlaying()) {
      footstepSound.stop()
    }

    if (this.animationIncrement > this.animationTime * frameRate() &&
      this.animationFrame < this.maxSheetX) {
      this.animationFrame++
      this.animationIncrement = 0

      if (this.animationFrame >= this.maxSheetX) {
        this.animationFrame = 0
      }
    }
    this.sheetX = this.animationFrame * this.animationFrameWidth
  }
}
