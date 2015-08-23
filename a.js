// Our entry point. Everything is prepared.
window.onload = function() {
	canvas = document.getElementById("main");
	ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	draw();
}

/*********************************************************
 * Constants
 *********************************************************/
var spriteSize = 32

/*********************************************************
 * Minification helpers
 *********************************************************/
function setFill(fill) {
	ctx.fillStyle = fill;
}
function drawRect (x1, y1, x2, y2) {
	ctx.fillRect(x1,y1,x2,y2);
}


function draw() {
	setFill("red")
	drawRect(0,0,800,500);

	setFill("blue");
	drawRect(0,0,spriteSize, spriteSize);

	drawSprite("0000000BB00000000000000BB0000000000000BBBB000000000000BBBB000000000000BBBB000000000000BBBB00000000000BBBBBB000000B000BBWWBB000B0CBB00BBWWBB00BBCCBB00BBWWBB00BBCCBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBCCBB000BBBB000BBC0B00000CC00000B00000000000000000",
		50,50);
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
 * 
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
		var targetX = x + (i % 16);
		var targetY = y + Math.floor(i / 16);

		drawRect(targetX, targetY, 1, 1);
	}
}