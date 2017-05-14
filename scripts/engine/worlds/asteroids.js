define(['commons/vector'], function(Vector){
	
	function Propulsion() {

		var visible = false;
		
		var timeAccu = 0;
		var blinkTime = 0.025;

		this.update = function(enabled, timeDelta) {
			if (enabled) {
				timeAccu += timeDelta;
				if (timeAccu > blinkTime) {
					visible = !visible;
					timeAccu = 0;
				}
			} else {
				visible = false;
				timeAccu = 0;
			}
		}

		this.draw = function(context) {
			if (visible) {
				context.beginPath();
				context.lineWidth = '2';
				context.strokeStyle = 'white';
				context.moveTo(-10, 2);
				context.lineTo(-25, 2);
				context.moveTo(-10, -2);
				context.lineTo(-25, -2);
				context.stroke();
			}
		}
	}

	function Physics () {

		this.rotation = 0;
		var rotationSpeed = 270;
		
		this.position = new Vector(0, 0);
		this.velocity = new Vector(0, 0);
		var drag = 0.5;
		var accelerationValue = 120;

		this.rotate = function(direction, timeDelta) {
			this.rotation += direction * rotationSpeed * timeDelta;
		}

		this.update = function(accelerate, timeDelta) {
			var acceleration = new Vector(0, 0);
			if (accelerate) {
				acceleration.x = accelerationValue;
				acceleration.setAngle(Math.radians(this.rotation));
			}
			acceleration = acceleration.add(this.velocity.multiply(-drag));
			this.velocity = this.velocity.add(acceleration.multiply(timeDelta));
			this.position = this.position.add(this.velocity.multiply(timeDelta));
		}
	}

	function PositionClamp(width, height) {

		var margin = 20;

		var clampToSize = function(value, size) {
			if (value > size + margin)
				return -size - margin;
			else if (value < -size - margin)
				return size + margin;
			return value;
		}

		this.clamp = function(position) {
			var clamped = new Vector();
			clamped.x = clampToSize(position.x, width);
			clamped.y = clampToSize(position.y, height);
			return clamped;
		}
	}

	function Ship() {

		var physics = new Physics();
		var propulsion = new Propulsion();

		this.getPhysics = function() {
			return physics;
		}

		this.clampToScreen = function(positionClamp) {
			var clampedPosition = positionClamp.clamp(physics.position);
			physics.position = clampedPosition;
		}

		this.update = function(input, time) {
			var keys = input.getKeys();
			
			if(keys.getKey(keyMap.LEFT).isDown() || keys.getKey(keyMap.A).isDown())
				physics.rotate(-1, time.delta);
			if(keys.getKey(keyMap.RIGHT).isDown() || keys.getKey(keyMap.D).isDown())
				physics.rotate(1, time.delta);

			var accelerating = false;
			if(keys.getKey(keyMap.UP).isDown() || keys.getKey(keyMap.W).isDown())
				accelerating = true;
				
			propulsion.update(accelerating, time.delta);
			physics.update(accelerating, time.delta);
		}
		
		this.draw = function(graphics) {
			var ctx = graphics.ctx;
			ctx.translate(physics.position.x, physics.position.y);
			ctx.rotate(Math.radians(physics.rotation));
			ctx.beginPath();
			ctx.lineWidth = '5';
			ctx.fillStyle = 'white';
			ctx.moveTo(-15, 10);
			ctx.lineTo(20, 0);
			ctx.lineTo(-15, -10);
			ctx.fill();
			propulsion.draw(ctx);
		}
	}
	
	
	function World() {
	
		var that = this;
		
		var ship = new Ship();
		var positionClamp;
		
		this.start = function(gameInfo) {
			this.width = gameInfo.getWidth();
			this.height = gameInfo.getHeight();
			positionClamp = new PositionClamp(this.width / 2, this.height / 2);
		};
		
		this.update = function(gameInfo, input, time) {
			if (!gameInfo.paused) {
				ship.update(input, time);
				ship.clampToScreen(positionClamp);
			}
		}
		
		this.render = function(graphics) {
			graphics.contextCenter();
			ship.draw(graphics);
		}
	}
	
	return World;
})

