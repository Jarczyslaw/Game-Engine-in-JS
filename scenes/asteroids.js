define(['commons/vector', 'commons/particles', 'commons/pooler', 'commons/physics', 'commons/primitives', 'commons/color', 'commons/timeAccumulator'],
	function (Vector, Particles, Pooler, Physics, Primitives, Color, TimeAccumulator) {

		var DEBUG = true;

		function DebugDot() {
			Primitives.Circle.call(this);
			this.radius = 1;
			this.color.setRGB(255, 0, 0);

			this.drawDebug = function (graphics, camera, position) {
				if (DEBUG) {
					graphics.resetTransformToCamera(camera);
					this.draw(graphics, position);
				}
			}
		}

		function SparksContainer() {

			var pool = new Pooler();

			this.velocityMin = 50;
			this.velocityMax = 150;
			this.sizeMin = 5;
			this.sizeMax = 15;
			this.lifeTimeMin = 0.5;
			this.lifeTimeMax = 1;

			this.emitInDirection = function (position, angleMin, angleMax, count = 20) {
				for (let i = 0; i < count; i++) {
					// get spark from pool, create if there is no available one
					var spark = pool.get(function () {
						var body = new Primitives.Square();
						var newSpark = new Particles.Spark(body);
						return newSpark;
					});

					var startVelocity = new Vector(Math.randomInRange(this.velocityMin, this.velocityMax), 0);
					startVelocity.setAngle(Math.randomInRange(angleMin, angleMax));
					var startRotation = Math.randomInRange(-45, 45);
					var startRotationSpeed = Math.randomInRange(-720, 720);
					var startSize = Math.randomInRange(this.sizeMin, this.sizeMax);
					var lifeTime = Math.randomInRange(this.lifeTimeMin, this.lifeTimeMax);
					spark.emit(position, startVelocity,
						startRotation, startRotationSpeed,
						startSize, lifeTime);
				}
				log.info("Sparks: " + pool.count());
			}

			this.emit = function (position, count = 20) {
				this.emitInDirection(position, -Math.PI, Math.PI, count);
			}

			this.update = function (time) {
				pool.forEach(function (spark) {
					spark.update(time);
				});
			}

			this.draw = function (graphics, camera) {
				pool.forEach(function (spark) {
					graphics.drawInCameraContext(camera, spark);
				});
			}
		}

		function ScreenRepeater(minWidth, maxWidth, minHeight, maxHeight) {

			var repeatValue = function (value, margin, minValue, maxValue) {
				var leftBorder = minValue - margin;
				var rightBorder = maxValue + margin;
				if (value > rightBorder)
					return leftBorder;
				else if (value < leftBorder)
					return rightBorder;
				return value;
			}

			this.repeat = function (position, margin) {
				var repeated = new Vector();
				repeated.x = repeatValue(position.x, margin, minWidth, maxWidth);
				repeated.y = repeatValue(position.y, margin, minHeight, maxHeight);
				return repeated;
			}
		}

		function ScreenDisabler(minWidth, maxWidth, minHeight, maxHeight) {

			var checkBorders = function (value, margin, minValue, maxValue) {
				if (value - margin > maxValue)
					return true;
				else if (value + margin < minValue)
					return true;
				return false;
			}

			this.disable = function (position, margin) {
				if (checkBorders(position.x, margin, minWidth, maxWidth))
					return true;
				if (checkBorders(position.y, margin, minHeight, maxHeight))
					return true;
				return false;
			}
		}

		function Projectile() {

			this.body = new Primitives.Rectangle();
			this.body.width = 20;
			this.body.height = 2;
			this.linearPhysics = new Physics.Linear();
			this.angularPhysics = new Physics.Angular();

			var enabled = false;

			this.getEnabled = function () {
				return enabled;
			}

			this.setEnabled = function (newState) {
				enabled = newState;
				this.linearPhysics.enabled = newState;
			}

			this.shoot = function (shootPosition, shootDirection) {
				this.setEnabled(true);
				this.linearPhysics.stop();
				this.angularPhysics.stop();

				this.linearPhysics.position = shootPosition;
				this.angularPhysics.rotation = shootDirection;
				this.linearPhysics.velocity = new Vector(800, 0);
				this.linearPhysics.velocity.setAngle(Math.radians(this.angularPhysics.rotation));
			}

			this.update = function (time) {
				this.linearPhysics.update(time.delta);
			}

			this.draw = function (graphics, camera) {
				if (enabled) {
					graphics.resetTransformToCamera(camera);
					this.body.draw(graphics, this.linearPhysics.position, Math.radians(this.angularPhysics.rotation));
				}
			}
		}

		function ProjectilesContainer() {

			var pool = new Pooler();

			this.shoot = function (shootPosition, shootDirection) {
				var projectile = pool.get(function () {
					return new Projectile();
				});
				projectile.shoot(shootPosition, shootDirection);
				log.info('Projectiles count: ' + pool.count());
			}

			this.update = function (time, disabler) {
				pool.forEach(function (projectile) {
					projectile.update(time);
				});
			}

			this.draw = function (graphics, camera) {
				pool.forEach(function (projectile) {
					projectile.draw(graphics, camera);
				});
			}

			this.forEach = function (callback) {
				pool.forEach(function (p) {
					callback(p);
				});
			}
		}

		function LocalPosition() {

			this.position = new Vector();
			var absolute = new Vector();

			var parentPos;
			var parentRot;

			this.update = function (parentPosition, parentRotation) {
				parentPos = parentPosition;
				parentRot = parentRotation;

				var rotated = new Vector(this.position.x, this.position.y);
				rotated.addAngle(Math.radians(parentRot));
				absolute = parentPos.add(rotated);
			}

			this.getParentPosition = function () {
				return parentPos;
			}

			this.getParentRotation = function () {
				return parentRot;
			}

			this.getAbsolutePosition = function () {
				return absolute;
			}
		}

		function CannonSparks() {

			var sparks = new SparksContainer();
			sparks.velocityMin = 20;
			sparks.velocityMax = 50;
			sparks.sizeMin = 1;
			sparks.sizeMax = 2;
			sparks.lifeTimeMin = 0.25;
			sparks.lifeTimeMax = 0.5;

			this.fire = function (position, cannonRotation) {
				var sparksCount = Math.randomIntInRange(3, 7);
				var randomRotDeviation = Math.randomInRange(15, 45);
				var rotationStart = cannonRotation - randomRotDeviation;
				var rotationEnd = cannonRotation + randomRotDeviation;
				sparks.emitInDirection(position, Math.radians(rotationStart), Math.radians(rotationEnd), sparksCount);
			}

			this.update = function (time) {
				sparks.update(time);
			}

			this.draw = function (graphics, camera) {
				sparks.draw(graphics, camera);
			}
		}

		function Cannon() {

			var reloaded = true;
			var reloadTime = 0.2;

			var projectiles;
			var sparks = new CannonSparks();
			var local = new LocalPosition();
			var pivot = new DebugDot();

			var timeAccu = new TimeAccumulator();
			timeAccu.setTickEvent(reloadTime, function () {
				reloaded = true;
				timeAccu.enabled = false;
			});

			this.initialize = function (projectilesContainer, shipHeight, shipBaseLength) {
				projectiles = projectilesContainer;
				local.position.x = 2 * shipHeight / 3;
			}

			this.shoot = function () {
				if (reloaded) {
					var mountPosition = local.getAbsolutePosition();
					var shootDirection = local.getParentRotation();
					projectiles.shoot(mountPosition, shootDirection);
					sparks.fire(mountPosition, shootDirection);

					reloaded = false;
					timeAccu.enabled = true;
				}
			}

			this.updatePosition = function (shipPosition, shipRotation) {
				local.update(shipPosition, shipRotation);
			}

			this.updateState = function (time) {
				sparks.update(time);
				timeAccu.add(time.delta);
			}

			this.draw = function (graphics, camera) {
				var mountPosition = local.getAbsolutePosition();
				pivot.drawDebug(graphics, camera, mountPosition);

				sparks.draw(graphics, camera);
			}
		}

		function PropulsionFlames() {

			var flameWidth = 10;
			var flameThickness = 2;

			var flame1 = new Primitives.Rectangle();
			flame1.width = flameWidth;
			flame1.height = flameThickness;

			var flame2 = new Primitives.Rectangle();
			flame2.width = flameWidth;
			flame2.height = flameThickness;

			var flame1Local = new LocalPosition();
			var flame2Local = new LocalPosition();

			this.initialize = function () {
				var halfWidth = flameWidth / 2;
				flame1Local.position.x = -halfWidth;
				flame1Local.position.y = -flameThickness;
				flame2Local.position.x = -halfWidth;
				flame2Local.position.y = flameThickness;
			}

			this.updatePosition = function (propulsionMountPosition, propulsionRotation) {
				flame1Local.update(propulsionMountPosition, propulsionRotation);
				flame2Local.update(propulsionMountPosition, propulsionRotation);
			}

			this.draw = function (graphics, camera) {
				graphics.resetTransformToCamera(camera);
				flame1.draw(graphics, flame1Local.getAbsolutePosition(), Math.radians(flame1Local.getParentRotation()));
				graphics.resetTransformToCamera(camera);
				flame2.draw(graphics, flame2Local.getAbsolutePosition(), Math.radians(flame2Local.getParentRotation()));
			}
		}

		function Propulsion() {

			var propulsionFlames = new PropulsionFlames();
			var local = new LocalPosition();

			var visible = false;

			var timeAccu = 0;
			var blinkTime = 0.025;

			var pivot = new DebugDot();

			this.initialize = function (shipHeight, shipBaseLength) {
				local.position.x = -shipHeight / 3;
				propulsionFlames.initialize();
			}

			this.updatePosition = function (shipPosition, shipRotation) {
				local.update(shipPosition, shipRotation);
				var propPosition = local.getAbsolutePosition();
				var propRotation = local.getParentRotation();
				propulsionFlames.updatePosition(propPosition, propRotation);
			}

			this.updateState = function (enabled, timeDelta) {
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

			this.draw = function (graphics, camera) {
				var mountPosition = local.getAbsolutePosition();
				pivot.drawDebug(graphics, camera, mountPosition);

				if (visible) {
					propulsionFlames.draw(graphics, camera);
				}
			}
		}

		function Ship() {

			var that = this;

			this.body = new Primitives.Triangle();
			this.body.setSizes(30, 15);

			var pivot = new DebugDot();

			this.linearPhysics = new Physics.Linear();
			this.linearPhysics.drag = 0.5;
			var baseLinearForce = 120;
			this.angularPhysics = new Physics.Angular();
			var baseAngularSpeed = 270;

			var propulsion = new Propulsion();
			var cannon = new Cannon();

			var enabled = true;

			this.getEnabled = function () {
				return enabled;
			}

			this.setEnabled = function (state) {
				enable = false;
				this.linearPhysics.enabled = state;
				this.angularPhysics.enabled = state;
			}

			this.initialize = function (projectilesContainer) {
				propulsion.initialize(this.body.height, this.body.baseLength);
				cannon.initialize(projectilesContainer, this.body.height, this.body.baseLength);
				this.setEnabled(true);
			}

			var updateMovement = function (keys, time) {
				// rotation movement
				var angularVelocity = 0;
				if (keys.getKey(keyMap.LEFT).isDown() || keys.getKey(keyMap.A).isDown())
					angularVelocity -= baseAngularSpeed;
				if (keys.getKey(keyMap.RIGHT).isDown() || keys.getKey(keyMap.D).isDown())
					angularVelocity += baseAngularSpeed;
				that.angularPhysics.velocity = angularVelocity;
				that.angularPhysics.update(time.delta);

				// linear movement
				var accelerating = false;
				var force = Vector.zeros();
				if (keys.getKey(keyMap.UP).isDown() || keys.getKey(keyMap.W).isDown()) {
					accelerating = true;
					force.x = baseLinearForce;
				}
				force.setAngle(Math.radians(that.angularPhysics.rotation));
				that.linearPhysics.force = force;
				that.linearPhysics.update(time.delta);

				return accelerating;
			}

			var updateShooting = function (keys, time) {
				cannon.updatePosition(that.linearPhysics.position, that.angularPhysics.rotation);
				cannon.updateState(time);
				if (keys.getKey(keyMap.SPACE).isDown())
					cannon.shoot();
			}

			var updatePropulsion = function (keys, time, accelerating) {
				propulsion.updatePosition(that.linearPhysics.position, that.angularPhysics.rotation);
				propulsion.updateState(accelerating, time.delta);
			}

			this.update = function (input, time) {
				if (!enabled)
					return;

				var keys = input.getKeys();
				var accelerating = updateMovement(keys, time);
				updateShooting(keys, time);
				updatePropulsion(keys, time, accelerating);
			}

			this.draw = function (graphics, camera) {
				if (!enabled)
					return;

				var rotation = Math.radians(this.angularPhysics.rotation);

				graphics.resetTransformToCamera(camera);
				this.body.draw(graphics, this.linearPhysics.position, rotation);
				propulsion.draw(graphics, camera, this.linearPhysics.position, rotation);
				cannon.draw(graphics, camera);

				pivot.drawDebug(graphics, camera, this.linearPhysics.position);
			}
		}


		function Scene() {

			var projectiles = new ProjectilesContainer();
			var ship = new Ship();
			var sparks = new SparksContainer();

			var screenRepeater = null;
			var screenDisabler = null;

			var initializeKeys = function (keys) {
				var keyCodes = [keyMap.UP, keyMap.DOWN, keyMap.LEFT, keyMap.RIGHT,
				keyMap.W, keyMap.A, keyMap.S, keyMap.D,
				keyMap.SPACE];
				keys.addKeys(keyCodes);
			}

			this.start = function (gameStatus, camera, input) {
				camera.setPointOfViewToCenter();

				this.width = gameStatus.getWidth();
				this.height = gameStatus.getHeight();
				var halfWidth = this.width / 2;
				var halfHeight = this.height / 2;

				screenRepeater = new ScreenRepeater(-halfWidth, halfWidth, -halfHeight, halfHeight);
				screenDisabler = new ScreenDisabler(-halfWidth, halfWidth, -halfHeight, halfHeight);

				ship.initialize(projectiles);
				initializeKeys(input.getKeys());
			};

			this.update = function (gameStatus, camera, input, time) {
				if (gameStatus.paused)
					return;

				ship.update(input, time);
				var clampedPosition = screenRepeater.repeat(ship.linearPhysics.position, 20);
				ship.linearPhysics.position = clampedPosition;

				projectiles.update(time, screenDisabler);
				projectiles.forEach(function (projectile) {
					if (screenDisabler.disable(projectile.linearPhysics.position, 20))
						projectile.setEnabled(false);
				});

				if (input.getMouse().isPressed()) {
					var position = input.getMouse().getInGamePosition(camera);
					log.info("emit: [" + position.x + ", " + position.y + "]");
					sparks.emit(new Vector(position.x, position.y));
				}

				sparks.update(time);
			}

			this.render = function (graphics, camera) {
				ship.draw(graphics, camera);
				projectiles.draw(graphics, camera);
				sparks.draw(graphics, camera);
			}
		}

		return Scene;
	})

