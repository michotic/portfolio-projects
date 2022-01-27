function weaponObject(x,
    y,
    type) {
    this.xpos = x;
    this.ypos = y;
    this.weaponType = type;

    this.draw = function () {
        this.xpos = playerVar.xpos + (playerVar.dir * (PIXEL_SIZE * 4));
        this.ypos = playerVar.ypos - (PIXEL_SIZE * 1);
        push();
        scale(playerVar.dir, 1);
        image(laserGunImage,
            playerVar.dir * this.xpos,
            this.ypos, TILE_SIZE,
            TILE_SIZE);
        pop();
    }

    this.showBeam = function () {
        if (mouseX < playerVar.xpos) {
            playerVar.dir = -1;
        } else {
            playerVar.dir = 1;
        }

        this.beamStart = {
            x: this.xpos,
            y: this.ypos
        };
        if (dist(mouseX, mouseY, playerVar.xpos, playerVar.ypos) < BEAM_RANGE) {
            this.beamEnd = {
                x: mouseX,
                y: this.ypos
            };
        } else {
            this.beamEnd = {
                x: this.xpos + (BEAM_RANGE * playerVar.dir),
                y: this.ypos
            };
        }

        for (var i = 0; i < nodeList.length; i++) {
            if (dist(this.xpos,
                this.ypos,
                nodeList[i].xpos + xOffset,
                nodeList[i].ypos) < BEAM_RANGE &&
                (diff(nodeList[i].ypos,
                    this.ypos) < TILE_SIZE * 1.65 &&
                    diff(this.ypos,
                        nodeList[i].ypos) < TILE_SIZE * 1.75)) {
                if ((playerVar.dir == -1 &&
                    nodeList[i].xpos + TILE_SIZE + xOffset > this.beamEnd.x &&
                    nodeList[i].xpos + xOffset < this.xpos) ||
                    (playerVar.dir == 1 &&
                        nodeList[i].xpos - TILE_SIZE + xOffset < this.beamEnd.x &&
                        nodeList[i].xpos + xOffset > this.xpos)) {
                    this.beamEnd.x = nodeList[i].xpos + xOffset;
                    nodeList[i].life--;
                    particleList.push(new particleObject(this.beamEnd.x - xOffset + random(-10, 10),
                        this.beamEnd.y + random(-10, 10),
                        random(4),
                        70, 70, 70,
                        playerVar.dir,
                        random(80, 120),
                        2,
                        -4));
                    i = nodeList.length;
                }
            }
        }

        push();
        stroke(255, 0, 0);
        strokeWeight(PIXEL_SIZE * 4);
        line(this.beamStart.x,
            this.beamStart.y,
            this.beamEnd.x,
            this.beamEnd.y);
        stroke(255, 175, 175);
        strokeWeight(PIXEL_SIZE * 2);
        line(this.beamStart.x,
            this.beamStart.y,
            this.beamEnd.x,
            this.beamEnd.y);
        pop();

        if (Math.random() > 0.8) {
            particleList.push(new particleObject(this.beamEnd.x - xOffset + random(-10, 10),
                this.beamEnd.y + random(-10, 10),
                random(4),
                255, 170, 170,
                playerVar.dir,
                random(80, 120),
                2,
                10));
        }
    }
}