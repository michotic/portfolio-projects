function createTerrain(worldWidth) {
    var layer = 0;
    var MAX_HEIGHT = 20;
    var shipPlaced = false;
    var stepValue = 0.1;

    xInc = 1;
    for (var x = -worldWidth; x < worldWidth; x++) {
        noiseDetail(4, 0.3);
        var noiseY = noise(xInc);
        noiseY = Math.round(map(noiseY,
            0,
            1,
            0,
            -MAX_HEIGHT));
        layer = noiseY;

        for (j = layer; j < (height / TILE_SIZE); j++) {
            if (j == layer) { var type = 1; } else { type = 0; }
            if (!shipPlaced &&
                type == 1 &&
                x == worldWidth / 2 - (int(width / TILE_SIZE) * 2)) {
                interactiveList.push(new crashedShipObject(x * TILE_SIZE + (width / 2),
                    (j * TILE_SIZE) + height - TILE_SIZE * 2.5));
                shipPlaced = true;
            }

            if (type == 1 &&
                Math.random() > 0.8 &&
                !tileFree((x - 3) * TILE_SIZE + (width / 2), (j * TILE_SIZE) + height) &&
                !tileFree((x - 2) * TILE_SIZE + (width / 2), (j * TILE_SIZE) + height) &&
                !tileFree((x - 1) * TILE_SIZE + (width / 2), (j * TILE_SIZE) + height)) {
                nodeList.push(new resourceNodeObject((x - 2) * TILE_SIZE + (width / 2),
                    (j * TILE_SIZE) + height - TILE_SIZE * 2,
                    ceil(random(0, 2))));
            }

            if (tileFree(x * TILE_SIZE + (width / 2),
                (j * TILE_SIZE) + height) &&
                (j * TILE_SIZE) + height < height + (TILE_SIZE * 2)) {
                tileList.push(new tileObject(x * TILE_SIZE + (width / 2),
                    (j * TILE_SIZE) + height,
                    TILE_SIZE,
                    type));
            }
        }

        xInc += stepValue;
    }
    layersDone = false;
    generateTiles();
}

function tileFree(x, y) {
    var free = false;
    for (var i = 0; i < tileList.length; i++) {
        if (dist(x, y, tileList[i].xpos, tileList[i].ypos) < TILE_SIZE) {
            return free;
        }
    }
    free = true;
    return free;
}