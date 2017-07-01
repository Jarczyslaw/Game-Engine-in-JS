define(['commons/vector', 'commons/primitives', 'commons/physics'], function(Vector, Primitives, Physics){

	function Ball(radius) {

		this.body = new Primitives.Circle();
		this.body.size = radius;

		this.linearPhysics = new Physics.Linear();
		this.linearPhysics.drag = 0;

		var bottomBorder;
		var upperBorder;

		this.initialize = function(gameHalfHeight) {
			bottomBorder = -gameHalfHeight;
			upperBorder = gameHalfHeight;
			this.linearPhysics.velocity.set(0, 500);
			this.linearPhysics.enabled = true;
		}

		this.clampToHeight = function(nextPosition) {
			if (nextPosition.y + this.body.size > upperBorder || nextPosition.y - this.body.size < bottomBorder)
				return true;
			else
				return false;
		}

		this.update = function(input, time) {
			var currentPosition = this.linearPhysics.position;
			this.linearPhysics.update(time.delta);
			if (this.clampToHeight(this.linearPhysics.position)) {
				this.linearPhysics.position = currentPosition;
				this.linearPhysics.velocity.set(this.linearPhysics.velocity.x, -this.linearPhysics.velocity.y);
			} 
		}

		this.draw = function(graphics, camera) {
			graphics.resetTransformToCamera(camera);
			this.body.draw(graphics, this.linearPhysics.position, 0);
		}
	}

	function PaddleUserControl() {

		var moveForce = 1000;

		this.getPaddleForce = function(input) {
			var inputForce;
			var keys = input.getKeys();
			if (keys.getKey(keyMap.Q).isDown())
				inputForce = -moveForce;
			else if (keys.getKey(keyMap.A).isDown())
				inputForce = moveForce;
			else
				inputForce = 0;
			return inputForce;
		}
	}

	function PaddleComputerControl(ball, computerPaddle) {

		var moveForce = 1000;
		var gain = 5;

		this.getPaddleForce = function(input) {
			var error = ball.linearPhysics.position.y - computerPaddle.linearPhysics.position.y
			var force = gain * error; // simple proportional control for computer paddle
			force = Math.clamp(force, -moveForce, moveForce);
			return force;
		}
	}

	function Paddle(paddleWidth, paddleHeight) {

		this.body = new Primitives.Rectangle();
		this.body.width = paddleWidth;
		this.body.height = paddleHeight;
		var halfHeight = paddleHeight / 2;

		this.linearPhysics = new Physics.Linear();
		this.linearPhysics.drag = 5;
		
		var bottomBorder;
		var upperBorder;
		var fixedXposition;

		var paddleControl;

		this.initialize = function(startX, gameHalfHeight, paddleControlObject) {
			bottomBorder = -gameHalfHeight;
			upperBorder = gameHalfHeight;
			fixedXposition = startX;
			this.reset();
			paddleControl = paddleControlObject;
		}

		this.reset = function() {
			this.linearPhysics.stop();
			this.linearPhysics.position.set(fixedXposition, 0);
			this.linearPhysics.enabled = true;
		}

		this.clampToHeight = function() {
			var clamped = false;
			var newPosition = this.linearPhysics.position.y;
			if (this.linearPhysics.position.y + halfHeight > upperBorder) {
				clamped = true;
				newPosition = upperBorder - halfHeight;
			} else if (this.linearPhysics.position.y - halfHeight < bottomBorder) {
				clamped = true;
				newPosition = bottomBorder + halfHeight;
			}	
			if (clamped) {
				this.linearPhysics.stop();
				this.linearPhysics.position.y = newPosition;
			}
		}

		this.update = function(input, time) {	
			var inputForce = paddleControl.getPaddleForce(input);

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

	function Scene() {

		var paddleWidth = 20;
		var paddleHeight = 150;
		var paddleMargin = 10;

		var ballRadius = 15;

		var ball = new Ball(ballRadius);
		var playerPaddle = new Paddle(paddleWidth, paddleHeight);
		var computerPaddle = new Paddle(paddleWidth, paddleHeight);
		
		this.start = function(gameStatus, camera, input) {
			this.gameWidth = gameStatus.getWidth();
			this.gameHeight = gameStatus.getHeight();
			this.gameHalfHeight = this.gameHeight / 2;
			this.gameHalfWidth = this.gameWidth / 2;

			this.screenWidth = camera.getWidth();
			this.screenHeight = camera.getHeight();

			camera.setPointOfViewToCenter();
			input.getKeys().addKey(keyMap.Q, false);

			ball.initialize(this.gameHalfHeight);
			playerPaddle.initialize(-this.gameHalfWidth + paddleWidth / 2 + paddleMargin, this.gameHalfHeight, 
				new PaddleUserControl());
			computerPaddle.initialize(this.gameHalfWidth - paddleWidth / 2 - paddleMargin, this.gameHalfHeight, 
				new PaddleComputerControl(ball, computerPaddle));
		};
		
		this.update = function(gameStatus, camera, input, time) {
			ball.update(input, time, this.gameHalfHeight);
			playerPaddle.update(input, time);
			computerPaddle.update(input, time);
		}
		
		this.render = function(graphics, camera) {
			ball.draw(graphics, camera);
			playerPaddle.draw(graphics, camera);
			computerPaddle.draw(graphics, camera);
		}
	}
	
	return Scene;
})

