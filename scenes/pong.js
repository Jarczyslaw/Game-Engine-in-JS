define(['commons/vector', 'commons/primitives', 'commons/physics', 'commons/color', 'commons/timeAccumulator', 'commons/collisions'],
	function (Vector, Primitives, Physics, Color, TimeAccumulator, Collisions) {

		function BallPaddlesCollisions(ball, leftPaddle, rightPaddle) {

			var lastPaddleCollided = null;

			this.debugLines = false;

			var ballLineStart = new Vector();
			var ballLineEnd = new Vector();
			var paddleLineStart = new Vector();
			var paddleLineEnd = new Vector();

			var getPaddleLine = function (paddle) {
				// get x offset to move collision line towards ball
				var horizontalOffset;
				if (paddle === leftPaddle)
					horizontalOffset = paddle.body.width / 2;
				else if (paddle === rightPaddle)
					horizontalOffset = -paddle.body.width / 2;

				var paddleCenter = paddle.linearPhysics.position;
				var paddleHalfHeight = paddle.body.height / 2;
				// get start and end of paddle's line
				// shift this line with margin on x axis and enlarge it by ball radius
				return {
					start: new Vector(paddleCenter.x + horizontalOffset, paddleCenter.y - paddleHalfHeight - ball.body.radius),
					end: new Vector(paddleCenter.x + horizontalOffset, paddleCenter.y + paddleHalfHeight + ball.body.radius)
				}
			}

			var getBallLine = function () {
				var ballCenter = ball.linearPhysics.position;
				var previousBallCenter = ball.previousPosition;
				var ballRadius = ball.body.radius;
				var l = ballCenter.substract(previousBallCenter);
				var dir = l.normalize();
				// get start and end point of vector connecting current and previous ball's positions
				// enlarge towards direction by ball radius
				return {
					start: previousBallCenter,
					end: ballCenter.add(dir.multiply(ballRadius))
				}
			}

			var addPaddleDrag = function (paddle) {
				// get paddle max speed
				var maxSpeed = paddle.paddleControl.getMaxForce() / paddle.linearPhysics.drag;
				// get paddle scaled speed
				var scaledSpeed = paddle.linearPhysics.velocity.y / maxSpeed;
				scaledSpeed = Math.clamp(scaledSpeed, -1, 1);
				// add small amount of ball speed on y axis
				ball.linearPhysics.velocity.y += scaledSpeed * ball.linearPhysics.velocity.magnitude() * 0.1;
			}

			var applyCollision = function (paddle) {
				ball.restorePreviousPosition();
				addPaddleDrag(paddle);
				ball.clampInitialSpeed();
				ball.bounceVertical();
				ball.accelerate();
			}

			this.reset = function () {
				lastPaddleCollided = null;
			}

			this.checkCollision = function () {
				// select paddle to test collision, if ball is to the left of the start point
				var paddleToTest = null;
				if (ball.linearPhysics.position.x < 0)
					paddleToTest = leftPaddle;
				else
					paddleToTest = rightPaddle;

				// don't test line intersection if ball don't cross start point
				if (lastPaddleCollided != paddleToTest) {
					var ballLine = getBallLine();
					var paddleLine = getPaddleLine(paddleToTest);
					// store values for debug purposes
					ballLineStart = ballLine.start;
					ballLineEnd = ballLine.end;
					paddleLineStart = paddleLine.start;
					paddleLineEnd = paddleLine.end;

					var test = Collisions.lineIntersection(ballLine.start, ballLine.end, paddleLine.start, paddleLine.end)
					if (test != null) {
						applyCollision(paddleToTest);
						lastPaddleCollided = paddleToTest;
					}
				}
			}

			this.drawDebugLines = function (graphics) {
				if (this.debugLines) {
					graphics.drawing.drawLine(ballLineStart.x, ballLineStart.y, ballLineEnd.x, ballLineEnd.y, 1, 'red');
					graphics.drawing.drawLine(paddleLineStart.x, paddleLineStart.y, paddleLineEnd.x, paddleLineEnd.y, 1, 'red');
				}
			}
		}

		function BallHorizontalLimiter() {

			var upperLimit = 100;
			var bottomLimit = -100;

			this.initialize = function (gameHeight) {
				var halfGameHeight = gameHeight / 2;
				upperLimit = halfGameHeight;
				bottomLimit = -halfGameHeight;
			}

			this.checkLimits = function (ball) {
				var pos = ball.linearPhysics.position;
				var radius = ball.body.radius;
				if (pos.y + radius > upperLimit || pos.y - radius < bottomLimit) {
					ball.restorePreviousPosition();
					ball.bounceHorizontal();
				}
			}
		}

		function BallScoreChecker() {

			var leftLimit = -100;
			var rightLimit = 100;

			var delayLimit = 100; // additional margin to add delay before next ball spawn

			// empty score handler
			var scoreHandler = function (playerScored) { }

			this.initialize = function (gameWidth, scoreCallback) {
				var halfGameWidth = gameWidth / 2;
				delayLimit = gameWidth / 8;
				leftLimit = -halfGameWidth - delayLimit;
				rightLimit = -leftLimit;
				scoreHandler = scoreCallback;
			}

			this.checkScores = function (ball) {
				var pos = ball.linearPhysics.position;
				var radius = ball.body.radius;
				if (pos.x - radius > rightLimit)
					scoreHandler(Players.Player1);
				else if (pos.x + radius < leftLimit)
					scoreHandler(Players.Player2);
			}
		}

		function Ball() {

			this.body = new Primitives.Circle();
			this.previousPosition = new Vector(0, 0);

			this.linearPhysics = new Physics.Linear();
			this.linearPhysics.drag = 0;

			var initialSpeed = 400;

			this.initialize = function (ballRadius, startSpeed) {
				this.body.radius = ballRadius;
				this.linearPhysics.enabled = false;
				initialSpeed = startSpeed;
			}

			this.launch = function (toPlayer) {
				// initial speed in random direction
				var startVelocity = new Vector(initialSpeed, 0);
				var deviation = Math.PI / 6;
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

			this.restorePreviousPosition = function () {
				this.linearPhysics.position = this.previousPosition;
			}

			this.bounceVertical = function () {
				this.linearPhysics.velocity.x = -this.linearPhysics.velocity.x;
			}

			this.bounceHorizontal = function () {
				this.linearPhysics.velocity.y = -this.linearPhysics.velocity.y;
			}

			this.accelerate = function () {
				var speed = this.linearPhysics.velocity.magnitude();
				this.linearPhysics.velocity.setMagnitude(1.05 * speed);
			}

			this.clampInitialSpeed = function () {
				var speed = this.linearPhysics.velocity.magnitude();
				if (speed < initialSpeed)
					this.linearPhysics.velocity.setMagnitude(speed);
			}

			this.update = function (input, time) {
				this.previousPosition = this.linearPhysics.position;
				this.linearPhysics.update(time.delta);
			}

			this.draw = function (graphics, camera) {
				graphics.resetTransformToCamera(camera);
				this.body.draw(graphics, this.linearPhysics.position, 0);
			}
		}

		function PaddleUserControl(upKey, downKey, moveForce) {

			this.getPaddleForce = function (input) {
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

			this.getMaxForce = function () {
				return moveForce;
			}
		}

		function PaddleComputerControl(ball, computerPaddle, moveForce) {

			var gain = 20;

			this.getPaddleForce = function (input) {
				var error = ball.linearPhysics.position.y - computerPaddle.linearPhysics.position.y
				var force = gain * error; // simple proportional control for computer paddle
				force = Math.clamp(force, -moveForce, moveForce);
				return force;
			}

			this.getMaxForce = function () {
				return moveForce;
			}
		}

		function PaddleFreezeControl() {
			this.getPaddleForce = function (input) {
				return 0;
			}

			this.getMaxForce = function () {
				return 0;
			}
		}

		function PaddleHorizontalLimiter() {

			var bottomLimit = -100;
			var upperLimit = 100;
			var paddleHalfHeight = 100;

			this.initialize = function (gameHeight, paddleHeight) {
				var gameHalfHeight = gameHeight / 2;
				bottomLimit = -gameHalfHeight;
				upperLimit = gameHalfHeight;
				paddleHalfHeight = paddleHeight / 2;
			}

			this.checkLimits = function (paddle) {
				var pos = paddle.linearPhysics.position.y;
				if (pos + paddleHalfHeight > upperLimit)
					paddle.clampToHeight(upperLimit - paddleHalfHeight);
				else if (pos - paddleHalfHeight < bottomLimit)
					paddle.clampToHeight(bottomLimit + paddleHalfHeight);
			}
		}

		function Paddle() {

			this.body = new Primitives.Rectangle();
			var halfHeight = this.body.height / 2;
			var halfWidth = this.body.width / 2;

			this.linearPhysics = new Physics.Linear();
			this.linearPhysics.drag = 5;

			var fixedXposition = 0;

			// empty paddle control object
			this.paddleControl = new PaddleFreezeControl();

			this.initialize = function (paddleWidth, paddleHeight, startXPosition) {
				this.body.width = paddleWidth;
				halfWidth = paddleWidth / 2;
				this.body.height = paddleHeight;
				halfHeight = paddleHeight / 2;
				fixedXposition = startXPosition;
				this.reset();
				this.linearPhysics.enabled = true;
			}

			this.clampToHeight = function (positionY) {
				this.linearPhysics.stop();
				this.linearPhysics.position.y = positionY;
			}

			this.reset = function () {
				this.linearPhysics.stop();
				this.linearPhysics.position.set(fixedXposition, 0);
				this.linearPhysics.enabled = false;
			}

			this.update = function (input, time) {
				var inputForce = this.paddleControl.getPaddleForce(input);

				this.linearPhysics.force.set(0, inputForce);
				this.linearPhysics.update(time.delta);
				this.linearPhysics.position.x = fixedXposition;
			}

			this.draw = function (graphics, camera) {
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

			this.show = function () {
				enabled = true;
			}

			this.hide = function () {
				enabled = false;
			}

			this.setMessage = function (msg) {
				message = msg;
				resize = false;
			}

			this.setFontSize = function (size) {
				fontSize = size;
				resize = false;
			}

			this.setPosition = function (x, y) {
				positionX = x;
				positionY = y;
			}

			this.draw = function (graphics) {
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

			this.setScore = function (player1, player2) {
				player1Score = player1;
				player2Score = player2;
			}

			this.initialize = function (gameWidth) {
				centerX = gameWidth / 2;
			}

			this.draw = function (graphics) {
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

			this.initialize = function (gameWidth, gameHeight) {
				positionX = gameWidth / 2;
				positionY = gameHeight - bottomMargin;
			}

			this.draw = function (graphics, time) {
				graphics.resetTransform();
				graphics.text.setTextAlignment('center', 'bottom');
				graphics.text.setText(secondsToTime(time), positionX, positionY, fontSize, fontColor.toText());
			}
		}

		function Board() {

			var boardColor = new Color();
			boardColor.setRGBA(30, 30, 30, 255);

			var lineColor = Color.white();
			var centerLineWidth = 3;
			var goalLineWidth = 2;
			var goalLineMargin = 5;

			var radius = 100;
			var centerX = 0;
			var centerY = 0;
			var width = 200;
			var height = 100;

			this.drawDashedCircle = function (graphics, circleCenterX, circleCenterY, radius) {
				var chunks = 200;
				var chunksAngle = 2 * Math.PI / chunks;
				for (let i = 0; i < chunks; i += 2) {
					var angleStart = chunksAngle * i;
					var angleEnd = chunksAngle * (i + 1);
					var chunkStartX = circleCenterX + radius * Math.cos(angleStart);
					var chunkStartY = circleCenterY + radius * Math.sin(angleStart);
					var chunkEndX = circleCenterX + radius * Math.cos(angleEnd);
					var chunkEndY = circleCenterY + radius * Math.sin(angleEnd);
					graphics.drawing.drawLine(chunkStartX, chunkStartY, chunkEndX, chunkEndY, centerLineWidth, lineColor.toText());
				}
			}

			this.initialize = function (gameWidth, gameHeight) {
				centerX = gameWidth / 2;
				centerY = gameHeight / 2;
				radius = gameHeight / 4;
				width = gameWidth;
				height = gameHeight;
			}

			this.draw = function (graphics) {
				// clear board
				graphics.resetTransform();
				graphics.clear(boardColor.toText());
				// draw center dot
				graphics.drawing.drawCircle(centerX, centerY, 5, lineColor.toText());
				// draw center line
				graphics.drawing.drawLine(centerX, 0, centerX, height, centerLineWidth, lineColor.toText(), [5, 5]);
				// draw dashed circle in the centre
				this.drawDashedCircle(graphics, centerX, centerY, radius);
				// draw goal lines
				graphics.drawing.drawLine(goalLineMargin, 0, goalLineMargin, height, goalLineWidth, lineColor.toText());
				graphics.drawing.drawLine(width - goalLineMargin, 0, width - goalLineMargin, height, goalLineWidth, lineColor.toText());
			}
		}

		function PlayersInfo() {

			this.enabled = true;

			var fontColor = Color.white();
			var fontSize = 24;

			var horizontalMargin = 40;
			var verticalMargin = 60;

			var player1Info = 'Player1Info';
			var player2Info = 'Player2Info';

			var gameWidth = 100;

			this.initialize = function (mode, width) {
				gameWidth = width;
				this.updateInfo(mode);
			}

			this.updateInfo = function (mode) {
				if (this.enabled) {
					if (mode == GameModes.CvC) {
						player1Info = 'Player 1: BOT';
						player2Info = 'Player 2: BOT';
					} else if (mode == GameModes.PvC) {
						player1Info = 'Player 1: ↑ [Q], ↓ [A]';
						player2Info = 'Player 2: BOT';
					} else if (mode == GameModes.PvP) {
						player1Info = 'Player 1: ↑ [Q], ↓ [A]';
						player2Info = 'Player 2: ↑ [K], ↓ [M]';
					}
				}
			}

			this.draw = function (graphics) {
				if (this.enabled) {
					graphics.resetTransform();
					graphics.text.setTextAlignment('left', 'top');
					graphics.text.setText(player1Info, horizontalMargin, verticalMargin, fontSize, fontColor.toText());
					graphics.text.setTextAlignment('right', 'top');
					graphics.text.setText(player2Info, gameWidth - horizontalMargin, verticalMargin, fontSize, fontColor.toText());
				}
			}
		}

		// Players enum
		var Players = Object.freeze(
			{ Player1: 1, Player2: 2 }
		);

		// Game Modes enum
		var GameModes = Object.freeze(
			{ CvC: 0, PvC: 1, PvP: 2 }
		);

		function Scene() {

			var player1Score = 0;
			var player2Score = 0;

			// create all game objects with default values
			var board = new Board();
			var scoreBoard = new ScoreBoard();
			var timeBoard = new TimeBoard();

			var leftPaddle = new Paddle();
			var rightPaddle = new Paddle();
			var paddleHorizontalLimiter = new PaddleHorizontalLimiter();

			var ball = new Ball();
			var ballPaddlesCollisions = new BallPaddlesCollisions(ball, leftPaddle, rightPaddle);
			// draw collisions debug lines
			ballPaddlesCollisions.debugLines = false;
			var ballHorizontalLimiter = new BallHorizontalLimiter();
			var ballScoreChecker = new BallScoreChecker();

			var primaryMessageBox = new MessageBox();
			var secondaryMessageBox = new MessageBox();

			var playersInfo = new PlayersInfo();

			var timeAccumulator = new TimeAccumulator();

			var gameStarted = false;
			var gameMode = GameModes.PvC;

			var height = 100;

			var scoreHandler = function (playerScored) {
				if (playerScored == Players.Player1)
					player1Score++;
				else if (playerScored == Players.Player2)
					player2Score++;
				scoreBoard.setScore(player1Score, player2Score);
				ballPaddlesCollisions.reset();
				ball.launch(playerScored);
				log.info("scored by player: " + playerScored);
			}

			var getPaddleForce = function (timeFromTopToBottom, paddleDrag) {
				return height / timeFromTopToBottom * paddleDrag;
			}

			this.gameStart = function () {
				// hide all UI elements
				primaryMessageBox.hide();
				secondaryMessageBox.hide();
				playersInfo.enabled = false;

				// attach proper controller for paddles
				var defaultPaddleForce = getPaddleForce(2, leftPaddle.linearPhysics.drag);
				if (gameMode == GameModes.CvC) {
					// paddles controlled by random skilled bots
					leftPaddle.paddleControl = new PaddleComputerControl(ball, leftPaddle, defaultPaddleForce);
					rightPaddle.paddleControl = new PaddleComputerControl(ball, rightPaddle, defaultPaddleForce);
				} else if (gameMode == GameModes.PvC) {
					leftPaddle.paddleControl = new PaddleUserControl(keyMap.Q, keyMap.A, defaultPaddleForce);
					rightPaddle.paddleControl = new PaddleComputerControl(ball, rightPaddle, defaultPaddleForce);
				} else if (gameMode == GameModes.PvP) {
					leftPaddle.paddleControl = new PaddleUserControl(keyMap.Q, keyMap.A, defaultPaddleForce);
					rightPaddle.paddleControl = new PaddleUserControl(keyMap.K, keyMap.M, defaultPaddleForce);
				}

				// get random player and start the game
				var randomId = Math.randomIntInRange(0, 1);
				if (randomId == 0)
					var randomPlayer = Players.Player1;
				else
					var randomPlayer = Players.Player2;
				ball.launch(randomPlayer);
				timeAccumulator.enabled = true;
				gameStarted = true;
			}

			this.start = function (gameStatus, camera, input) {
				this.gameWidth = gameStatus.getWidth();
				this.gameHeight = gameStatus.getHeight();
				height = this.gameHeight;
				var gameHalfWidth = this.gameWidth / 2;
				var gameHalfHeight = this.gameHeight / 2;

				// disable status board drawing 
				gameStatus.drawStatus = false;
				// set 0,0 at canvas's centeer
				camera.setPointOfViewToCenter();
				// register additional keys
				var keys = input.getKeys();
				keys.addKeys([keyMap.Q, keyMap.A, keyMap.K, keyMap.M, keyMap.Key1, keyMap.Key2, keyMap.Key3, keyMap.ENTER], false);

				// initialize all objects
				board.initialize(this.gameWidth, this.gameHeight);
				scoreBoard.initialize(this.gameWidth);
				timeBoard.initialize(this.gameWidth, this.gameHeight);

				var scaledBallRadius = this.gameHeight / 80;
				ball.initialize(scaledBallRadius, this.gameWidth / 4);

				ballHorizontalLimiter.initialize(this.gameHeight);
				ballScoreChecker.initialize(this.gameWidth, scoreHandler);

				var scaledPaddleWidth = this.gameHeight / 40;
				var scaledPaddleHeight = this.gameHeight / 5;
				var paddleMargin = 20;
				var leftPaddleX = -gameHalfWidth + scaledPaddleWidth / 2 + paddleMargin;
				var rightPaddleX = -leftPaddleX;
				leftPaddle.initialize(scaledPaddleWidth, scaledPaddleHeight, leftPaddleX, this.gameHeight);
				rightPaddle.initialize(scaledPaddleWidth, scaledPaddleHeight, rightPaddleX, this.gameHeight);

				paddleHorizontalLimiter.initialize(this.gameHeight, scaledPaddleHeight);

				// UI elements
				primaryMessageBox.setPosition(gameHalfWidth, gameHalfHeight);
				primaryMessageBox.setFontSize(40);
				primaryMessageBox.setMessage("Press ENTER to start!");
				primaryMessageBox.show();
				secondaryMessageBox.setPosition(gameHalfWidth, gameHalfHeight + 100);
				secondaryMessageBox.setFontSize(32);
				secondaryMessageBox.setMessage("[1] - PvC, [2] - PvP, [3] - CvC");
				secondaryMessageBox.show();
				playersInfo.initialize(gameMode, this.gameWidth);
			};

			this.update = function (gameStatus, camera, input, time) {
				if (gameStatus.paused)
					return;

				var keys = input.getKeys();

				if (gameStarted) {
					timeAccumulator.add(time.delta);

					ball.update(input, time);
					leftPaddle.update(input, time);
					paddleHorizontalLimiter.checkLimits(leftPaddle);
					rightPaddle.update(input, time);
					paddleHorizontalLimiter.checkLimits(rightPaddle);

					ballPaddlesCollisions.checkCollision();
					ballHorizontalLimiter.checkLimits(ball);
					ballScoreChecker.checkScores(ball);
				} else {
					var previousGameMode = gameMode;
					if (keys.getKey(keyMap.ENTER).isPressed()) {
						this.gameStart();
					} else if (keys.getKey(keyMap.Key1).isPressed()) {
						gameMode = GameModes.PvC;
					} else if (keys.getKey(keyMap.Key2).isPressed()) {
						gameMode = GameModes.PvP;
					} else if (keys.getKey(keyMap.Key3).isPressed()) {
						gameMode = GameModes.CvC;
					}
					if (gameMode != previousGameMode)
						playersInfo.updateInfo(gameMode);
				}
			}

			this.render = function (graphics, camera) {
				board.draw(graphics);
				scoreBoard.draw(graphics);
				timeBoard.draw(graphics, timeAccumulator.getTime());

				ball.draw(graphics, camera);
				leftPaddle.draw(graphics, camera);
				rightPaddle.draw(graphics, camera);

				primaryMessageBox.draw(graphics);
				secondaryMessageBox.draw(graphics);
				playersInfo.draw(graphics);

				graphics.resetTransformToCamera(camera);
				ballPaddlesCollisions.drawDebugLines(graphics);

				//sleep(200);
			}
		}

		return Scene;
	})

