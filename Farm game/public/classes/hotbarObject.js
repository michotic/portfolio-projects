function hotbarObject() {
  this.xpos = width / 2
  this.ypos = height * 0.9
  this.selSlot = 1
  this.slot = []

  this.draw = function() {
    this.hotbarCheck()
    image(hotbarOverlay, this.xpos, this.ypos, TILE_SIZE * 4, TILE_SIZE) //hotbar
    image(
      itemSelectedOverlay,
      this.xpos - TILE_SIZE * 2.5 + TILE_SIZE * this.selSlot,
      this.ypos,
      TILE_SIZE,
      TILE_SIZE
    ) //highlight selected slot

    if (inventory.length > this.slot.length) {
      this.slot.push(inventory[this.slot.length])
    }

    for (var i = 0; i < this.slot.length; i++) {
      var iconNum = this.slot[i].itemID - 1

      image(
        icons[iconNum],
        this.xpos - TILE_SIZE * 1.5 + TILE_SIZE * i,
        this.ypos,
        TILE_SIZE,
        TILE_SIZE
      ) // draws icons
    }

    if (this.selSlot <= this.slot.length && this.slot[this.selSlot - 1].itemID > 0) {
      strokeWeight(PIXEL_SIZE * 2)
      stroke(0)
      textFont(dialogueFont)
      textSize(PIXEL_SIZE * 8)
      fill(255)
      if (this.slot[this.selSlot - 1].itemAmount > 1) {
        text(
          this.slot[this.selSlot - 1].itemName +
            ' x ' +
            this.slot[this.selSlot - 1].itemAmount,
          this.xpos,
          this.ypos - TILE_SIZE * 0.75
        )
      } else {
        text(
          this.slot[this.selSlot - 1].itemName,
          this.xpos,
          this.ypos - TILE_SIZE * 0.75
        )
      }
    }
  }

  this.hotbarCheck = function() {
    for (var i = 0; i < this.slot.length; i++) { // checks for items that youve run out of
      if (this.slot[i].itemAmount < 1) {
        this.slot.splice(i, 1)
      }
    }
  }
}
