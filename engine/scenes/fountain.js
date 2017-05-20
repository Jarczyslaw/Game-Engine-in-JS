define(['commons/vector'], function(Vector){
	
	function Particle() {
		
		this.size = 10;
		
		this.position = new Vector();
		this.velocity = new Vector();
		this.drag = 0;
		this.gravity = new Vector(0, 300);
		
		this.enabled = true;
		
		this.setRandomSize = function() {
			this.size = Math.random() * 10 + 5;
		};
		
		this.fire = function(width, height) {
			this.setRandomSize();
			this.position.x = width / 2;
			this.position.y = height;
			
			this.velocity.setMagnitude(Math.random() * 100 + 500);
			var range = Math.radians(30); 
			this.velocity.setAngle(-Math.PI / 2 + Math.random() * range - range / 2);
		};
		
		this.update = function(time, width, height) {
			if(this.enabled) {
				var accel = new Vector();
				accel.x = -this.drag * this.velocity.x + this.gravity.x;
				accel.y = -this.drag * this.velocity.y + this.gravity.y;
				
				this.position.x = this.position.x + time.delta * this.velocity.x;
				this.position.y = this.position.y + time.delta * this.velocity.y;
				
				this.velocity.x = this.velocity.x + time.delta * accel.x;
				this.velocity.y = this.velocity.y + time.delta * accel.y;
				
				if(this.position.x - this.size > width)
					this.enabled = false;
				if(this.position.x + this.size < 0)
					this.enabled = false;
				if(this.position.y - this.size > height)
					this.enabled = false;

			}
		};
		
		this.draw = function(graphics) {
			if(this.enabled) {
				graphics.ctx.beginPath();
				graphics.ctx.arc(this.position.x, this.position.y, this.size, 2 * Math.PI, false);
				graphics.ctx.fillStyle = 'white';
				graphics.ctx.fill();
			}
		};
	}
	
	function World() {
		
		var that = this;
		
		var particles = [];
		
		var getParticle = function() {
			var result = null;
			for(let i = 0;i < particles.length;i++) {
				if (!particles[i].enabled) {
					result = particles[i];
					particles[i].enabled = true;
					return particles[i];
				}
			}
			
			var newParticle = new Particle();
			particles.push(newParticle);
			return newParticle;
		}
		
		var drawCount = function(ctx) {
			ctx.font = 'bold 20px Arial';
			ctx.fillStyle = 'red';
			ctx.fillText('Count: ' + particles.length, 0, 150);
		}
		
		this.start = function(gameInfo) {
			this.width = gameInfo.getWidth();
			this.height = gameInfo.getHeight();
		};
		
		this.update = function(gameInfo, input, time) {
			var keys = input.getKeys();
			
			if (keys.getKey(keyMap.UP).isDown()) {
				var particle = getParticle();
				particle.fire(this.width, this.height);
			}
			
			for(let i = 0;i < particles.length;i++)
				particles[i].update(time, this.width, this.height);
		}
		
		this.render = function(graphics) {
			for(let i = 0;i < particles.length;i++) 
				particles[i].draw(graphics);
			
			drawCount(graphics.ctx);
		}
	} 
	
	return World;
})

