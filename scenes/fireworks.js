define(['commons/vector', 'commons/particles', 'commons/primitives', 'commons/pooler', 'commons/color'],
	function (Vector, Particles, Primitives, Pooler, Color) {

		function Scene() {

			var that = this;

			var visibleObjects = 0;

			var instantiateParticle = function () {
				var body = new Primitives.Circle();
				body.radius = Math.randomInRange(5, 20);
				body.color = Color.random();
				var newParticle = new Particles.Particle(body);
				return newParticle;
			}

			var pooler = new Pooler();

			var fireOnClick = function (position) {
				log.info("fire on click");
				var particlesToFire = [];
				for (let i = 0; i < 50; i++) {
					var p = pooler.get(instantiateParticle);
					if (p != null)
						particlesToFire.push(p);
					else
						break;
				}

				for (let i = 0; i < particlesToFire.length; i++) {
					var p = particlesToFire[i];
					p.init(new Vector(position.x, position.y), 0);

					p.linearPhysics.gravity = new Vector(0, 500);
					var startVelocity = new Vector();
					startVelocity.setMagnitude(Math.random() * 400 + 100);
					startVelocity.setAngle(Math.random() * 2 * Math.PI);

					p.linearPhysics.velocity = startVelocity;
					p.setEnabled(true);
				}
			}

			var fireOnKey = function (particle) {
				log.info("fire on key");
				var particle = pooler.get(instantiateParticle);
				if (particle == null)
					return;

				particle.init(new Vector(that.width / 2, that.height), 0);
				particle.linearPhysics.gravity = new Vector(0, 300);

				var startVelocity = new Vector();
				var range = Math.radians(30);
				startVelocity.setMagnitude(Math.random() * 100 + 700);
				startVelocity.setAngle(-Math.PI / 2 + Math.random() * range - range / 2);

				particle.linearPhysics.velocity = startVelocity;
			}

			var drawCount = function (graphics) {
				var lines = [];
				lines.push('Count: ' + pooler.count());
				lines.push('Visible: ' + visibleObjects);
				graphics.text.setTextBlock(lines, 0, 170, 20, 'red');
			}

			var onOutOfScreen = function (particle) {
				if (particle.linearPhysics.position.x - particle.body.radius > that.width)
					particle.setEnabled(false);
				else if (particle.linearPhysics.position.x + particle.body.radius < 0)
					particle.setEnabled(false);
				else if (particle.linearPhysics.position.y - particle.body.radius > that.height)
					particle.setEnabled(false);

				if (particle.getEnabled())
					visibleObjects = visibleObjects + 1;
			}

			this.start = function (gameStatus, camera, input) {
				this.width = camera.getWidth();
				this.height = camera.getHeight();

				input.getKeys().addKey(keyMap.UP);
			};

			this.update = function (gameStatus, camera, input, time) {
				if (!gameStatus.paused) {
					var keys = input.getKeys();
					var mouse = input.getMouse();

					if (keys.getKey(keyMap.UP).isDown())
						fireOnKey();

					if (mouse.isPressed())
						fireOnClick(mouse.getPosition());

					visibleObjects = 0;
					pooler.forEach(function (particle) {
						particle.update(time);
						onOutOfScreen(particle);
					});
				}
			}

			this.render = function (graphics, camera) {
				pooler.forEach(function (particle) {
					graphics.resetTransform();
					particle.draw(graphics);
				});

				graphics.resetTransform();
				drawCount(graphics);
			}
		}

		return Scene;
	});