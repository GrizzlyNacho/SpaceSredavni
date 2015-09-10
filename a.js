/*********************************************************
 * Constants
 *********************************************************/
var spriteSize = 32;
var sideSpeed = 5;

var screenWidth = 800;
var screenHeight = 500;


/*********************************************************
 * Core functionality
 *********************************************************/
/*
 * Our entry point. Everything is prepared.
 */
window.onload = function() {
	canvas = document.getElementById("main");
	ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;

	setInterval(mainLoop, 16);
}

/**
 * Keyboard Detection
 */
window.onkeypress = function(evt) {
	evt = evt || window.event;
	switch(evt.keyCode) {
		case 65:
		case 97:
			shipX -= sideSpeed;
			break;
		case 87:
		case 119:
			console.log("go up");
			break;
		case 68:
		case 100:
			shipX += sideSpeed;
			break;
	}
}

/**
 * Main Game Loop
 */
function mainLoop() {

	draw();
}

/*********************************************************
 * Game Vars
 *********************************************************/
var shipX = screenWidth / 2 - spriteSize / 2;
var shipY = screenHeight - screenHeight / 10;
var isShooting = false;

var arrFleet = [];
for(var i = 0; i < 15; i++) {
	arrFleet[i] = {x: (i % 5) * 50, y: Math.floor(i / 5) * 100};
}


/*********************************************************
 * Minification helpers
 *********************************************************/
function setFill(fill) {
	ctx.fillStyle = fill;
}
function drawRect (x1, y1, x2, y2) {
	ctx.fillRect(x1,y1,x2,y2);
}

/**
 * Draw the whole screen
 */
function draw() {
	setFill("gray")
	drawRect(0,0,screenWidth,screenHeight);

	setFill("blue");
	drawRect(0,screenHeight - 10,screenWidth, 10);

	drawSprite("0000000BB00000000000000BB0000000000000BBBB000000000000BBBB000000000000BBBB000000000000BBBB00000000000BBBBBB000000B000BBWWBB000B0CBB00BBWWBB00BBCCBB00BBWWBB00BBCCBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBCCBB000BBBB000BBC0B00000CC00000B00000000000000000",
		shipX,shipY);

	for (var i = 0; i < 15; i++) {
		drawSprite("0000000BB00000000000000BB0000000000000BBBB000000000000BBBB000000000000BBBB000000000000BBBB00000000000BBBBBB000000B000BBWWBB000B0CBB00BBWWBB00BBCCBB00BBWWBB00BBCCBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBCCBB000BBBB000BBC0B00000CC00000B00000000000000000",
			arrFleet[i].x, arrFleet[i].y);
	}
}

/*
0000000BB0000000
0000000BB0000000
000000BBBB000000
000000BBBB000000
000000BBBB000000
000000BBBB000000
00000BBBBBB00000
0B000BBWWBB000B0
CBB00BBWWBB00BBC
CBB00BBWWBB00BBC
CBBBBBBBBBBBBBBC
CBBBBBBBBBBBBBBC
CBB000BBBB000BBC
0B00000CC00000B0
0000000000000000
*/

/**
 * Draw a particular sprite
 * @param {String} mapString the legend for the sprite
 * @param {int} x
 * @param {int} y
 */
function drawSprite(mapString, x, y) {
	for(var i = 0; i < mapString.length; i++) {
		switch (mapString.charAt(i)) {
			case "B":
				setFill("blue");
				break;
			case "W":
				setFill("white");
				break;
			case "C":
				setFill("cyan");
				break;
			default:
				continue;
				break;
		}
		
		var pixSize = 2;
		var targetX = x + (i % 16) * pixSize;
		var targetY = y + Math.floor(i / 16) * pixSize;

		drawRect(targetX, targetY, pixSize, pixSize);
	}
}