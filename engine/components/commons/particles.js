define(['commons/vector', 'commons/primitives'], function(Vector, Primitives) {
	
	function Spark() {

		this.particle = new Particle();
		this.particle.body = new Primitives.Square();

		this.sizeOverLifetime = true;
		this.lifetime = 1;

		var startSize = 10;
		var timeAccu = 0;

		this.emit = function(sparkStartPosition, sparkStartVelocity, 
				sparkStartRotation, sparkStartRotationSpeed,
				sparkStartSize, sparkLifetime) {
			timeAccu = 0;
			this.particle.enabled = true;
			lifetime = sparkLifetime;
			startSize = sparkStartSize;
			this.particle.body.size = sparkStartSize;
			this.particle.init(sparkStartPosition, sparkStartRotation);
			this.particle.velocity = sparkStartVelocity;
			this.particle.rotationSpeed = sparkStartRotationSpeed;
		}

		this.disable = function() {
			this.particle.enabled = false;
		}

		this.update = function(time) {
			if (this.particle.enabled) {
				var t = timeAccu / this.lifetime;
				if (this.sizeOverLifetime) {
					var currentSize = Math.lerp(t, startSize, 0);
					this.particle.body.size = currentSize;
				}

				timeAccu += time.delta;
				if (timeAccu > this.lifetime)
					this.disable();
				
				this.particle.update(time);
			}
		}

		this.draw = function(graphics) {
			this.particle.draw(graphics);
		}
	}

	function Particle() {
		
		this.body = new Primitives.Circle();
		
		this.rotation = 0;
		this.rotationSpeed = 0;

		this.position = new Vector();
		this.velocity = new Vector();
		this.acceleration = new Vector();
		
		this.force = new Vector();
		this.impulse = new Vector();
		
		this.drag = 1;
		this.gravity = new Vector(0, 100);
		
		this.enabled = false;
		
		this.init = function(position, rotation) {
			this.position = position;
			this.rotation = rotation;
			this.velocity.zero();
			this.acceleration.zero();
			this.force.zero();
			this.impulse.zero();
			
			this.enabled = true;
		}
		
		this.update = function(time) {
			if (this.enabled) {
				var externalForces = this.force.add(this.impulse).add(this.gravity);
				this.acceleration = this.velocity.multiply(-this.drag).add(externalForces);
				this.position = this.position.add(this.velocity.multiply(time.delta));
				this.velocity = this.velocity.add(this.acceleration.multiply(time.delta));
				
				this.rotation += this.rotationSpeed * time.delta;

				this.impulse.zero();
			}
		}
		
		this.draw = function(graphics) {
			if (this.enabled) {
				this.body.draw(graphics, this.position, Math.radians(this.rotation));
			}
		}
	}
	
	return {
		Particle : Particle,
		Spark : Spark
	};
});