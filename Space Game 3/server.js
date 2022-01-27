var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 7777, listen);
var clientAmount = 0;;

var tileList = [];
var levelWidth = 256;
var levelHeight = 4;
var screenWidth = 1280,
  screenHeight = 720;
var playerList = [];

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('NodeJS Server initiated on http://' + host + ':' + port);

  tileSize = Math.floor(screenWidth * 0.0645) / 2;
  createTerrain(levelWidth, levelHeight);
}

app.use(express.static('public'));

var io = require('socket.io')(server);

io.sockets.on('connection',
  function (socket) {
    clientAmount++;
    io.sockets.emit('clientAmount', clientAmount);
    console.log("Client Connected, ID: " + socket.id);

    for (var i = 0; i < tileList.length; i++) {
      var data = {
        x: tileList[i].xpos,
        y: tileList[i].ypos,
        size: tileList[i].size,
        type: tileList[i].type
      };
      socket.emit('tileData', data);
    }
    console.log('Tile data sent: ' + tileList.length + ' Tiles');

    socket.on('disconnect', function () {
      clientAmount--;
      io.sockets.emit('clientAmount', clientAmount);
      console.log('Client has disconnected, Total Connections: ' + clientAmount);
    });

    socket.on('playerData',
      function (data) {
        socket.broadcast.emit('playerData', data);

        if (playerList.length > (clientAmount)) {
          for (var i = 0; i < clientAmount; i++) {
            playerList.pop();
          }
        }

        var newPlayer = true;
        for (var i = 0; i < playerList.length; i++) {
          if (data.UUID == playerList[i].UUID) {
            newPlayer = false;
          }
        }

        if (playerList.length <= clientAmount && newPlayer == true) {
          playerList.push(new player(data.x + screenWidth / 2, data.y, data.UUID));
        }

        for (var i = 0; i < playerList.length; i++) {
          if (data.UUID == playerList[i].UUID) {
            playerList[i].xpos = data.x + screenWidth / 2;
            playerList[i].ypos = data.y;
          }
        }
      });
  }
);

function tile(tempXpos, tempYpos, tempSize, tempType) {
  this.xpos = tempXpos;
  this.ypos = tempYpos;
  this.size = tempSize;
  this.type = tempType;
}

function player(tempXpos, tempYpos, tempUUID) {
  this.xpos = tempXpos;
  this.ypos = tempYpos;
  this.UUID = tempUUID;
}

function createTerrain(worldWidth, worldHeight) {
  var generator = new Simple1DNoise();
  var noiseX = 1;
  var layer = 0;
  var layersDone = false;

  for (var y = 0; y < worldHeight; y++) {
    xInc = 0;
    for (var x = -worldWidth; x < worldWidth; x++) {
      var noiseY = generator.getVal(xInc);
      noiseY = Math.round(map(noiseY, 0, 1, 0, 5));
      layer = noiseY;

      for (j = layer; j < 8; j++) {
        if (j == layer) {
          if (tileFree(x * tileSize + (screenWidth / 2), (j * tileSize) + (screenHeight - (worldHeight - 1) * tileSize) - (tileSize * 3))) {
            tileList.push(new tile(x * tileSize + (screenWidth / 2), (j * tileSize) + (screenHeight - (worldHeight - 1) * tileSize) - (tileSize * 3), tileSize, 0));
          }
        } else {
          if (tileFree(x * tileSize + (screenWidth / 2), (j * tileSize) + (screenHeight - (worldHeight - 1) * tileSize) - (tileSize * 3))) {
            tileList.push(new tile(x * tileSize + (screenWidth / 2), (j * tileSize) + (screenHeight - (worldHeight - 1) * tileSize) - (tileSize * 3), tileSize, 1));
          }
        }
        layersDone = true;
      }

      xInc += 0.0;
    }
    layersDone = false;
  }

  for (var i = 0; i < tileList.length; i++) {
    var tileTop = false,
      tileLeft = false,
      tileRight = false,
      tileBottom = false,
      tileTopLeft = false,
      tileTopRight = false,
      type;

    if (tileFree(tileList[i].xpos, tileList[i].ypos - tileSize) == false) {
      tileTop = true;
    }
    if (tileFree(tileList[i].xpos - tileSize, tileList[i].ypos) == false) {
      tileLeft = true;
    }
    if (tileFree(tileList[i].xpos + tileSize, tileList[i].ypos) == false) {
      tileRight = true;
    }
    if (tileFree(tileList[i].xpos, tileList[i].ypos + tileSize) == false) {
      tileBottom = true;
    }
    if (tileFree(tileList[i].xpos - tileSize, tileList[i].ypos - tileSize) == false) {
      tileTopLeft = true;
    }
    if (tileFree(tileList[i].xpos + tileSize, tileList[i].ypos - tileSize) == false) {
      tileTopRight = true;
    }

    if (tileTop == false && tileLeft == false && tileRight == true && tileBottom == true) { type = 1; }
    if (tileTop == false && tileLeft == true && tileRight == true && tileBottom == true) { type = 2; }
    if (tileTop == false && tileLeft == true && tileRight == false && tileBottom == true) { type = 3; }
    if (tileTop == false && tileLeft == false && tileRight == false && tileBottom == true) { type = 4; }
    if (tileTop == true && tileLeft == false && tileRight == true && tileBottom == true) { type = 5; }
    if (tileTop == true && tileLeft == true && tileRight == true && tileBottom == true) { type = 6; }
    if (tileTop == true && tileLeft == true && tileRight == false && tileBottom == true) { type = 7; }
    if (tileTop == true && tileLeft == true && tileRight == true && tileBottom == true && tileTopRight == true && tileTopLeft == false) { type = 8; }
    if (tileTop == true && tileLeft == true && tileRight == true && tileBottom == true && tileTopRight == false && tileTopLeft == true) { type = 12; }
    if (tileTop == true && tileLeft == true && tileRight == true && tileBottom == true && tileTopRight == false && tileTopLeft == false) { type = 13; }
    tileList[i].type = type;
  }
}

function tileFree(x, y) {
  var free = false;
  for (var i = 0; i < tileList.length; i++) {
    if (dist(x, y, tileList[i].xpos, tileList[i].ypos) < tileSize) {
      return free;
    }
  }
  free = true;
  return free;
}

function map(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

function dist(x1, y1, x2, y2) {
  var a = x1 - x2
  var b = y1 - y2

  var c = Math.sqrt(a * a + b * b);
  return c;
}

function Simple1DNoise() {
  var MAX_VERTICES = 256;
  var MAX_VERTICES_MASK = MAX_VERTICES - 1;
  var amplitude = 1;
  var scale = 1;

  var r = [];

  for (var i = 0; i < MAX_VERTICES; ++i) {
    r.push(Math.random());
  }

  var getVal = function (x) {
    var scaledX = x * scale;
    var xFloor = Math.floor(scaledX);
    var t = scaledX - xFloor;
    var tRemapSmoothstep = t * t * (3 - 2 * t);

    /// Modulo using &
    var xMin = xFloor & MAX_VERTICES_MASK;
    var xMax = (xMin + 1) & MAX_VERTICES_MASK;

    var y = lerp(r[xMin], r[xMax], tRemapSmoothstep);

    return y * amplitude;
  };

  /**
  * Linear interpolation function.
  * @param a The lower integer value
  * @param b The upper integer value
  * @param t The value between the two
  * @returns {number}
  */
  var lerp = function (a, b, t) {
    return a * (1 - t) + b * t;
  };

  // return the API
  return {
    getVal: getVal,
    setAmplitude: function (newAmplitude) {
      amplitude = newAmplitude;
    },
    setScale: function (newScale) {
      scale = newScale;
    }
  };
};