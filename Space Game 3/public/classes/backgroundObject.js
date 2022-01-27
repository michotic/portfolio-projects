function backgroundObject(tempXpos, tempImage) {
    this.xpos = tempXpos
    this.ypos = height / 2;
    this.image = tempImage;
    this.scrollSpeed = 0.3;
    this.height = height;
    this.width = width;

    this.hitbox = {
        top: this.ypos - (this.height / 2),
        bottom: this.ypos + (this.height / 2),
        left: (this.xpos - (this.width / 2)) + (xOffset * this.scrollSpeed),
        right: (this.xpos + (this.width / 2)) + (xOffset * this.scrollSpeed)
    };

    this.draw = function () {
        this.updateHitbox();
        this.wrapAround();
        image(this.image, this.xpos + (xOffset * this.scrollSpeed), this.ypos, this.width, this.height);
    }

    this.moveLeft = function () {
        this.xpos += this.scrollSpeed;
    }

    this.moveRight = function () {
        this.xpos -= this.scrollSpeed;
    }

    this.updateHitbox = function () {
        this.hitbox = {
            top: this.ypos - (this.height / 2),
            bottom: this.ypos + (this.height / 2),
            left: (this.xpos - (this.width / 2)) + (xOffset * this.scrollSpeed),
            right: (this.xpos + (this.width / 2)) + (xOffset * this.scrollSpeed)
        };
    }

    this.wrapAround = function () {
        if (this.hitbox.left > width) {
            this.xpos = (- (width * 0.5)) + 1 - (xOffset * this.scrollSpeed);
        }
        if (this.hitbox.right < 0) {
            this.xpos = width * 1.5 - 1 - (xOffset * this.scrollSpeed);
        }
    }
}
