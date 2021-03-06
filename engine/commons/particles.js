define(['commons/vector', 'commons/primitives', 'commons/physics'], function (Vector, Primitives, Physics) {

	class Particle {
		constructor(body) {
			this.body = body;
			this.linearPhysics = new Physics.Linear();
			this.angularPhysics = new Physics.Angular();
			let enabled = false;

			this.init = function (position, rotation) {
				this.linearPhysics.position = position;
				this.linearPhysics.stop();
				this.angularPhysics.rotation = rotation;
				this.angularPhysics.stop();
			};

			this.setEnabled = function (newEnabled) {
				enabled = newEnabled;
				this.linearPhysics.enabled = enabled;
				this.angularPhysics.enabled = enabled;
			};

			this.getEnabled = function () {
				return enabled;
			};

			this.update = function (time) {
				this.linearPhysics.update(time.delta);
				this.angularPhysics.update(time.delta);
			};

			this.draw = function (graphics) {
				if (enabled) {
					this.body.draw(graphics, this.linearPhysics.position, Math.radians(this.angularPhysics.rotation));
				}
			};
		}
	}

	class Spark extends Particle {
		constructor(body) {
			super(body);
			this.sizeOverLifetime = true;
			this.lifetime = 1;
			let startSize = 10;
			let timeAccu = 0;

			this.emit = function (sparkStartPosition, sparkStartVelocity, sparkStartRotation, sparkStartRotationSpeed, sparkStartSize, sparkLifetime) {
				timeAccu = 0;
				this.lifetime = sparkLifetime;
				startSize = sparkStartSize;
				this.init(sparkStartPosition, sparkStartRotation);
				this.body.setSize(sparkStartSize);
				this.linearPhysics.velocity = sparkStartVelocity;
				this.angularPhysics.velocity = sparkStartRotationSpeed;
				this.setEnabled(true);
			};

			this.update = function (time) {
				if (this.getEnabled()) {
					var t = timeAccu / this.lifetime;
					if (this.sizeOverLifetime) {
						let currentSize = Math.lerp(t, startSize, 0);
						this.body.setSize(currentSize);
					}
					timeAccu += time.delta;
					if (timeAccu > this.lifetime)
						this.setEnabled(false);
				}
				this.linearPhysics.update(time.delta);
				this.angularPhysics.update(time.delta);
			};
		}
	}

	return {
		Particle: Particle,
		Spark: Spark
	};
});