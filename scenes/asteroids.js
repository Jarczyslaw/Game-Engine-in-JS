define(['commons/vector', 'commons/particles', 'commons/pooler', 'commons/physics'], function(Vector, Particles, Pooler, Physics) {

	function SparksExplosion() {

		var sparks = [];
		for (let i = 0;i < 30;i++) {
			var spark = new Particles.Spark();
			sparks.push(spark);
		}

		this.emit = function(position) {
			sparks.forEach(function(spark) {
				var startVelocity = new Vector(Math.randomInRange(50, 150), 0);
				startVelocity.setAngle(Math.randomInRange(-Math.PI, Math.PI));
				var startRotation = Math.randomInRange(-45, 45);
				var startRotationSpeed = Math.randomInRange(-90, 90);
				var startSize = Math.randomInRange(5, 20);
				var lifeTime = Math.randomInRange(0.5, 2);
				spark.emit(position, startVelocity,
					startRotation, startRotationSpeed,
					startSize, lifeTime);
			});
		}

		this.update = function(time) {
			sparks.forEach(function(spark) {
				spark.update(time);
			});
		}
		
		this.draw = function(graphics, camera) {
			sparks.forEach(function(spark) {
				graphics.drawInCameraContext(camera, spark);
			});	
		}
	}

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

	/*function Physics () {

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
	}*/

	function ScreenRepeater(minWidth, maxWidth, minHeight, maxHeight) {

		var repeatValue = function(value, margin, minValue, maxValue) {
			if (value > maxValue + margin)
				return minValue - margin;
			else if (value < minValue - margin)
				return maxValue + margin;
			return value;
		}

		this.repeat = function(position, margin) {
			var repeated = new Vector();
			repeated.x = repeatValue(position.x, margin, minWidth, maxWidth);
			repeated.y = repeatValue(position.y, margin, minHeight, maxHeight);
			return repeated;
		}
	}

	function ScreenDisabler(minWidth, maxWidth, minHeight, maxHeight) {

		var checkBorders = function(value, margin, minValue, maxValue) {
			if (value - margin > maxValue)
				return true;
			else if (value + margin < minValue)
				return true;
			return false;
		}

		this.disable = function(position, margin) {
			if (checkBorders(position.x, margin, minWidth, maxWidth)) 
				return true;
			if (checkBorders(position.y, margin, minHeight, maxHeight)) 
				return true;
			return false;
		}
	}

	function Projectile() {

		this.linearPhysics = new Physics.Linear();
		this.angularPhysics = new Physics.Angular();

		var enabled = false;

		this.getEnabled = function() {
			return enabled;
		}

		this.setEnabled = function(newState) {
			enabled = newState;
			this.linearPhysics.enabled = newState;
		}

		this.shoot = function(shootPosition, shootDirection) {
			this.setEnabled(true);
			this.linearPhysics.stop();
			this.angularPhysics.stop();

			this.linearPhysics.position = shootPosition;
			this.angularPhysics.rotation = shootDirection;
			this.linearPhysics.velocity = new Vector(800, 0);
			this.linearPhysics.velocity.setAngle(Math.radians(this.angularPhysics.rotation));
		}

		this.update = function(time) {
			this.linearPhysics.update(time.delta);
		}

		this.draw = function(graphics) {
			if (enabled) {
				var context = graphics.ctx;
				context.translate(this.linearPhysics.position.x, this.linearPhysics.position.y);
				context.rotate(Math.radians(this.angularPhysics.rotation));
				context.beginPath();
				context.lineWidth = '3';
				context.strokeStyle = 'white';
				context.moveTo(7, 0);
				context.lineTo(-7, 0);
				context.stroke();
			}
		}
	}

	function ProjectilesContainer() {

		var pool = new Pooler(Projectile);

		this.shoot = function(shootPosition, shootDirection) {
			var projectile = pool.get();
			projectile.shoot(shootPosition, shootDirection);
			log.info('Projectiles count: ' + pool.count());
		}

		this.update = function(time, disabler) {
			pool.forEach(function(projectile) {
				projectile.update(time);
			});
		}

		this.draw = function(graphics, camera) {
			pool.forEach(function(projectile) {
				graphics.resetTransformToCamera(camera);
				projectile.draw(graphics);
			});
		}

		this.forEach = function(callback) {
			pool.forEach(function(p) {
				callback(p);
			});
		}
	}

	function Ship() {

		this.linearPhysics = new Physics.Linear();
		this.linearPhysics.drag = 0.5;
		this.angularPhysics = new Physics.Angular();

		var propulsion = new Propulsion();
		var projectiles = null;

		var enabled = true;

		this.getEnabled = function() {
			return enabled;
		}

		this.setEnabled = function(state) {
			enable = false;
			this.linearPhysics.enabled = state;
			this.angularPhysics.enabled = state;
		}

		this.initialize = function(projectilesPool) {
			projectiles = projectilesPool;
			this.setEnabled(true);
		}

		this.update = function(input, time) {
			if (!enabled)
				return;

			var keys = input.getKeys();
			
			// rotation movement
			var angularVelocity = 0;
			if (keys.getKey(keyMap.LEFT).isDown() || keys.getKey(keyMap.A).isDown())
				angularVelocity -= 270;
			if (keys.getKey(keyMap.RIGHT).isDown() || keys.getKey(keyMap.D).isDown())
				angularVelocity += 270;
			this.angularPhysics.velocity = angularVelocity;
			this.angularPhysics.update(time.delta);

			// shooting
			if(keys.getKey(keyMap.SPACE).isPressed()) {
				projectiles.shoot(this.linearPhysics.position, this.angularPhysics.rotation);
			}
			
			// linear movement
			var accelerating = false;
			var force = Vector.zeros();
			if(keys.getKey(keyMap.UP).isDown() || keys.getKey(keyMap.W).isDown()) {
				accelerating = true;
				force.x = 120;
			}
			force.setAngle(Math.radians(this.angularPhysics.rotation));
			this.linearPhysics.force = force;
			this.linearPhysics.update(time.delta);	

			propulsion.update(accelerating, time.delta);
			
		}
		
		this.draw = function(graphics) {
			if (!enabled)
				return;

			this.drawBody(graphics);
			propulsion.draw(graphics);
		}

		this.drawBody = function(graphics) {
			var ctx = graphics.ctx;
			ctx.translate(this.linearPhysics.position.x, this.linearPhysics.position.y);
			ctx.rotate(Math.radians(this.angularPhysics.rotation));
			ctx.beginPath();
			ctx.lineWidth = '5';
			ctx.fillStyle = 'white';
			ctx.moveTo(-15, 10);
			ctx.lineTo(20, 0);
			ctx.lineTo(-15, -10);
			ctx.fill();
		}
	}
	
	
	function Scene() {

		var projectiles = new ProjectilesContainer();
		var ship = new Ship();

		var screenRepeater = null;
		var screenDisabler = null;
		
		this.start = function(gameStatus, camera, input) {
			camera.setPointOfViewToCenter();

			this.width = gameStatus.getWidth();
			this.height = gameStatus.getHeight();
			var halfWidth = this.width / 2;
			var halfHeight = this.height / 2;

			screenRepeater = new ScreenRepeater(-halfWidth, halfWidth, -halfHeight, halfHeight);
			screenDisabler = new ScreenDisabler(-halfWidth, halfWidth, -halfHeight, halfHeight);

			ship.initialize(projectiles);
		};
		
		var sparksExplosion = new SparksExplosion();

		this.update = function(gameStatus, camera, input, time) {
			if (!gameStatus.paused) {
				ship.update(input, time);
				var clampedPosition = screenRepeater.repeat(ship.linearPhysics.position, 20);
				ship.linearPhysics.position = clampedPosition;

				projectiles.update(time, screenDisabler);
				projectiles.forEach(function(projectile) {
					if (screenDisabler.disable(projectile.linearPhysics.position, 20))
						projectile.setEnabled(false);
				});
			}

			if (input.getMouse().isPressed()) {
				var position = input.getMouse().getInGamePosition(camera);
				log.info("emit: ["+ position.x + ", " + position.y + "]");
				sparksExplosion.emit(new Vector(position.x, position.y));
			}

			sparksExplosion.update(time);
		}
		
		this.render = function(graphics, camera) {
			graphics.drawInCameraContext(camera, ship);

			projectiles.draw(graphics, camera);

			sparksExplosion.draw(graphics, camera);
		}
	}
	
	return Scene;
})

