define(['commons/vector', 'commons/primitives'], function(Vector, Primitives) {
	
	function Particle() {
		
		this.body = new Primitives.Circle();
		
		this.position = new Vector();
		this.velocity = new Vector();
		this.acceleration = new Vector();
		
		this.force = new Vector();
		this.impulse = new Vector();
		
		this.drag = 0;
		this.gravity = new Vector(0, 100);
		
		this.enabled = true;
		
		this.init = function(position) {
			this.position = position;
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
				
				this.impulse.zero();
				
				this.body.position = this.position;
			}
		}
		
		this.draw = function(graphics) {
			if (this.enabled) {
				this.body.draw(graphics.ctx);
			}
		}
	}
	
	return Particle;
});