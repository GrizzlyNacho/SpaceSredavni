/*********************************************************
 * Constants
 *********************************************************/
var spriteSize = 32;
var sideSpeed = 5;
var launchSpeed = 10;

var hitThreshold = spriteSize / 2;
var edgeBuffer = 0.99;

var screenWidth = 800;
var screenHeight = 500;

var fleetSize = 24;
var fleetSpeed = 2;
var fleetAscendTicks = 0;

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
	if (fleetAscendTicks > 0) {
		for(var i = 0; i < fleetSize; i++) {
			arrFleet[i].y -= fleetSpeed;
		}
		fleetAscendTicks--;
	} else {
		var wallHit = 0;
		for(var i = 0; i < fleetSize; i++) {
			var fleetShip = arrFleet[i];
			fleetShip.x += fleetDirX * fleetSpeed;
			if (fleetShip.x + spriteSize > screenWidth*edgeBuffer
				|| fleetShip.x < screenWidth*(1-edgeBuffer)) {
				wallHit = 1;
			}
		}
		if(wallHit) {
			fleetDirX *= -1;
			fleetAscendTicks = spriteSize / fleetSpeed;
		}
	}

	// Fleet Hit Detection and End Game condition
	var allActivated = true;
	for(var i = 0; i < fleetSize; i++) {
		var fleetShip = arrFleet[i];
		if (Math.abs(shipX - fleetShip.x) < hitThreshold
			&& Math.abs(shipY - fleetShip.y < hitThreshold
			&& !fleetShip.a)) {
			fleetShip.a = 1;
			resetShip();
		}
		if (fleetShip.y < 0 && !fleetShip.a) {
			console.log("GAME OVER");
		}
		allActivated &= fleetShip.a;
	}
	if (allActivated) {
		console.log("You Win!");
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
		x: (i % 8)*2*spriteSize + 160,
		y: Math.floor(i/8)*2*spriteSize + 250,
		a: 0
	};
}
var fleetDirX = 1;


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
			drawSprite("0000070000700000000075000057000000075000000570000075000000005700075000000000057075000000000000577500000000000057075000055000057000750055550057000777775335777770777555555555577775553357753355577775335775335777077555577555577000077555555770000000007557000000",
				arrFleet[i].x, arrFleet[i].y, 120, 1);
		} else {
			drawSprite("0000070000700000000075000057000000075000000570000075000000005700075000000000057075000000000000577500000000000057075000055000057000750055550057000777775335777770777555555555577775553357753355577775335775335777077555577555577000077555555770000000007557000000",
				arrFleet[i].x, arrFleet[i].y, 200, 1);
		}
		
	}

	drawSprite("0000070000700000000075000057000000075000000570000075000000005700075000000000057075000000000000577500000000000057075000055000057000750055550057000777775335777770777555555555577775553357753355577775335775335777077555577555577000077555555770000000007557000000",
		shipX,shipY, 60, 1);
	
}

/**
 * Draw a particular sprite
 * @param {String} mapString the legend for the sprite
 * @param {int} x
 * @param {int} y
 * @param {int} hue
 * @param {Number} alpha
 */
function drawSprite(mapString, x, y, hue, alpha) {
	for(var i = 0; i < mapString.length; i++) {
		var currentVal = parseInt(mapString.charAt(i));
		if (!currentVal) {
			continue;
		}
		var level = (1-(currentVal / 9)) * 100;
		setFill("hsla("+hue+",50%,"+level+"%,"+alpha+")");
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