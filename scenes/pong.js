define(['commons/vector', 'commons/primitives', 'commons/physics', 'commons/color', 'commons/timeAccumulator'], 
function(Vector, Primitives, Physics, Color, TimeAccumulator){

	function Ball() {

		this.body = new Primitives.Circle();

		this.linearPhysics = new Physics.Linear();
		this.linearPhysics.drag = 0;

		var bottomLimit = -100;
		var upperLimit = 100;
		var leftLimit = -100;
		var rightLimit = 100;

		// empty score callback
		this.scoreCallback = function(playerScored) { }

		this.initialize = function(ballRadius, gameWidth, gameHeight) {
			this.body.radius = ballRadius;
			// set bottom and upper limits
			var halfGameHeight = gameHeight / 2;
			bottomLimit = -halfGameHeight;
			upperLimit = halfGameHeight;
			// set goal limits
			var halfGameWidth = gameWidth / 2;
			leftLimit = -halfGameWidth;
			rightLimit = halfGameWidth;
			this.linearPhysics.enabled = false;
		}

		this.launch = function(toPlayer) {
			// initial speed in random direction
			var startVelocity = new Vector(200, 0);
			var deviation = Math.PI / 4;
			startVelocity.setAngle(Math.randomInRange(-deviation, deviation));

			if (toPlayer == Players.Player1) { // if ball should launch towards player1, rotate initial speed by PI
				var angle = startVelocity.angle();
				angle += Math.PI;
				startVelocity.setAngle(angle);	
			}

			this.linearPhysics.position.set(0, 0);
			this.linearPhysics.velocity = startVelocity;
			this.linearPhysics.enabled = true;
		}

		this.clampToHeight = function(nextPosition) {
			if (nextPosition.y + this.body.radius > upperLimit || nextPosition.y - this.body.radius < bottomLimit)
				return true;
			else
				return false;
		}

		this.checkScore = function(position) {
			if (position.x - this.body.radius > rightLimit)
				this.scoreCallback(Players.Player1);
			else if (position.x + this.body.radius < leftLimit)
				this.scoreCallback(Players.Player2);
		}

		this.update = function(input, time) {
			var currentPosition = this.linearPhysics.position;
			this.linearPhysics.update(time.delta);
			if (this.clampToHeight(this.linearPhysics.position)) {
				this.linearPhysics.position = currentPosition;
				this.linearPhysics.velocity.set(this.linearPhysics.velocity.x, -this.linearPhysics.velocity.y);
			} 
			this.checkScore(this.linearPhysics.position);
		}

		this.draw = function(graphics, camera) {
			graphics.resetTransformToCamera(camera);
			this.body.draw(graphics, this.linearPhysics.position, 0);
		}
	}

	function PaddleUserControl(upKey, downKey) {

		var moveForce = 2000;

		this.getPaddleForce = function(input) {
			var inputForce;
			var keys = input.getKeys();
			if (keys.getKey(upKey).isDown())
				inputForce = -moveForce;
			else if (keys.getKey(downKey).isDown())
				inputForce = moveForce;
			else
				inputForce = 0;
			return inputForce;
		}
	}

	function PaddleComputerControl(ball, computerPaddle) {

		var moveForce = 2000;
		var gain = 20;

		this.getPaddleForce = function(input) {
			var error = ball.linearPhysics.position.y - computerPaddle.linearPhysics.position.y
			var force = gain * error; // simple proportional control for computer paddle
			force = Math.clamp(force, -moveForce, moveForce);
			return force;
		}
	}

	function PaddleFreezeControl() {
		this.getPaddleForce = function(input) {
			return 0;
		}
	}

	function Paddle() {

		this.body = new Primitives.Rectangle();
		var halfHeight = this.body.height / 2;
		var halfWidth = this.body.width / 2;

		this.linearPhysics = new Physics.Linear();
		this.linearPhysics.drag = 5;
		
		var bottomLimit = -100;
		var upperLimit = 100;
		var fixedXposition = 0;

		// empty paddle control object
		this.paddleControl = new PaddleFreezeControl();

		this.initialize = function(paddleWidth, paddleHeight, startXPosition, gameHeight) {
			this.body.width = paddleWidth;
			halfWidth = paddleWidth / 2;
			this.body.height = paddleHeight;
			halfHeight = paddleHeight / 2;
			var gameHalfHeight = gameHeight / 2;
			bottomLimit = -gameHalfHeight;
			upperLimit = gameHalfHeight;
			fixedXposition = startXPosition;
			this.reset();
			this.linearPhysics.enabled = true;
		}

		this.reset = function() {
			this.linearPhysics.stop();
			this.linearPhysics.position.set(fixedXposition, 0);
			this.linearPhysics.enabled = false;
		}

		this.clampToHeight = function() {
			var newPosition = this.linearPhysics.position.y;
			if (this.linearPhysics.position.y + halfHeight > upperLimit) {
				this.linearPhysics.stop();
				this.linearPhysics.position.y = upperLimit - halfHeight;
			} else if (this.linearPhysics.position.y - halfHeight < bottomLimit) {
				this.linearPhysics.stop();
				this.linearPhysics.position.y = bottomLimit + halfHeight;
			}	
		}

		this.update = function(input, time) {	
			var inputForce = this.paddleControl.getPaddleForce(input);

			this.linearPhysics.force.set(0, inputForce);
			this.linearPhysics.update(time.delta);
			this.linearPhysics.position.x = fixedXposition;

			this.clampToHeight();
		}

		this.draw = function(graphics, camera) {
			graphics.resetTransformToCamera(camera);
			this.body.draw(graphics, this.linearPhysics.position, 0);
		}
	}

	function MessageBox() {

		var backgroundColor = new Color();
		backgroundColor.setRGBA(20, 20, 20, 192);

		var fontColor = Color.white();
		var fontSize = 36;

		var message = 'Test message';

		var enabled = false;

		var positionX = 0;
		var positionY = 0;
		var width = 200;
		var height = 100;

		var margin = 40;

		var resize = false;

		this.show = function() {
			enabled = true;
		}

		this.hide = function() {
			enabled = false;
		}

		this.setMessage = function(msg) {
			message = msg;
			resize = false;
		}

		this.setFontSize = function(size) {
			fontSize = size;
			resize = false;
		}

		this.setPosition = function(x, y) {
			positionX = x;
			positionY = y;
		}

		this.draw = function(graphics) {
			if (enabled) {
				// check message box sizes only once per show
				if (!resize) {
					width = graphics.text.measureText(message, fontSize) + margin;
					height = fontSize + margin;
					resize = true;
				}
				// draw background
				graphics.resetTransform();
				graphics.drawing.drawRectangle(positionX, positionY, width, height, backgroundColor.toText());
				// draw text
				graphics.text.setTextAlignment('center', 'middle');
				graphics.text.setText(message, positionX, positionY, fontSize, fontColor.toText());
			}
		}
	}

	function ScoreBoard() {

		var player1Score = 0;
		var player2Score = 0;

		var fontColor = Color.white();
		var fontSize = 36;

		var topMargin = fontSize;
		var horizontalMargin = 1.2 * fontSize;

		var centerX = 0;

		this.setScore= function(player1, player2) {
			player1Score = player1;
			player2Score = player2;
		}

		this.initialize = function(gameWidth) {
			centerX = gameWidth / 2;
		}

		this.draw = function(graphics) {
			graphics.resetTransform();
			// draw title
			graphics.text.setTextAlignment('center', 'middle');
			graphics.text.setText("Score", centerX, topMargin, fontSize, fontColor.toText());
			// draw left player score
			graphics.text.setTextAlignment('right', 'top');
			graphics.text.setText(player1Score, centerX - horizontalMargin, fontSize + topMargin, fontSize, fontColor.toText());
			// draw right player score
			graphics.text.setTextAlignment('left', 'top');
			graphics.text.setText(player2Score, centerX + horizontalMargin, fontSize + topMargin, fontSize, fontColor.toText());
		}
	}

	function TimeBoard() {

		var fontColor = Color.white();
		var fontSize = 24;

		var bottomMargin = 20;

		var positionX = 0;
		var positionY = 0;

		var timeAccumulator = new TimeAccumulator();

		this.initialize = function(gameWidth, gameHeight) {
			positionX = gameWidth / 2;
			positionY = gameHeight - bottomMargin;
		}

		this.update = function(timeDelta) {
			timeAccumulator.add(timeDelta);
		}

		this.draw = function(graphics) {
			graphics.resetTransform();
			graphics.text.setTextAlignment('center', 'bottom');
			graphics.text.setText(secondsToTime(timeAccumulator.getTime()), positionX, positionY, fontSize, fontColor.toText());
		}
	}

	function Board() {

		var boardColor = new Color();
		boardColor.setRGBA(30, 30, 30, 255);

		var lineColor = Color.white();
		var goalLineWidth = 2;
		var goalLineMargin = 5;
		
		var radius = 100;
		var centerX = 0;
		var centerY = 0;
		var width = 200;
		var height = 100;

		this.drawDashedCircle = function(graphics, circleCenterX, circleCenterY, radius) {
			var chunks = 200;
			var chunksAngle = 2 * Math.PI / chunks; 
			for (let i = 0; i < chunks;i += 2) {
				var angleStart = chunksAngle * i;
				var angleEnd = chunksAngle * (i + 1);
				var chunkStartX = circleCenterX + radius * Math.cos(angleStart);
				var chunkStartY = circleCenterY + radius * Math.sin(angleStart);
				var chunkEndX = circleCenterX + radius * Math.cos(angleEnd);
				var chunkEndY = circleCenterY + radius * Math.sin(angleEnd);
				graphics.drawing.drawLine(chunkStartX, chunkStartY, chunkEndX, chunkEndY, 2, lineColor.toText());
			}
		}

		this.initialize = function(gameWidth, gameHeight) {
			centerX = gameWidth / 2;
			centerY = gameHeight / 2;
			radius = gameHeight / 4;
			width = gameWidth;
			height = gameHeight;
		}

		this.draw = function(graphics) {
			// clear board
			graphics.resetTransform();
			graphics.clear(boardColor.toText());
			// draw center dot
			graphics.drawing.drawCircle(centerX, centerY, 5, lineColor.toText());
			// draw center line
			graphics.drawing.drawLine(centerX, 0, centerX, height, 3, lineColor.toText(), [5, 5]);
			// draw dashed circle in the centre
			this.drawDashedCircle(graphics, centerX, centerY, radius);
			// draw goal lines
			graphics.drawing.drawLine(goalLineMargin, 0, goalLineMargin, height, goalLineWidth, lineColor.toText());
			graphics.drawing.drawLine(width - goalLineMargin, 0, width - goalLineMargin, height, goalLineWidth, lineColor.toText());
		}
	}

	// Players enum
	var Players = Object.freeze(
		{ Player1 : 1, Player2 : 2 }
	);

	function Scene() {

		var player1Score = 0;
		var player2Score = 0;

		// create all game objects with default values
		var board = new Board();
		var scoreBoard = new ScoreBoard();
		var timeBoard = new TimeBoard();

		var ball = new Ball();
		var leftPaddle = new Paddle();
		var rightPaddle = new Paddle();

		var primaryMessageBox = new MessageBox();
		var secondaryMessageBox = new MessageBox();

		var scoreHandler = function(playerScored) {
			if (playerScored == Players.Player1)
				player1Score++;
			else if (playerScored == Players.Player2)
				player2Score++;
			scoreBoard.setScore(player1Score, player2Score);
			ball.launch(playerScored);
			log.info("scored by player: " + playerScored);
		}
		
		this.start = function(gameStatus, camera, input) {
			this.gameWidth = gameStatus.getWidth();
			this.gameHeight = gameStatus.getHeight();
			var gameHalfWidth = this.gameWidth / 2;
			var gameHalfHeight = this.gameHeight / 2;

			// disable status board drawing 
			//gameStatus.drawStatus = false;
			
			// set 0,0 at canvas's centeer
			camera.setPointOfViewToCenter();
			// register additional keys
			var keys = input.getKeys();
			keys.addKey(keyMap.Q, false);
			keys.addKey(keyMap.ENTER, false);

			// initialize all objects
			board.initialize(this.gameWidth, this.gameHeight);
			scoreBoard.initialize(this.gameWidth);
			timeBoard.initialize(this.gameWidth, this.gameHeight);

			var scaledBallRadius = this.gameHeight / 80;
			ball.initialize(scaledBallRadius, this.gameWidth, this.gameHeight);
			ball.scoreCallback = scoreHandler;

			var scaledPaddleWidth = this.gameHeight / 40;
			var scaledPaddleHeight = this.gameHeight / 5;
			var paddleMargin = 20;
			var leftPaddleX = -gameHalfWidth + scaledPaddleWidth / 2 + paddleMargin;
			var rightPaddleX = gameHalfWidth - scaledPaddleWidth / 2 - paddleMargin;
			leftPaddle.initialize(scaledPaddleWidth, scaledPaddleHeight, leftPaddleX, this.gameHeight);
			leftPaddle.paddleControl = new PaddleUserControl(keyMap.Q, keyMap.A);
			rightPaddle.initialize(scaledPaddleWidth, scaledPaddleHeight, rightPaddleX, this.gameHeight);
			rightPaddle.paddleControl = new PaddleComputerControl(ball, rightPaddle);

			primaryMessageBox.setPosition(gameHalfWidth, gameHalfHeight);
			primaryMessageBox.setFontSize(48);
			primaryMessageBox.setMessage("[1] - PvP, [2] - PvC");
			primaryMessageBox.show();
			secondaryMessageBox.setPosition(gameHalfWidth, gameHalfHeight + 200);
			secondaryMessageBox.setFontSize(32);
			secondaryMessageBox.setMessage("asdfg dasd ad");
			secondaryMessageBox.show();
		};
		
		this.update = function(gameStatus, camera, input, time) {
			timeBoard.update(time.delta);

			ball.update(input, time, this.gameHalfHeight);
			leftPaddle.update(input, time);
			rightPaddle.update(input, time);

			if (input.getKeys().getKey(keyMap.ENTER).isPressed()) {
				var randomId = Math.randomIntInRange(0, 1);
				if (randomId == 0)
					var randomPlayer = Players.Player1;
				else
					var randomPlayer = Players.Player2;
				ball.launch(randomPlayer);
			}	
		}
		
		this.render = function(graphics, camera) {
			board.draw(graphics);
			scoreBoard.draw(graphics);
			timeBoard.draw(graphics);

			ball.draw(graphics, camera);
			leftPaddle.draw(graphics, camera);
			rightPaddle.draw(graphics, camera);

			primaryMessageBox.draw(graphics);
			secondaryMessageBox.draw(graphics);
		}
	}
	
	return Scene;
})
