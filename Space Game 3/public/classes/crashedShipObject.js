function crashedShipObject(x,
    y) {

    this.xpos = x;
    this.ypos = y;

    this.width = TILE_SIZE * 8;
    this.height = TILE_SIZE * 4;

    this.draw = function () {
        image(crashedShipImage,
            this.xpos + xOffset,
            this.ypos,
            this.width,
            this.height);
        //smoke emitter
        if (Math.random() > 0.5) {
            particleList.push(new particleObject(this.xpos - (TILE_SIZE * 2.52) + random(-10, 10),
                this.ypos + (TILE_SIZE * 1) + random(-10, 10),
                random(4),
                150, 150, 150,
                "left",
                random(80, 120),
                1,
                -4));
        }

        if (dist(this.xpos + xOffset,
            this.ypos,
            playerVar.xpos,
            playerVar.ypos) < INTERACT_RANGE) {

        }
    }

    this.interact = function () {
        print('ship interact');
        var possibleDialogue = [
            "this doesn't look good",
            "poor old betty",
            "she probably just needs some duct tape",
            "she's a bit of a fixxer-upper"
        ];

        //dialogue box
        if (dialogueList.length < 1) {
            print('dialogue made');
            dialogueList.push(new dialogueObject(playerVar.xpos,
                playerVar.ypos - TILE_SIZE,
                possibleDialogue[int(random(possibleDialogue.length))]));
        }
    }
}