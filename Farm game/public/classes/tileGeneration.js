function generateTiles() {
    for (var i = 0; i < tileList.length; i++) {
        var tileTop = false,
            tileLeft = false,
            tileRight = false,
            tileBottom = false,
            tileTopLeft = false,
            tileTopRight = false,
            tileBottomLeft = false,
            tileBottomRight = false,
            type = 0;

        if (tileFree(tileList[i].xpos, tileList[i].ypos - TILE_SIZE) == false) { tileTop = true; }
        if (tileFree(tileList[i].xpos - TILE_SIZE, tileList[i].ypos) == false) { tileLeft = true; }
        if (tileFree(tileList[i].xpos + TILE_SIZE, tileList[i].ypos) == false) { tileRight = true; }
        if (tileFree(tileList[i].xpos, tileList[i].ypos + TILE_SIZE) == false) { tileBottom = true; }
        if (tileFree(tileList[i].xpos - TILE_SIZE, tileList[i].ypos - TILE_SIZE) == false) { tileTopLeft = true; }
        if (tileFree(tileList[i].xpos + TILE_SIZE, tileList[i].ypos - TILE_SIZE) == false) { tileTopRight = true; }
        if (tileFree(tileList[i].xpos - TILE_SIZE, tileList[i].ypos + TILE_SIZE) == false) { tileBottomLeft = true; }
        if (tileFree(tileList[i].xpos + TILE_SIZE, tileList[i].ypos + TILE_SIZE) == false) { tileBottomRight = true; }

        //Bits calculations
        var tileBits = 0;
        if ((tileTopLeft && tileTop && tileLeft)) { tileBits += 1 * 1; }
        if (tileTop) { tileBits += 2 * 1; }
        if ((tileTopRight && tileTop && tileRight)) { tileBits += 4 * 1; }
        if (tileLeft) { tileBits += 8 * 1; }
        if (tileRight) { tileBits += 16 * 1; }
        if ((tileBottomLeft && tileBottom && tileLeft)) { tileBits += 32 * 1; }
        if (tileBottom) { tileBits += 64 * 1; }
        if ((tileBottomRight && tileBottom && tileRight)) { tileBits += 128 * 1; }

        //Determines tile type from bits
        if (tileBits == 2) { type = 1; }
        if (tileBits == 8) { type = 2; }
        if (tileBits == 10) { type = 3; }
        if (tileBits == 11) { type = 4; }
        if (tileBits == 16) { type = 5; }
        if (tileBits == 18) { type = 6; }
        if (tileBits == 22) { type = 7; }
        if (tileBits == 24) { type = 8; }
        if (tileBits == 26) { type = 9; }
        if (tileBits == 27) { type = 10; }
        if (tileBits == 30) { type = 11; }
        if (tileBits == 31) { type = 12; }
        if (tileBits == 64) { type = 13; }
        if (tileBits == 66) { type = 14; }
        if (tileBits == 72) { type = 15; }
        if (tileBits == 74) { type = 16; }
        if (tileBits == 75) { type = 17; }
        if (tileBits == 80) { type = 18; }
        if (tileBits == 82) { type = 19; }
        if (tileBits == 86) { type = 20; }
        if (tileBits == 88) { type = 21; }
        if (tileBits == 90) { type = 22; }
        if (tileBits == 91) { type = 23; }
        if (tileBits == 94) { type = 24; }
        if (tileBits == 95) { type = 25; }
        if (tileBits == 104) { type = 26; }
        if (tileBits == 106) { type = 27; }
        if (tileBits == 107) { type = 28; }
        if (tileBits == 120) { type = 29; }
        if (tileBits == 122) { type = 30; }
        if (tileBits == 123) { type = 31; }
        if (tileBits == 126) { type = 32; }
        if (tileBits == 127) { type = 33; }
        if (tileBits == 208) { type = 34; }
        if (tileBits == 210) { type = 35; }
        if (tileBits == 214) { type = 36; }
        if (tileBits == 216) { type = 37; }
        if (tileBits == 218) { type = 38; }
        if (tileBits == 219) { type = 39; }
        if (tileBits == 222) { type = 40; }
        if (tileBits == 223) { type = 41; }
        if (tileBits == 248) { type = 42; }
        if (tileBits == 250) { type = 43; }
        if (tileBits == 251) { type = 44; }
        if (tileBits == 254) { type = 45; }
        if (tileBits == 255) { type = 46; }
        if (tileBits == 0) { type = 47; }

        tileList[i].type = type;
    }
}