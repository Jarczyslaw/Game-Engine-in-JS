define(['commons/vector', 'commons/particles', 'commons/pooler', 'commons/physics', 'commons/primitives', 'commons/color'], 
function(Vector, Particles, Pooler, Physics, Primitives, Color) {

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

	function Propulsion() {

		function PropulsionLine() {
			this.body = new Primitives.Line();
			this.start = new Vector();
			this.end = new Vector();

			this.draw = function(graphics) {
				this.body.draw(graphics, this.start, this.end);
			}
		}

		var primaryLine = new PropulsionLine();
		var secondaryLine1 = new PropulsionLine();
		var secondaryLine2 = new PropulsionLine();

		var visible = false;
		
		var timeAccu = 0;
		var blinkTime = 0.025;
		var gap = 1;
		var lineAnchor = 0;
		var primaryLineLength = 10;
		var secondaryLineLength = 6;

		this.initialize = function(shipHeight, shipBaseLength) {
			var lineWidth = 2;
			gap = shipBaseLength / 4;
			lineAnchor = -shipHeight / 3;
			primaryLineLength = shipHeight / 4;
			secondaryLineLength = 2 / 3 * primaryLineLength;
			primaryLine.body.width = lineWidth;
			primaryLine.start.set(lineAnchor, 0);
			primaryLine.end.set(lineAnchor - primaryLineLength, 0);
			secondaryLine1.body.width = lineWidth;
			secondaryLine1.start.set(lineAnchor, gap);
			secondaryLine1.end.set(lineAnchor - secondaryLineLength, gap);
			secondaryLine2.body.width = lineWidth;
			secondaryLine2.start.set(lineAnchor, -gap);
			secondaryLine2.end.set(lineAnchor - secondaryLineLength, -gap);
		}

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

		this.draw = function(graphics, camera, shipRotation, shipPosition) {
			if (visible) {
				primaryLine.draw(graphics);
				// undo translation for primaryLine
				graphics.ctx.translate(-primaryLine.start.x, -primaryLine.start.y);
				secondaryLine1.draw(graphics);
				// undo translation for secondaryLine1
				graphics.ctx.translate(-secondaryLine1.start.x, -secondaryLine1.start.y);
				secondaryLine2.draw(graphics);
			}
		}
	}

	function Ship() {

		this.body = new Primitives.Triangle();
		this.body.height = 30;
		this.body.baseLength = 15;

		this.center = new Primitives.Circle();
		this.center.radius = 1;
		this.center.color = Color.black();

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
			propulsion.initialize(this.body.height, this.body.baseLength);
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
		
		this.draw = function(graphics, camera) {
			if (!enabled)
				return;

			var rotation =  Math.radians(this.angularPhysics.rotation);

			graphics.resetTransformToCamera(camera);
			this.body.draw(graphics, this.linearPhysics.position, rotation);

			propulsion.draw(graphics, camera, this.linearPhysics.position, rotation);

			graphics.resetTransformToCamera(camera);
			this.center.draw(graphics, this.linearPhysics.position);
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
			ship.draw(graphics, camera);
			projectiles.draw(graphics, camera);
			sparksExplosion.draw(graphics, camera);
		}
	}
	
	return Scene;
})

