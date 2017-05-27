define(['commons/vector', 'commons/primitives'], function(Vector, Primitives) {
	
	function Spark() {

		var particle = new Particle();
		particle.body = new Primitives.Square();
		particle.enabled = false;
		var body = particle.body;

		this.sizeOverLifetime = true;
		var startSize = 10;
		this.lifetime = 1;
		var timeAccu = 0;

		this.emit = function(sparkStartPosition, sparkStartVelocity, 
				sparkStartRotation, sparkStartRotationSpeed,
				sparkStartSize, sparkLifetime) {
			timeAccu = 0;
			particle.enabled = true;
			this.lifetime = sparkLifetime;
			startSize = sparkStartSize;
			body.size = sparkStartSize;
			particle.init(sparkStartPosition, sparkStartRotation);
			particle.velocity = sparkStartVelocity;
			particle.rotationSpeed = sparkStartRotationSpeed;
		}

		this.disable = function() {
			particle.enabled = false;
		}

		this.update = function(time) {
			if (particle.enabled) {
				var t = timeAccu / this.lifetime;
				if (this.sizeOverLifetime) {
					var currentSize = Math.lerp(t, startSize, 0);
					body.size = currentSize;
				}

				timeAccu += time.delta;
				if (timeAccu > this.lifetime)
					this.disable();
				
				particle.update(time);
			}
		}

		this.draw = function(graphics) {
			particle.draw(graphics);
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
				this.body.draw(graphics, this.position, this.rotation);
			}
		}
	}
	
	return {
		Particle : Particle,
		Spark : Spark
	};
});