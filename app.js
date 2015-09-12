/*********************************************************
 * Constants
 *********************************************************/
var spriteSize = 32;
var sideSpeed = 5;
var launchSpeed = 10;

var screenWidth = 800;
var screenHeight = 500;

var hitThreshold = spriteSize / 3;
var edgeBuffer = 0.99;

var shipSprite = "0000070000700000000075000057000000075000000570000075000000005700075000000000057075000000000000577500000000000057075000055000057000750055550057000777775335777770777555555555577775553357753355577775335775335777077555577555577000077555555770000000007557000000";

var shipStartX = screenWidth / 2 - spriteSize / 2;
var shipStartY = screenHeight - screenHeight / 13;
var fleetOriginX = 160;
var fleetOriginY = 250;
var fleetSize = 24;
var fleetSpeed = 1.5;

var GameStates = {
	READY: 0,
	PROGRESS: 1,
	WIN: 2,
	LOSS: 3
};

var arrStarColours = [
	"#9db4ff", "#a2b9ff", "#a7bcff", "#aabfff", "#afc3ff", "#baccff", "#c0d1ff",
	"#cad8ff", "#e4e8ff", "#edeeff", "#fbf8ff", "#fff9f9", "#fff5ec", "#fff4e8",
	"#fff1df", "#ffebd1", "#ffd7ae", "#ffc690", "#ffbe7f", "#ffbb7b"
];
var arrShipColours = [];
for (var i = 80; i <= 130; i += 10) {
	arrShipColours.push(i);
}


/*********************************************************
 * Game Vars
 *********************************************************/
// Ship
var shipX = 0;
var shipY = 0;
var moveDirection = 0;
var isShooting = false;
var shipColour = 130;

// Fleet
var arrFleet = [];
var fleetDirX = 0;
var fleetAscendTicks = 0;

// Core game
var currentGameState = GameStates.READY;

var arrStars = [];
for(var i = 0; i < 500; i++) {
	arrStars[i] = {
		x: ~~(Math.random() * screenWidth),
		y: ~~(Math.random() * screenHeight),
		size: ~~(Math.random() * 2) + 1,
		colour: arrStarColours[~~(Math.random() * arrStarColours.length)]
	};
}

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

	resetGame();
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

	// Start a new game
	if (keyCode == 82 &&
		(currentGameState === GameStates.WIN || currentGameState === GameStates.LOSS)) {
		
		resetGame();
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

	// Firing the ship (W)
	if (keyCode == 87 || keyCode == 119) {
		isShooting = true;
		moveDirection = 0;
	}

	// Steering (A and D)
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
	switch(currentGameState) {
		case GameStates.PROGRESS:
			updateGameMovement();
			hitDetectionAndEndGame();
			break;
		case GameStates.WIN:
			updateVictoryMovement();
			break;
		case GameStates.LOSS:
			updateLossMovement();
			break;
	}

	draw();
}

/**
 * Do the loss Dance
 */
function updateLossMovement() {
	var fleetDirY = 0;

	if (Math.abs(arrFleet[0].x - fleetOriginX) < 2*fleetSpeed 
		&& Math.abs(arrFleet[0].y - fleetOriginY) < 2*fleetSpeed) {
		return;
	}

	// Line up with center and then fly out the top
	if (Math.abs(arrFleet[0].x - fleetOriginX) < 2*fleetSpeed) {
		fleetDirY = 1;
		fleetDirX = 0;
	} else if (arrFleet[0].x > fleetOriginX) {
		fleetDirX = -1;
	} else {
		fleetDirX = 1;
	}

	for (var i = 0; i < fleetSize; i++) {
		arrFleet[i].x += fleetSpeed*fleetDirX;
		arrFleet[i].y += fleetSpeed*fleetDirY;
	}
}

/**
 * Do the victory 'dance'
 */
function updateVictoryMovement() {
	var fleetDirY = 0;

	// Line up with center and then fly out the top
	if (Math.abs(arrFleet[0].x - fleetOriginX) < 2*fleetSpeed) {
		fleetDirY = -1;
		fleetDirX = 0;
	} else if (arrFleet[0].x > fleetOriginX) {
		fleetDirX = -1;
	} else {
		fleetDirX = 1;
	}

	for (var i = 0; i < fleetSize; i++) {
		arrFleet[i].x += fleetSpeed*fleetDirX;
		arrFleet[i].y += fleetSpeed*fleetDirY;
	}
}

/**
 * Update the ship and fleet positions
 */
function updateGameMovement() {
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
			fleetShip.colour = shipColour;
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
 * Reset the Ship Y position
 */
function resetShip() {
	isShooting = false;
	shipY = shipStartY;
	moveDirection = 0;
	shipColour = arrShipColours[~~(Math.random() * arrShipColours.length)];
}

/**
 * Reset the whole game
 */
function resetGame() {
	currentGameState = GameStates.READY;

	shipX = shipStartX;
	resetShip();

	fleetDirX = 1;
	fleetAscendTicks = 0;
	for(var i = 0; i < fleetSize; i++) {
		arrFleet[i] = {
			x: (i % 8)*2*spriteSize + fleetOriginX,
			y: Math.floor(i/8)*2*spriteSize + fleetOriginY,
			active: 0,
			colour: 0
		};
	}
}


/*********************************************************
 * Draw Functions
 *********************************************************/

/**
 * Draw the whole scene
 */
function draw() {
	drawMap();

	// Draw the fleet
	for (var i = 0; i < fleetSize; i++) {
		if (arrFleet[i].active) {
			drawSprite(shipSprite, arrFleet[i].x, arrFleet[i].y, arrFleet[i].colour);
		} else {
			var ghost = true;
			var colourHue = 230;
			if (currentGameState == GameStates.LOSS) {
				ghost = false;
				colourHue = 0; // Red
			}
			drawSprite(shipSprite, arrFleet[i].x, arrFleet[i].y, colourHue, ghost);
		}
	}

	// Draw the player
	drawSprite(shipSprite, shipX,shipY, shipColour);

	switch(currentGameState) {
		case GameStates.READY:
			drawReadyState();
			return;
		case GameStates.WIN:
			drawWinState();
			return;
		case GameStates.LOSS:
			drawLossState();
			return;
	}

	drawStrokedText("P: Pause", screenWidth - 150, 25);
}

/**
 * Draw a particular sprite
 * @param {String} mapString the legend for the sprite
 * @param {int} x
 * @param {int} y
 * @param {int} hue
 * @param {Boolean} ghost - Show a greyed out ghost instead
 */
function drawSprite(mapString, x, y, hue, ghost) {
	if (ghost == undefined) {
		ghost = false;
	}

	for(var i = 0; i < mapString.length; i++) {
		var currentVal = parseInt(mapString.charAt(i));
		if (!currentVal) {
			continue;
		}

		var level = (1-(currentVal / 9));
		if (!ghost) {
			setFill("hsla("+hue+",80%,"+level*100+"%,1)");
		} else {
			setFill("hsla("+hue+",10%,"+level*100+"%,0.3)");
		}

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
	ctx.font = "28px Lucida Console";
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
	
	// Space
	setFill("#111111")
	drawRect(0,0,screenWidth,screenHeight);

	// Stars
	for(var i = 0; i < arrStars.length; i++) {
		var star = arrStars[i];
		setFill(star.colour);
		drawRect(star.x, star.y, star.size, star.size);
	}

}

/**
 * Draw the "Ready" state
 */
function drawReadyState() {
	drawStrokedText("W: LAUNCH", shipX - 60, shipY - 10);
	drawStrokedText("A <", shipX - 60, shipY + 25);
	drawStrokedText("> D", shipX + 40, shipY + 25);

	setFill("white");
	var fleetStartX = arrFleet[0].x;
	var fleetStartY = arrFleet[0].y;
	var fleetEndX = arrFleet[fleetSize - 1].x + spriteSize;
	var fleetEndY = arrFleet[fleetSize - 1].y + spriteSize;
	drawRect(fleetStartX-5, fleetStartY-5, 5*spriteSize, 1);
	drawRect(fleetStartX-5, fleetStartY-5, 1, 3*spriteSize);
	drawRect(fleetEndX+5 - 5*spriteSize, fleetEndY+5, 5*spriteSize, 1);
	drawRect(fleetEndX+5, fleetEndY+5 - 3*spriteSize, 1, 3*spriteSize);
	drawStrokedText(
		"Assemble the fleet",
		(fleetEndX + fleetStartX)/2 - 150,
		(fleetEndY + fleetStartY)/2 + 7
	);

	if (fleetStartY > 50) {
		drawStrokedText("Earth must be DESTROYED!", 
			screenWidth / 2 - 200, 50
		);
	}
}

/**
 * Draw the game over screen details
 */
function drawLossState() {
	drawStrokedText("GAME OVER", 
		screenWidth / 2 - 75, 100
	);
	drawStrokedText("The fleet was not prepared", 
		screenWidth / 2 - 220, 150
	);

	drawStrokedText("R: Restart", 
		screenWidth / 2 - 80, 200
	);
}

/**
 * Draw the Victory screen details
 */
function drawWinState() {
	drawStrokedText("VICTORY!", 
		screenWidth / 2 - 58, 200
	);
	drawStrokedText("The fleet heads for Earth!", 
		screenWidth / 2 - 200, 250
	);

	drawStrokedText("R: Restart", 
		screenWidth / 2 - 80, 300
	);
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