function particleObject(x, y, size, r, g, b, dir, life, xspeed, yspeed) {
    this.xpos = x;
    this.ypos = y;
    this.size = size;
    this.red = r;
    this.green = g;
    this.blue = b;
    this.life = life;
    this.dir = dir;
    this.xspeed = xspeed;
    this.yspeed = yspeed;

    this.draw = function () {
        fill(this.red, this.green, this.blue);
        rect(this.xpos + xOffset, this.ypos, this.size, this.size);

        this.life -= random(1, 3);
        this.ypos += random(this.yspeed);

        if (this.dir == 'left' || this.dir == -1) {
            this.xpos -= random(this.xspeed);
        } else {
            this.xpos += random(this.xspeed);
        }
    }
}