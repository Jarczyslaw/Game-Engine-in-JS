define(['commons/vector', 'commons/pooler'], function(Vector, Pooler){
	
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

		this.draw = function(graphics) {
			if (visible) {
				var context = graphics.ctx;
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

	function ScreenRepeater(minWidth, maxWidth, minHeight, maxHeight) {

		var that = this;
		this.margin = 20;

		var repeatValue = function(value, minValue, maxValue) {
			if (value > maxValue + that.margin)
				return minValue - that.margin;
			else if (value < minValue - that.margin)
				return maxValue + that.margin;
			return value;
		}

		this.repeat = function(position) {
			var repeated = new Vector();
			repeated.x = repeatValue(position.x, minWidth, maxWidth);
			repeated.y = repeatValue(position.y, minHeight, maxHeight);
			return repeated;
		}
	}

	function ScreenDisabler(minWidth, maxWidth, minHeight, maxHeight) {

		var that = this;
		this.margin = 50;

		var checkBorders = function(value, minValue, maxValue) {
			if (value - that.margin > maxValue)
				return true;
			else if (value + that.margin < minValue)
				return true;
			return false;
		}

		this.disable = function(object, position) {
			if (checkBorders(position.x, minWidth, maxWidth)) {
				object.enabled = false;
				return;
			}
			if (checkBorders(position.y, minHeight, maxHeight)) {
				object.enabled = false;
				return;
			}
		}
	}

	function Projectile() {

		var position;
		var direction;
		var velocity = new Vector(800, 0);

		this.enabled = false;

		this.shoot = function(shootPosition, shootDirection) {
			this.enabled = true;
			direction = shootDirection;
			velocity.setAngle(Math.radians(direction));
			position = shootPosition;
		}

		this.getPosition = function() {
			return position;
		}

		this.update = function(time) {
			if (this.enabled)
				position = position.add(velocity.multiply(time.delta));
		}

		this.draw = function(graphics) {
			if (this.enabled) {
				graphics.resetToCenter();
				var context = graphics.ctx;
				context.translate(position.x, position.y);
				context.rotate(Math.radians(direction));
				context.beginPath();
				context.lineWidth = '3';
				context.strokeStyle = 'white';
				context.moveTo(7, 0);
				context.lineTo(-7, 0);
				context.stroke();
			}
		}
	}

	function Projectiles() {

		var pool = new Pooler(Projectile);

		this.shoot = function(shootPosition, shootDirection) {
			var projectile = pool.get();
			projectile.shoot(shootPosition, shootDirection);
			log.info('Projectiles count: ' + pool.count());
		}

		this.update = function(time) {
			pool.forEach(function(projectile) {
				projectile.update(time);
			});
		}

		this.draw = function(graphics) {
			pool.forEach(function(projectile) {
				projectile.draw(graphics);
			});
		}

		this.disable = function(disabler) {
			pool.forEach(function(projectile) {
				disabler.disable(projectile, projectile.getPosition());
			});
		}
	}

	function Ship() {

		var physics = new Physics();
		var propulsion = new Propulsion();
		var projectiles = null;

		this.getPhysics = function() {
			return physics;
		}

		this.setProjectiles = function(projectilesPool) {
			projectiles = projectilesPool;
		}

		this.repeatInScreen = function(screenRepeater) {
			var clampedPosition = screenRepeater.repeat(physics.position);
			physics.position = clampedPosition;
		}

		this.update = function(input, time) {
			var keys = input.getKeys();
			
			if(keys.getKey(keyMap.LEFT).isDown() || keys.getKey(keyMap.A).isDown())
				physics.rotate(-1, time.delta);
			if(keys.getKey(keyMap.RIGHT).isDown() || keys.getKey(keyMap.D).isDown())
				physics.rotate(1, time.delta);

			if(keys.getKey(keyMap.SPACE).isPressed()) {
				if (projectiles != null)
					projectiles.shoot(physics.position, physics.rotation);
			}
			
			var accelerating = false;
			if(keys.getKey(keyMap.UP).isDown() || keys.getKey(keyMap.W).isDown())
				accelerating = true;
				
			propulsion.update(accelerating, time.delta);
			physics.update(accelerating, time.delta);
		}
		
		this.draw = function(graphics) {
			drawBody(graphics);
			propulsion.draw(graphics);
		}

		var drawBody = function(graphics) {
			graphics.resetToCenter();
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
		}
	}
	
	
	function World() {
	
		var that = this;
		
		var projectiles = new Projectiles();
		var ship = new Ship();
		ship.setProjectiles(projectiles);

		var screenRepeater = null;
		var screenDisabler = null;
		
		this.start = function(gameInfo) {
			this.width = gameInfo.getWidth();
			this.height = gameInfo.getHeight();
			var halfWidth = this.width / 2;
			var halfHeight = this.height / 2;

			screenRepeater = new ScreenRepeater(-halfWidth, halfWidth, -halfHeight, halfHeight);
			screenDisabler = new ScreenDisabler(-halfWidth, halfWidth, -halfHeight, halfHeight);
		};
		
		this.update = function(gameInfo, input, time) {
			if (!gameInfo.paused) {
				ship.update(input, time);
				ship.repeatInScreen(screenRepeater);

				projectiles.update(time);
				projectiles.disable(screenDisabler);
			}
		}
		
		this.render = function(graphics) {
			ship.draw(graphics);
			projectiles.draw(graphics);
		}
	}
	
	return World;
})

