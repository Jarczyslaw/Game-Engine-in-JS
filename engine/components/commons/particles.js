define(['commons/vector', 'commons/primitives', 'commons/physics'], function(Vector, Primitives, Physics) {
	
	function Spark() {
		Particle.call(this); // 'inherit' from particle
		this.body = new Primitives.Square();

		this.sizeOverLifetime = true;
		this.lifetime = 1;

		var startSize = 10;
		var timeAccu = 0;

		this.emit = function(sparkStartPosition, sparkStartVelocity, 
				sparkStartRotation, sparkStartRotationSpeed,
				sparkStartSize, sparkLifetime) {
			timeAccu = 0;
			lifetime = sparkLifetime;
			startSize = sparkStartSize;
			this.init(sparkStartPosition, sparkStartRotation);
			this.body.size = sparkStartSize;
			this.linearPhysics.velocity = sparkStartVelocity;
			this.angularPhysics.velocity = sparkStartRotationSpeed;
			this.setEnabled(true);
		}

		this.update = function(time) {
			if (this.getEnabled()) {
				var t = timeAccu / this.lifetime;
				if (this.sizeOverLifetime) {
					var currentSize = Math.lerp(t, startSize, 0);
					this.body.size = currentSize;
				}

				timeAccu += time.delta;
				if (timeAccu > this.lifetime)
					this.setEnabled(false);
			}
			this.linearPhysics.update(time.delta);
			this.angularPhysics.update(time.delta);
		}
	}

	function Particle() {
		
		this.body = new Primitives.Circle();
		
		this.linearPhysics = new Physics.Linear();
		this.angularPhysics = new Physics.Angular();
		
		var enabled = false;
		
		this.init = function(position, rotation) {
			this.linearPhysics.position = position;
			this.linearPhysics.stop();

			this.angularPhysics.rotation = rotation;
			this.angularPhysics.stop();
		}

		this.setEnabled = function(newEnabled) {
			enabled = newEnabled;
			this.linearPhysics.enabled = enabled;
			this.angularPhysics.enabled = enabled;
		}

		this.getEnabled = function() {
			return enabled;
		}
		
		this.update = function(time) {
			this.linearPhysics.update(time.delta);
			this.angularPhysics.update(time.delta);
		}
		
		this.draw = function(graphics) {
			if (enabled) {
				this.body.draw(graphics, this.linearPhysics.position, Math.radians(this.angularPhysics.rotation));
			}
		}
	}
	
	return {
		Particle : Particle,
		Spark : Spark
	};
});