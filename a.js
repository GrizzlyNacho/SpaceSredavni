/*********************************************************
 * Constants
 *********************************************************/
var spriteSize = 32;
var sideSpeed = 5;
var launchSpeed = 10;

var hitThreshold = spriteSize / 2;

var screenWidth = 800;
var screenHeight = 500;

var fleetSize = 24;
var shipsPerRow = 8;
var fleetSpeed = 2;

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
window.onkeydown = function(evt) {
	evt = evt || window.event;
	var keyCode = evt.keyCode;

	if (keyCode == 87 || keyCode == 119) {
		isShooting = true;
		moveDirection = 0;
	}

	if (!isShooting) {
		if (keyCode == 65 || keyCode == 97) {
			moveDirection = -1;
		}
		if (keyCode == 68 || keyCode == 100) {
			moveDirection = 1;
		}	
	}
}

window.onkeyup = function(evt) {
	evt = evt || window.event;
	var keyCode = evt.keyCode;

	if ((keyCode == 65 || keyCode == 97) && moveDirection == -1) {
		moveDirection = 0;
	}
	if ((keyCode == 68 || keyCode == 100) && moveDirection == 1) {
		moveDirection = 0;
	}


}

/**
 * Main Game Loop
 */
function mainLoop() {
	// Ship Movement
	if (isShooting) {
		shipY -= launchSpeed;
	}
	shipX += moveDirection * sideSpeed;

	// Ship off screen
	if (shipY <= 0) {
		resetShip();
	}

	// Fleet Movement
/*	for(var i = 0; i < fleetSize; i++) {
		arrFleet[i].x += fleetDirX * fleetSpeed;
		arrFleet[i].y += fleetDirY * fleetSpeed;
	}
*/

	// Fleet Hit Detection
	for(var i = 0; i < fleetSize; i++) {
		if (Math.abs(shipX - arrFleet[i].x) < hitThreshold
			&& Math.abs(shipY - arrFleet[i].y < hitThreshold
			&& !arrFleet[i].a)) {
			arrFleet[i].a = 1;
			resetShip();
		}
	}

	draw();
}

/*********************************************************
 * Game Vars
 *********************************************************/
// Ship
var shipX = screenWidth / 2 - spriteSize / 2;
var shipY = screenHeight - screenHeight / 10;
var moveDirection = 0;
var isShooting = false;

// Fleet
var arrFleet = [];
for(var i = 0; i < fleetSize; i++) {
	arrFleet[i] = {
		x: (i % shipsPerRow)*2*spriteSize + 160,
		y: Math.floor(i/shipsPerRow)*2*spriteSize + 250,
		a: 0
	};
}
var fleetDirX = 1;
var fleetDirY = 0;


/*********************************************************
 * Minification helpers
 *********************************************************/
function setFill(fill) {
	// TODO use hsl
	ctx.fillStyle = fill;

}
function drawRect (x1, y1, x2, y2) {
	ctx.fillRect(x1,y1,x2,y2);
}

/*********************************************************
 * Game Functions
 *********************************************************/

/**
 * Draw the whole screen
 */
function draw() {
	setFill("gray")
	drawRect(0,0,screenWidth,screenHeight);

	setFill("blue");
	drawRect(0,screenHeight - 10,screenWidth, 10);

	for (var i = 0; i < fleetSize; i++) {
		if (arrFleet[i].a) {
			drawSprite("0000000BB00000000000000BB0000000000000BBBB000000000000BBBB000000000000BBBB000000000000BBBB00000000000BBBBBB000000B000BBWWBB000B0CBB00BBWWBB00BBCCBB00BBWWBB00BBCCBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBCCBB000BBBB000BBC0B00000CC00000B00000000000000000",
				arrFleet[i].x, arrFleet[i].y);
		} else {
			drawSprite("0000000RR00000000000000RR0000000000000RRRR000000000000RRRR000000000000RRRR000000000000RRRR00000000000RRRRRR000000R000RRWWRR000R0CRR00RRWWRR00RRCCRR00RRWWRR00RRCCRRRRRRRRRRRRRRCCRRRRRRRRRRRRRRCCRR000RRRR000RRC0R00000CC00000R00000000000000000",
				arrFleet[i].x, arrFleet[i].y);
		}
		
	}

	drawSprite("0000000BB00000000000000BB0000000000000BBBB000000000000BBBB000000000000BBBB000000000000BBBB00000000000BBBBBB000000B000BBWWBB000B0CBB00BBWWBB00BBCCBB00BBWWBB00BBCCBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBCCBB000BBBB000BBC0B00000CC00000B00000000000000000",
		shipX,shipY);
	
}

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
			case "R":
				setFill("red");
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

function resetShip() {
	isShooting = false;
	shipY = screenHeight - screenHeight / 10;
}