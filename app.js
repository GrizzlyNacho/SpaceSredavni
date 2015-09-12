/*********************************************************
 * Constants
 *********************************************************/
var spriteSize = 32;
var sideSpeed = 5;
var launchSpeed = 10;

var hitThreshold = spriteSize / 3;
var edgeBuffer = 0.99;

var screenWidth = 800;
var screenHeight = 500;

var fleetSize = 24;
var fleetSpeed = 1.5;
var fleetAscendTicks = 0;

var shipSprite = "0000070000700000000075000057000000075000000570000075000000005700075000000000057075000000000000577500000000000057075000055000057000750055550057000777775335777770777555555555577775553357753355577775335775335777077555577555577000077555555770000000007557000000";

var GameStates = {
	READY: 0,
	PROGRESS: 1,
	WIN: 2,
	LOSS: 3
};


/*********************************************************
 * Game Vars
 *********************************************************/
// Ship
var shipStartX = screenWidth / 2 - spriteSize / 2;
var shipStartY = screenHeight - screenHeight / 10;
var shipX = shipStartX;
var shipY = shipStartY;
var moveDirection = 0;
var isShooting = false;

// Fleet
var arrFleet = [];
for(var i = 0; i < fleetSize; i++) {
	arrFleet[i] = {
		x: (i % 8)*2*spriteSize + 160,
		y: Math.floor(i/8)*2*spriteSize + 250,
		active: 0,
		colour: 230
	};
}
var fleetDirX = 1;

// Core game
var currentGameState = GameStates.READY;


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

	// Accomodates the "Any key to start"
	if (currentGameState === GameStates.READY) {
		currentGameState = GameStates.PROGRESS;
		return;
	}

	// Refuse all input if the game is over
	if (currentGameState !== GameStates.PROGRESS) {
		return;
	}

	// Handle Pause
	if (keyCode == 80) {
		currentGameState = GameStates.READY;
	}

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
 * Update the ship and fleet positions
 */
function updateMovement() {
	// Ship Movement
	if (isShooting) {
		shipY -= launchSpeed;
	}
	shipX += moveDirection * sideSpeed;

	// Ship off screen
	if (shipY <= -spriteSize) {
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
			if (!fleetShip.active && (fleetShip.x + spriteSize > screenWidth*edgeBuffer
				|| fleetShip.x < screenWidth*(1-edgeBuffer))) {
				wallHit = 1;
			}
		}
		if(wallHit) {
			fleetDirX *= -1;
			fleetAscendTicks = spriteSize / fleetSpeed;
		}
	}
}

/**
 * Check on hit detection of the player ship to fleet positions
 * as well as the win and loss scenarios.
 */
function hitDetectionAndEndGame() {
	// Fleet Hit Detection and End Game condition
	var allActivated = true;
	for(var i = 0; i < fleetSize; i++) {
		var fleetShip = arrFleet[i];
		if (Math.abs(shipX - fleetShip.x) < hitThreshold
			&& Math.abs(shipY - fleetShip.y < hitThreshold
			&& !fleetShip.active)) {
			fleetShip.active = 1;
			resetShip();
		}
		if (fleetShip.y < 0 && !fleetShip.active) {
			currentGameState = GameStates.LOSS;
		}
		allActivated &= fleetShip.active;
	}
	if (allActivated) {
		currentGameState = GameStates.WIN;
	}
}

/**
 * Main Game Loop
 */
function mainLoop() {
	if (currentGameState === GameStates.PROGRESS) {
		updateMovement();
		hitDetectionAndEndGame();
	}

	draw();
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


/*********************************************************
 * Game Functions
 *********************************************************/

/**
 * Draw the whole scene
 */
function draw() {
	drawMap();

	// Draw the fleet
	for (var i = 0; i < fleetSize; i++) {
		if (arrFleet[i].active) {
			drawSprite(shipSprite, arrFleet[i].x, arrFleet[i].y, 120, 1);
		} else {
			drawSprite(shipSprite, arrFleet[i].x, arrFleet[i].y, 230, 0.3);
		}
		
	}

	// Draw the player
	drawSprite(shipSprite, shipX,shipY, 130, 1);

	switch(currentGameState) {
		case GameStates.READY:
			drawReadyState();
			break;
		case GameStates.WIN:
			break;
		case GameStates.LOSS:
			break;
	}
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

/**
 * Helper to render White text with a black stroke
 * @param {String} text
 * @param {int} x
 * @param {int} y
 */
function drawStrokedText(text, x, y) {
	ctx.font = "28px Courier New";
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 4;
	ctx.strokeText(text, x, y);
	ctx.fillStyle = 'white';
	ctx.fillText(text, x, y);
}

/**
 * Draw the game map.
 */
function drawMap() {
	setFill("#111111")
	drawRect(0,0,screenWidth,screenHeight);

	setFill("#003300");
	drawRect(0,screenHeight - 10,screenWidth, 10);
}

/**
 * Draw the "Ready" state
 */
function drawReadyState() {
	drawStrokedText("Assemble the fleet",50,50);
	drawStrokedText("Earth must be DESTROYED!", 50, 100);

	drawStrokedText("P to Pause", screenWidth - 200, 25);

	drawStrokedText("W", shipX + 7, shipY - 35);
	drawStrokedText("^", shipX + 7, shipY);
	drawStrokedText("A <", shipX - 60, shipY + 25);
	drawStrokedText("> D", shipX + 40, shipY + 25);
}

/**
 * Reset the Ship position
 */
function resetShip() {
	isShooting = false;
	shipY = shipStartY;
}