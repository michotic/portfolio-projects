function tileObject(objectX,
    objectY,
    objectSize,
    objectType) {
    this.xpos = objectX;
    this.ypos = objectY;
    this.type = objectType;
    this.width = objectSize;
    this.height = objectSize;

    this.hitbox = {
        top: this.ypos - (this.height / 2),
        bottom: this.ypos + (this.height / 2),
        left: (this.xpos - (this.width / 2)) + xOffset,
        right: (this.xpos + (this.width / 2)) + xOffset
    };

    this.updateHitbox = function () {
        this.hitbox = {
            top: this.ypos - (this.height / 2),
            bottom: this.ypos + (this.height / 2),
            left: (this.xpos - (this.width / 2)) + xOffset,
            right: (this.xpos + (this.width / 2)) + xOffset
        };
    }
}

tileObject.prototype.draw = function () {
    this.sheetY = int((this.type) / 8) * 16;
    this.sheetX = ((this.type) - ((this.sheetY / 16) * 8)) * 16;

    this.updateHitbox();

    image(tileSheet,
        this.xpos + xOffset,
        this.ypos, this.width,
        this.height,
        this.sheetX,
        this.sheetY,
        [16],
        [16]);
}