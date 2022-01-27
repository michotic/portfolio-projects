var express = require('express');
var app = express();
var server = app.listen(7777, listen);
var io = require('socket.io')(server);
var socketList = [];
var http = require('http'),
  https = require('https');

http.globalAgent.maxSockets = 25;
https.globalAgent.maxSockets = 25;

var tileSize,
  clientAmount,
  screenWidth,
  screenHeight;
var tileList = [];
var levelWidth = 32;
var levelHeight = 4;

var playerList = [];
var projectileList = [];

var amountOfAITypes = 5;
var originalAIAmount = 0;
var AIAmount = 0;
var aiList = [];
var serverFPS = 30;
var tickRate = 1000 / serverFPS;
var tickRateDiff = tickRate / 60;
var gravityForce = 1;

var mapWidth = 40;
var mapHeight = 10;
var gameMap = [
  //                                        X <- x marks spawn-x
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
];

var aiMap = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

function createMap() {
  var startingX = 14;
  for (var y = 0; y < mapHeight; y++) {
    for (var x = -startingX; x < mapWidth - startingX; x++) {
      var index = (y * mapWidth + startingX) + x;
      var ypos = (y * tileSize) + (screenHeight - (mapHeight - 1) * tileSize);
      if (gameMap[index] > 0) {
        tileList.push(new tile(x * tileSize + (screenWidth / 2), ypos, tileSize, gameMap[index]));
      }
      if (aiMap[index] > 0) {
        aiList.push(new AI(x * tileSize + (screenWidth / 2), ypos, tileSize, aiMap[index], Math.floor(Math.random() * 999999 - 1)));
      }
    }
  }
  console.log('Map Generated.');
}

setup();
app.use(express.static('public'));

function update() {
  AIAmount = aiList.length;
  io.sockets.emit('AIAmount', AIAmount);
  for (var i = 0; i < aiList.length; i++) {
    aiList[i].update();
    var data = {
      x: aiList[i].xpos,
      y: aiList[i].ypos,
      size: aiList[i].size,
      type: aiList[i].type,
      ID: aiList[i].UUID,
      frame: aiList[i].frame
    };
    if (aiList[i].lives <= 0) {
      aiList.splice(i, 1);
    }
    io.sockets.emit('aiData', data);
  }

  for (var i = 0; i < projectileList.length; i++) {
    projectileList[i].update();
    for (var j = 0; j < aiList.length; j++) {
      aiList[j].avoidProjectile(projectileList[i].xpos, projectileList[i].ypos, projectileList[i].dir);
    }
    if (projectileList[i].lifeSpan < 0) {
      projectileList.splice(i, 1);
    }
  }

  setTimeout(update, tickRate);
}

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server has started  on port: ' + port);
}

function setup() {
  screenWidth = 960;
  screenHeight = 600
  clientAmount = 0;

  tileSize = 64;
  //createTerrain(levelWidth, levelHeight, Math.ceil(screenWidth / tileSize) + 1);
  createMap();
  update();
}

io.sockets.on('connection',
  function (socket) {
    clientAmount++;
    io.sockets.emit('clientAmount', clientAmount);
    console.log('Client Connected, Total Connections: ' + clientAmount);

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
          playerList.push(new player(data.x + screenWidth / 2, data.y, data.dir, data.UUID, data.life, data.attacking, data.username, data.class, data.attackType));
        }

        for (var i = 0; i < playerList.length; i++) {
          if (data.UUID == playerList[i].UUID) {
            playerList[i].xpos = data.x + screenWidth / 2;
            playerList[i].ypos = data.y;
            playerList[i].dir = data.dir;
            playerList[i].lives = data.life;
            playerList[i].attacking = data.attacking;
            playerList[i].class = data.class;
            playerList[i].attackType = data.attackType;
          }
        }
      });

    socket.on('projectileData',
      function (data) {
        socket.broadcast.emit('projectileData', data);

        //Determines whether or not projectile is newly created.
        var newProjectile = true;
        for (var i = 0; i < projectileList.length; i++) {
          if (data.UUID == projectileList[i].UUID) {
            newProjectile = false;
          }
        }

        //Creates object for new projectiles.
        if (newProjectile == true) {
          projectileList.push(new projectile(data.x, data.y, data.size, data.dir, data.UUID, data.userUUID, 0, data.lifeSpan, data.type));
        }

        //Updates pre-existing projectiles.
        for (var i = 0; i < projectileList.length; i++) {
          if (data.UUID == projectileList[i].UUID) {
            projectileList[i].xpos = data.x;
            projectileList[i].ypos = data.y;
            projectileList[i].dir = data.dir;
            projectileList[i].userUUID = data.userUUID;
            projectileList[i].lifeSpan = data.lifeSpan;
            projectileList[i].type = data.type;
          }
        }
      });

    socket.on('killData',
      function (data) {
        socket.broadcast.emit('killData', data);
      });

    socket.on('summonData',
      function (data) {
        aiList.push(new AI(data.x + (screenWidth / 2), data.y, tileSize, data.type, Math.floor(Math.random() * 999999 - 1)));
      });

  }
);

function createTerrain(worldWidth, worldHeight) {
  var generator = new Simple1DNoise();
  var noiseX = 1;
  var layer = 0;
  var layersDone = false;

  for (var y = 0; y < worldHeight; y++) {
    xInc = 1;
    for (var x = -worldWidth; x < worldWidth; x++) {
      var noiseY = generator.getVal(xInc);
      noiseY = Math.round(map(noiseY, 0, 1, 0, 5));
      layer = noiseY;

      for (j = layer; j < 8; j++) {
        if (j == layer) {
          if (tileFree(x * tileSize + (screenWidth / 2), (j * tileSize) + (screenHeight - (worldHeight - 1) * tileSize) - (tileSize * 3))) {
            tileList.push(new tile(x * tileSize + (screenWidth / 2), (j * tileSize) + (screenHeight - (worldHeight - 1) * tileSize) - (tileSize * 3), tileSize, 1));
          }
        } else {
          if (tileFree(x * tileSize + (screenWidth / 2), (j * tileSize) + (screenHeight - (worldHeight - 1) * tileSize) - (tileSize * 3))) {
            tileList.push(new tile(x * tileSize + (screenWidth / 2), (j * tileSize) + (screenHeight - (worldHeight - 1) * tileSize) - (tileSize * 3), tileSize, Math.floor(Math.random() * 3 + 1)));
          }
        }
        layersDone = true;
      }

      xInc += 0.18;
    }
    layersDone = false;
  }
  createAI();
}

function tileFree(x, y) {
  var free = false;
  for (var i = 0; i < tileList.length; i++) {
    if (dist(x, y, tileList[i].xpos, tileList[i].ypos) < tileSize * 0.9) {
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

function createAI() {
  for (var i = 0; i < originalAIAmount; i++) {
    var x = Math.floor(Math.random() * (levelWidth * 2) + -levelWidth + 5);
    var y = -tileSize;
    var z = (i % 4) + 1; //Math.floor(Math.random() * amountOfAITypes + 1);
    aiList.push(new AI(x * tileSize + (screenWidth / 2), y, tileSize, z, Math.floor(Math.random() * 999999 - 1)));
    console.log('Type: ' + z + ', AI #' + i + ' created at X: ' + aiList[i].xpos);
  }
}

function playerNearby(x, y, z) {
  var val = [false, 0, 0];
  for (var i = 0; i < playerList.length; i++) {
    if (dist(x, y, playerList[i].xpos, playerList[i].ypos) < tileSize * z) {
      val = [true, playerList[i].xpos, playerList[i].ypos];
    }
  }
  return val;
}

function AINearby(x, y, z, ID) {
  var val = [false, 0, 0];
  for (var i = 0; i < aiList.length; i++) {
    if (dist(x, y, aiList[i].xpos, aiList[i].ypos) < tileSize * z && aiList[i].UUID != ID) {
      val = [true, aiList[i].xpos, aiList[i].ypos];
    }
  }
  return val;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    Tile Class
function tile(tempXpos, tempYpos, tempSize, tempType) {
  this.xpos = tempXpos;
  this.ypos = tempYpos;
  this.size = tempSize;
  this.type = tempType;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    AI Class
function AI(tempXpos, tempYpos, tempSize, tempType, tempUUID) {
  this.xpos = tempXpos;
  this.ypos = tempYpos;
  this.size = tempSize;
  this.type = tempType;
  this.UUID = tempUUID;

  this.decelerationRate = 0.5;
  this.xVelocity = 0;
  this.xAcceleration = 0;
  this.yVelocity = 0;
  this.yAcceleration = 0;
  this.terminalYVelocity = 16 / tickRateDiff;
  this.knockbackAmount = 10;

  this.collisionMultiplier = 1.3;

  this.dir = 0;
  this.frame = 0;
  this.damageCooldown = 0;

  this.attacking = false;

  //Green slime.
  if (this.type == 1) {
    this.behaviour = 'neutral';
    this.collisionWidth = 15 * 4;
    this.sightRange = 3;
    this.followDistance = 0;
    this.maxLives = 3;
    this.lives = this.maxLives;

    this.accelerationRate = 1;
    this.terminalXVelocity = 2 / tickRateDiff;
    this.jumpAmount = 3 / tickRateDiff;
    this.height = tileSize;
  }
  //Blue slime.
  if (this.type == 2) {
    this.collisionWidth = 15 * 4;
    this.behaviour = 'timid';
    this.sightRange = 3;
    this.followDistance = 0;
    this.maxLives = 2;
    this.lives = this.maxLives;

    this.accelerationRate = 2;
    this.terminalXVelocity = 2 / tickRateDiff;
    this.jumpAmount = 3 / tickRateDiff;
    this.height = tileSize;
  }
  //Grey slime.
  if (this.type == 3) {
    this.collisionWidth = 15 * 4;
    this.behaviour = 'hostile';
    this.sightRange = 4;
    this.followDistance = 1;
    this.maxLives = 4;
    this.lives = this.maxLives;

    this.accelerationRate = 2;
    this.terminalXVelocity = 2 / tickRateDiff;
    this.jumpAmount = 3 / tickRateDiff;
    this.height = tileSize;

    this.primaryAttackDuration = 20;
    this.primaryAttackCooldown = 0;
  }
  //Purple slime.
  if (this.type == 4) {
    this.collisionWidth = 15 * 4;
    this.behaviour = 'friendly';
    this.sightRange = 4;
    this.followDistance = 3;
    this.maxLives = 2;
    this.lives = this.maxLives;

    this.accelerationRate = 2;
    this.terminalXVelocity = 2 / tickRateDiff;
    this.jumpAmount = 3 / tickRateDiff;
    this.height = tileSize;
  }
  //Baby grey slime.
  if (this.type == 5) {
    this.collisionWidth = 13 * 4;
    this.behaviour = 'hostile';
    this.sightRange = 4;
    this.followDistance = 1;
    this.maxLives = 2;
    this.lives = this.maxLives;

    this.accelerationRate = 2;
    this.terminalXVelocity = 2 / tickRateDiff;
    this.jumpAmount = 3 / tickRateDiff;
    this.height = tileSize / 2;

    this.primaryAttackDuration = 20;
    this.primaryAttackCooldown = 0;
  }

  this.respawn = function () {
    var x = Math.floor(Math.random() * (levelWidth * 2) + -levelWidth + 5);
    this.ypos = -tileSize;
    this.yVelocity = 0;
    this.yAcceleration = 0;
    this.xpos = x * tileSize;
    this.lives = this.maxLives;
  }

  this.update = function () {
    if (this.lives < 1) {
      this.respawn();
    }
    if (this.damageCooldown > 0) {
      this.damageCooldown -= 1 / tickRateDiff;
    }
    this.gridXpos = Math.floor(this.xpos / tileSize) * tileSize
    this.gridYpos = Math.floor(this.ypos / tileSize) * tileSize
    this.chooseMovement();
    this.attackCheck();
    this.updateHitBox();
    this.updatePosition();
  }

  this.updateHitBox = function () {
    this.hitBox = {
      left: this.xpos - (this.collisionWidth / 2),
      right: this.xpos + (this.collisionWidth / 2),
      top: this.ypos - (this.height / 2) + (4 * 4),
      bottom: this.ypos + (this.height / 2)
    };
  }

  this.chooseMovement = function () {
    var nearbyPlayer = playerNearby(this.xpos, this.ypos, this.sightRange);
    var nearbyAI = AINearby(this.xpos, this.ypos, 0.25, this.UUID);

    if (nearbyAI[0] == true) {
      this.avoidAI(nearbyAI[1]);
    }

    if (this.behaviour == 'neutral') {
      this.roam();
    }
    if (this.behaviour == 'timid') {
      if (nearbyPlayer[0] == true) {
        this.avoidPlayer(nearbyPlayer[1], nearbyPlayer[2]);
      } else {
        this.roam();
      }
    }
    if (this.behaviour == 'hostile' || this.behaviour == 'friendly') {
      if (nearbyPlayer[0] == true) {
        this.followPlayer(nearbyPlayer[1], nearbyPlayer[2]);
      } else {
        this.roam();
      }
    }
  }

  this.followPlayer = function (targetX, targetY) {
    if (this.xpos + (this.followDistance * tileSize) <= targetX) {
      this.dir = 1;
      this.moveRight();
    }
    if (this.xpos - (this.followDistance * tileSize) >= targetX) {
      this.dir = 2;
      this.moveLeft();
    }
  }

  this.avoidPlayer = function (targetX, targetY) {
    if (this.xpos > targetX) {
      this.dir = 1;
      this.moveRight();
    }
    if (this.xpos < targetX) {
      this.dir = 2;
      this.moveLeft();
    }
  }

  this.avoidAI = function (x) {
    var targetX = x;
    if (this.xpos < targetX) {
      this.moveLeft();
    }
    if (this.xpos > targetX) {
      this.moveRight();
    }
  }

  this.roam = function () {
    if (this.dir == 1) {
      //if (tileFree(this.gridXpos + tileSize * 2, this.gridYpos + tileSize * 2) == false) {
      this.moveRight();
      //}
    }

    if (this.dir == 2) {
      //if (tileFree(this.gridXpos - tileSize * 2, this.gridYpos + tileSize * 2) == false) {
      this.moveLeft();
      //}
    }

    if (this.dir < 2 && Math.random() < 0.01) {
      this.dir++;
    }
    if (this.dir > 0 && Math.random() < 0.01) {
      this.dir--;
    }
  }

  this.avoidProjectile = function (x, y, dir) {
    if (dist(this.xpos, this.ypos, x, y) < tileSize * this.sightRange * 2 && this.ypos - tileSize < y && this.ypos + tileSize > y) {
      if ((dir == 1 && this.xpos > x) || (dir == 2 && this.xpos < x)) {
        if (this.yVelocity >= 0) {
          this.jump();
        }
      }
    }
  }

  this.jump = function () {
    if (tileFree(this.gridXpos, this.gridYpos - tileSize)) {
      if (this.bottomCollision && this.yVelocity >= 0) {
        this.frame = 3;
        this.yAcceleration = -this.jumpAmount;
        this.yVelocity = this.yAcceleration;
      }
    }
  }

  this.moveLeft = function () {
    if (this.leftCollision) {
      this.jump();
    }
    if (!this.leftCollision) {
      this.xAcceleration -= this.accelerationRate;
      this.frame = 2;
    }
  }

  this.moveRight = function () {
    if (this.rightCollision) {
      this.jump();
    }
    if (!this.rightCollision) {
      this.xAcceleration += this.accelerationRate;
      this.frame = 1;
    }
  }

  this.updatePosition = function () {
    this.collisionCheck();
    /* Y AXIS PHYSICS */
    if (!this.bottomCollision) {
      this.yAcceleration = gravityForce;
      this.frame = 3;
    } else if (this.bottomCollision == true && this.yVelocity > 0) {
      this.yAcceleration = 0;
      this.yVelocity = 0;
      if (this.frame == 3) {
        this.frame = 0;
      }
    }
    if (this.yVelocity < this.terminalYVelocity && this.yVelocity > -this.terminalYVelocity) {
      this.yVelocity += this.yAcceleration;
    }
    this.ypos += this.yVelocity;

    /* X AXIS PHYSICS */
    if (this.xVelocity < this.terminalXVelocity && this.xVelocity > -this.terminalXVelocity) {
      this.xVelocity += this.xAcceleration;
    }

    this.xpos += this.xVelocity;
    if (this.bottomCollision == true) {
      this.frame = 0;
    }

    this.xAcceleration = 0;
    if (this.xVelocity < 0) {
      this.xVelocity += this.decelerationRate
      if (this.bottomCollision == true) {
        this.frame = 2;
      }
    }
    if (this.xVelocity > 0) {
      this.xVelocity -= this.decelerationRate
      if (this.bottomCollision == true) {
        this.frame = 1;
      }
    }

    if (!this.bottomCollision) {
      this.fallToDeath();
    }
  }

  this.fallToDeath = function () {
    if (this.ypos > screenHeight) {
      //this.respawn();
      this.lives = 0;
    }
  }

  this.primaryAttack = function () {
    if (this.type == 'hostile') {
      this.attacking = true;
      this.primaryAttackCooldown = this.primaryAttackDuration * 2;
    }
  }

  this.collisionCheck = function () {
    this.bottomCollision = false;
    this.leftCollision = false;
    this.topCollision = false;
    this.rightCollision = false;
    for (var i = 0; i < tileList.length; i++) {
      if (dist(this.xpos, this.ypos, tileList[i].xpos, tileList[i].ypos) < tileSize * 1.5) {
        if (this.ypos + this.size >= tileList[i].ypos && this.ypos <= tileList[i].ypos - (tileSize * 0.4)) {
          if (this.xpos >= tileList[i].xpos - (this.collisionWidth * 0.9) && this.xpos <= tileList[i].xpos + (this.collisionWidth * 0.9)) {
            this.ypos = (Math.floor(this.ypos / tileSize) * tileSize) + (this.size / 2) - 8;
            this.bottomCollision = true;
          }
        }
        if (this.xpos >= tileList[i].xpos - (tileSize / 2) && this.xpos <= tileList[i].xpos + this.collisionWidth) {
          if (this.ypos + (this.size / this.collisionMultiplier) >= tileList[i].ypos && this.ypos - (this.size / this.collisionMultiplier) <= tileList[i].ypos) {
            this.xVelocity = 0;
            this.leftCollision = true;
          }
        }
        if (this.xpos >= tileList[i].xpos - this.collisionWidth && this.xpos <= tileList[i].xpos + (tileSize / 2)) {
          if (this.ypos + (this.size / this.collisionMultiplier) >= tileList[i].ypos && this.ypos - (this.size / this.collisionMultiplier) <= tileList[i].ypos) {
            this.xVelocity = 0;
            this.rightCollision = true;
          }
        }
        if (tileFree(this.xpos, this.ypos - (tileSize * 2)) == true) {
          //this.yVelocity = 0;
          this.topCollision = true;
        }
      }
    }
  }

  this.attackCheck = function () {
    for (var i = 0; i < playerList.length; i++) {
      if (dist(this.xpos, this.ypos, playerList[i].xpos, playerList[i].ypos) < tileSize) {
        if (playerList[i].attacking == true) {
          if (this.damageCooldown <= 0) {
            this.lives -= 1;
            this.damageCooldown = 20;

            if (this.lives == 0) {
              data = {
                killerUUID: playerList[i].UUID,
                victimUUID: this.UUID,
                type: 'melee'
              }
              io.sockets.emit('killData', data);
            }

            if (playerList[i].dir == 'right') {
              this.xVelocity += this.knockbackAmount;
              this.yVelocity -= this.knockbackAmount;
            }
            if (playerList[i].dir == 'left') {
              this.xVelocity -= this.knockbackAmount;
              this.yVelocity -= this.knockbackAmount;
            }
          }
        }
      }
    }

    for (var i = 0; i < projectileList.length; i++) {
      if (dist(this.xpos, this.ypos, projectileList[i].xpos, projectileList[i].ypos) < this.size * 0.75 && this.damageCooldown <= 0 && projectileList[i].lifeSpan > 0) {
        this.lives -= 1;
        this.damageCooldown = 16;
        projectileList[i].lifeSpan = 0;

        if (this.lives == 0) {
          data = {
            killerUUID: projectileList[i].userUUID,
            victimUUID: this.UUID,
            type: 'range'
          }
          io.sockets.emit('killData', data);
        }

        if (projectileList[i].dir == 1) {
          this.xVelocity += this.knockbackAmount;
          //this.yVelocity -= this.knockbackAmount;
        }

        if (projectileList[i].dir == 2) {
          this.xVelocity -= this.knockbackAmount;
          //this.yVelocity -= this.knockbackAmount;
        }
      }
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    Player Class
function player(tempXpos, tempYpos, tempDir, tempUUID, tempLives, tempAttacking, tempUsername, tempClass, tempAttackType) {
  this.xpos = tempXpos;
  this.ypos = tempYpos;
  this.UUID = tempUUID;
  this.lives = tempLives;
  this.attacking = tempAttacking;
  this.username = tempUsername;
  this.class = tempClass;
  this.attackType = tempAttackType;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Projectile Class
function projectile(tempXpos, tempYpos, tempSize, tempDir, tempUUID, tempServerXpos, tempUserUUID, tempLifeSpan, tempType) {
  this.UUID = tempUUID;
  this.userUUID = tempUserUUID;

  this.xpos = tempXpos;
  this.ypos = tempYpos;
  this.size = tempSize;
  this.dir = tempDir;
  this.lifeSpan = tempLifeSpan;
  this.serverXpos = tempServerXpos;
  this.type = tempType;

  if (this.type == 2) {
    this.accelerationRate = 4;
    this.decelerationRate = 0.5;
    this.xVelocity = 0;
    this.xAcceleration = 0;
    this.terminalXVelocity = 2 / tickRateDiff;
    this.yVelocity = 0;
    this.yAcceleration = 0;
    this.terminalYVelocity = 32 / tickRateDiff;
  }

  if (this.type == 4) {
    if (this.dir == 1) {
      this.accelerationRate = 0;
      this.decelerationRate = 0.5;
      this.xVelocity = 0;
      this.xAcceleration = 0;
      this.terminalXVelocity = 6 / tickRateDiff;
      this.yVelocity = 0;
      this.yAcceleration = 1;
      this.terminalYVelocity = 16 / tickRateDiff;
      this.lifeSpan = 70 / tickRateDiff;
    } else if (Math.floor(this.dir) == 2) {
      this.accelerationRate = 0;
      this.decelerationRate = 0.5;
      this.terminalXVelocity = 15 / tickRateDiff;
      this.yVelocity = 0;
      this.yAcceleration = 0;
      this.terminalYVelocity = 12 / tickRateDiff;
      this.lifeSpan = 25 / tickRateDiff;

      if (this.dir == 2.1) {
        this.xVelocity = 15 / tickRateDiff;
        this.xAcceleration = 3;
      } else if (this.dir == 2.2) {
        this.xVelocity = -15 / tickRateDiff;
        this.xAcceleration = -3;
      }
    }
  }

  if (this.type == 6) {
    this.accelerationRate = 4;
    this.decelerationRate = 0.5;
    this.xVelocity = 0;
    this.xAcceleration = 0;
    this.terminalXVelocity = 16 / tickRateDiff;
    this.yVelocity = 0;
    this.yAcceleration = 0;
    this.terminalYVelocity = 32 / tickRateDiff;
  }

  if (this.type == 7) {
    this.accelerationRate = 4;
    this.decelerationRate = 0.5;
    this.xVelocity = 0;
    this.xAcceleration = 0;
    this.terminalXVelocity = 8;
    this.yVelocity = 0;
    this.yAcceleration = 0;
    this.terminalYVelocity = 32;
    this.lifeSpan = 30;
  }

  this.collisionMultiplier = 0.9;
  this.update = function () {
    this.lifeSpan--;
    this.updatePosition();
    if (this.lifeSpan < 0) {
      this.ypos = screenHeight * 2;
    }
  }

  this.updatePosition = function () {
    if (this.yVelocity < this.terminalYVelocity && this.yVelocity > -this.terminalYVelocity) {
      this.yVelocity += this.yAcceleration;
    }

    this.ypos += this.yVelocity;

    if (this.dir == 1) {
      this.xAcceleration = this.accelerationRate;
    }
    if (this.dir == 2) {
      this.xAcceleration = -this.accelerationRate;
    }

    if (this.xVelocity < this.terminalXVelocity && this.xVelocity > -this.terminalXVelocity) {
      this.xVelocity += this.xAcceleration;
    }
    this.xpos += this.xVelocity;
    this.serverXpos = this.xpos;

    if (this.xVelocity < 0) {
      this.xVelocity += this.decelerationRate
    }
    if (this.xVelocity > 0) {
      this.xVelocity -= this.decelerationRate
    }
  }
}

