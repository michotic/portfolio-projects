function resourceNodeObject(x,
    y,
    ID) {
    this.xpos = x;
    this.ypos = y;
    this.resourceID = ID;
    if (this.resourceID == 1) {
        this.life = 60;
        this.name = "stone"
        this.image = stoneNodeImage;
    } else if (this.resourceID == 2) {
        this.life = 40;
        this.name = "plant matter"
        this.image = plantNodeImage;
    }

}

resourceNodeObject.prototype.draw = function () {
    image(this.image, this.xpos + xOffset, this.ypos, TILE_SIZE * 4, TILE_SIZE * 3);
}

resourceNodeObject.prototype.destroyedAction = function () {
    for (var i = 0; i < 30; i++) {
        particleList.push(new particleObject(this.xpos + random(-TILE_SIZE, TILE_SIZE),
            this.ypos + random(-TILE_SIZE, TILE_SIZE),
            random(4),
            180, 180, 200,
            -playerVar.dir,
            random(40, 60),
            5,
            0));
    }
    for (var i = 0; i < INVENTORY_SIZE; i++) {
        if (inventory[i].itemID == this.resourceID) {
            inventory[i].itemAmount++;
            return;
        } else if (inventory[i].itemID == -1) {
            inventory[i].itemID = this.resourceID;
            inventory[i].itemName = this.name;
            inventory[i].itemAmount = 1;
            return;
        }
    }
}