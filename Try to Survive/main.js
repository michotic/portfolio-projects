(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

window.addEventListener("load", function () {
    setup();
    update();
});

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 960,
    height = 600,
    player = new playerObject(width / 2, height / 2),
    keys = [],
    foodList = [],
    score = 0,
    enemyList = [],
    highscore = 0;

canvas.width = width;
canvas.height = height;

//Called on start.
function setup() {
    for (var i = 0; i < 2; i++) {
        var x = Math.floor(Math.random() * canvas.width);
        var y = Math.floor(Math.random() * canvas.height);
        foodList.push(new foodObject(x, y));
    }
    createNewEnemy();
}

function resetGame(tempScore) {
    if (tempScore > highscore) {
        highscore = tempScore;
    }
    this.score = 0;
    this.enemyList = [];
    this.foodList = [];

    for (var i = 0; i < 2; i++) {
        var x = Math.floor(Math.random() * canvas.width);
        var y = Math.floor(Math.random() * canvas.height);
        foodList.push(new foodObject(x, y));
    }
    createNewEnemy();
}

//Creates new enemy.
function createNewEnemy() {
    var x = Math.floor(Math.random() * canvas.width);
    var y = Math.floor(Math.random() * canvas.height);
    enemyList.push(new enemyObject(x, y, enemyList.length));
}

//Update loop.
function update() {
    //Clears previous frame.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Checks key states.
    checkKeys();

    //Updates & draws food.
    for (var i = 0; i < foodList.length; i++) {
        foodList[i].update();
    }

    //Updates & draws enemies.
    for (var i = 0; i < enemyList.length; i++) {
        enemyList[i].update();
    }

    //Updates & draws player.
    player.update();

    //Draws score.
    var scoreString = "Score: " + score;
    var highScoreString = "High Score: " + highscore;
    ctx.font = "30px Helvetica Neue";
    ctx.textAlign = "right";
    ctx.fillText(scoreString, canvas.width - 50, 50);
    ctx.strokeStyle = "white";
    ctx.strokeText(scoreString, canvas.width - 50, 50);
    ctx.fillText(highScoreString, canvas.width - 50, 100);
    ctx.strokeStyle = "white";
    ctx.strokeText(highScoreString, canvas.width - 50, 100);

    //Adds new enemies depending on score.
    if (score / 10 > enemyList.length) {
        createNewEnemy();
    }

    //Repeats loop.
    requestAnimationFrame(update);
}

//Key events.
function checkKeys() {
    //W key.
    if (keys[87] || keys[38]) {
        player.yVelocity--;
    }
    //A key.
    if (keys[65] || keys[37]) {
        player.xVelocity--;
    }
    //S key.
    if (keys[83] || keys[40]) {
        player.yVelocity++;
    }
    //D key.
    if (keys[68] || keys[39]) {
        player.xVelocity++;
    }
}

//Draws rectangles at specified angles.
function drawRotatedRectangle(fillColor, x, y, width, height, deg) {
    //Convert degrees to radian.
    var rad = deg * Math.PI / 180;

    //Set the origin to the center of the image.
    ctx.translate(x + width / 2, y + height / 2);

    //Rotate the canvas around the origin.
    ctx.rotate(rad);

    //Draw the rectangle.    
    ctx.fillStyle = fillColor;
    ctx.fillRect(width / 2 * (-1), height / 2 * (-1), width, height);

    //ctx.drawImage(img,width / 2 * (-1),height / 2 * (-1),width,height);

    //Reset the canvas.
    ctx.rotate(rad * (-1));
    ctx.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
}

//Detects if two positions are overlapping
function checkCollision(x1, y1, x2, y2, collisionRange) {
    var colliding = false;
    var objectDistance = distance(x1, y1, x2, y2);
    if (objectDistance < collisionRange) { colliding = true; }
    return colliding;
}

//Function that calculates the distance between two given points.
function distance(x1, y1, x2, y2) {
    var dist = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    return dist;
}

//Player class.
function playerObject(tempX, tempY) {
    this.width = 32;
    this.height = 32;
    this.xPosition = tempX;
    this.yPosition = tempY;
    this.xVelocity = 0;
    this.yVelocity = 0;

    //Players update loop.
    this.update = function () {
        this.updatePosition();
        this.updateHitBox();
        this.drawnXPosition = this.xPosition - (this.width / 2);
        this.drawnYPosition = this.yPosition - (this.height / 2);

        ctx.fillStyle = "white";
        ctx.fillRect(this.drawnXPosition, this.drawnYPosition, this.width, this.height);
    }

    this.updatePosition = function () {
        //Updates players position based off of velocity.
        this.xPosition += this.xVelocity;
        this.yPosition += this.yVelocity;

        //Keeps player on screen.
        if (this.xPosition < 0) { this.xPosition = 0; }
        if (this.xPosition > canvas.width) { this.xPosition = canvas.width; }
        if (this.yPosition < 0) { this.yPosition = 0; }
        if (this.yPosition > canvas.height) { this.yPosition = canvas.height; }

        //Causes player to decelerate rather than abruptly stop.
        this.xVelocity *= 0.8;
        this.yVelocity *= 0.8;
    }

    this.updateHitBox = function () {
        this.hitBox = {
            top: this.drawnYPosition - (height / 2),
            left: this.drawnYPosition - (width / 2),
            bottom: this.drawnYPosition + (width / 2),
            right: this.drawnXPosition + (width / 2)
        };
    }

    this.resetPosition = function () {
        this.xPosition = canvas.width / 2;
        this.yPosition = canvas.height / 2;
    }
}

//Food class.
function foodObject(tempX, tempY) {
    this.width = 16;
    this.height = 16;
    this.xPosition = tempX;
    this.yPosition = tempY;
    this.angle = 0;
    this.rotationSpeed = 5;

    //Food update loop.
    this.update = function () {
        this.updateHitBox();
        this.drawnXPosition = this.xPosition - (this.width / 2);
        this.drawnYPosition = this.yPosition - (this.height / 2);

        if (this.angle < 360) {
            this.angle += this.rotationSpeed;;
        } else {
            this.angle = 0;
        }

        drawRotatedRectangle("rgb(9, 201, 82)", this.drawnXPosition, this.drawnYPosition, this.width, this.height, this.angle);
        if (checkCollision(this.xPosition, this.yPosition, player.xPosition, player.yPosition, player.width)) {
            score++;
            this.resetPosition();
        }
    }

    this.updateHitBox = function () {
        this.hitBox = {
            top: this.drawnYPosition - (height / 2),
            left: this.drawnYPosition - (width / 2),
            bottom: this.drawnYPosition + (width / 2),
            right: this.drawnXPosition + (width / 2)
        };
    }

    this.resetPosition = function () {
        var x = Math.floor(Math.random() * canvas.width);
        var y = Math.floor(Math.random() * canvas.height);
        this.xPosition = x;
        this.yPosition = y;
    }
}

//Enemy class.
function enemyObject(tempX, tempY, index) {
    this.width = 24;
    this.height = 24;
    this.xPosition = tempX;
    this.yPosition = tempY;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.angle = 0;
    this.rotationSpeed = 2;
    this.id = index;

    //Enemy update loop.
    this.update = function () {
        this.updatePosition();
        this.chasePlayer();
        this.avoidOtherEnemies();
        this.updateHitBox();
        this.drawnXPosition = this.xPosition - (this.width / 2);
        this.drawnYPosition = this.yPosition - (this.height / 2);

        if (this.angle < 360) {
            this.angle += this.rotationSpeed;;
        } else {
            this.angle = 0;
        }

        drawRotatedRectangle("rgb(245, 100, 16)", this.drawnXPosition, this.drawnYPosition, this.width, this.height, this.angle);
        drawRotatedRectangle("rgb(245, 100, 16)", this.drawnXPosition, this.drawnYPosition, this.width, this.height, this.angle + 45);

        if (checkCollision(this.xPosition, this.yPosition, player.xPosition, player.yPosition, this.width)) {
            resetGame(score);
            player.resetPosition();
        }
    }

    this.updatePosition = function () {
        //Updates players position based off of velocity.
        this.xPosition += this.xVelocity;
        this.yPosition += this.yVelocity;

        //Keeps player on screen.
        if (this.xPosition < 0) { this.xPosition = 0; }
        if (this.xPosition > canvas.width) { this.xPosition = canvas.width; }
        if (this.yPosition < 0) { this.yPosition = 0; }
        if (this.yPosition > canvas.height) { this.yPosition = canvas.height; }

        //Causes player to decelerate rather than abruptly stop.
        this.xVelocity *= 0.8;
        this.yVelocity *= 0.8;
    }

    this.updateHitBox = function () {
        this.hitBox = {
            top: this.drawnYPosition - (height / 2),
            left: this.drawnYPosition - (width / 2),
            bottom: this.drawnYPosition + (width / 2),
            right: this.drawnXPosition + (width / 2)
        };
    }

    this.resetPosition = function () {
        var x = Math.floor(Math.random() * canvas.width);
        var y = Math.floor(Math.random() * canvas.height);
        this.xPosition = x;
        this.yPosition = y;
    }

    this.chasePlayer = function () {
        var speed = Math.random() + 0.25;
        if (this.xPosition > player.xPosition) { this.xVelocity -= speed; }
        if (this.xPosition < player.xPosition) { this.xVelocity += speed; }
        if (this.yPosition > player.yPosition) { this.yVelocity -= speed; }
        if (this.yPosition < player.yPosition) { this.yVelocity += speed; }
    }

    this.avoidOtherEnemies = function () {
        for (var i = 0; i < enemyList.length; i++) {
            if (enemyList[i].id != this.id) {
                var enemyPos = {
                    x: enemyList[i].xPosition,
                    y: enemyList[i].yPosition
                };
                if (distance(this.xPosition, this.yPosition, enemyPos.x, enemyPos.y) < this.width) {
                    if (this.xPosition > enemyPos.x) { this.xVelocity++; }
                    if (this.xPosition < enemyPos.x) { this.xVelocity--; }
                    if (this.yPosition > enemyPos.y) { this.yVelocity++; }
                    if (this.yPosition < enemyPos.y) { this.yVelocity--; }
                }
            }
        }
    }
}