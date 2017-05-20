define(['commons/vector', 'commons/particle', 'commons/pooler'], function(Vector, Particle, Pooler) {
	
	function World() {
		
		var that = this;
		
		var visibleObjects = 0;
		
		var instantiateParticle = function(particle) {
			particle.body.size = randomInRange(5, 20);
			particle.body.color = getRandomColor();
		}
		
		var pooler = new Pooler(Particle, instantiateParticle);
		
		var fireOnClick = function(position) {
			var particlesToFire = [];
			for(let i = 0;i < 50;i++) {
				var p = pooler.get();
				if (p != null)
					particlesToFire.push(p);
				else
					break;
			}
			
			for(let i = 0;i < particlesToFire.length;i++) {
				var p = particlesToFire[i];
				p.init(new Vector(position.x, position.y));
				
				p.gravity = new Vector(0, 500);
				var startVelocity = new Vector();
				startVelocity.setMagnitude(Math.random() * 400 + 100);
				startVelocity.setAngle(Math.random() * 2 * Math.PI);
				
				p.velocity = startVelocity;
			}
		}
		
		var fireOnKey = function(particle) {
			var particle = pooler.get();
				if (particle == null)
					return;
			
			particle.init(new Vector(that.width / 2, that.height));
			particle.gravity = new Vector(0, 300);
			
			var startVelocity = new Vector();
			var range = Math.radians(30); 
			startVelocity.setMagnitude(Math.random() * 100 + 550);
			startVelocity.setAngle(-Math.PI / 2 + Math.random() * range - range / 2);
			
			particle.velocity = startVelocity;
		}
		
		var drawCount = function(ctx) {
			ctx.font = 'bold 20px Arial';
			ctx.fillStyle = 'red';
			ctx.fillText('Count: ' + pooler.count(), 0, 150);
			ctx.fillText('Visible: ' + visibleObjects, 0, 170);
		}
		
		var onOutOfScreen = function(particle) {
			if(particle.position.x - particle.body.size > that.width)
				particle.enabled = false;
			if(particle.position.x + particle.body.size < 0)
				particle.enabled = false;
			if(particle.position.y - particle.body.size > that.height)
				particle.enabled = false;
			
			if (particle.enabled)
				visibleObjects = visibleObjects + 1;
		}
		
		this.start = function(gameInfo) {
			this.width = gameInfo.getWidth();
			this.height = gameInfo.getHeight();
		};
		
		this.update = function(gameInfo, input, time) {
			var keys = input.getKeys();
			var mouse = input.getMouse();
			
			if (keys.getKey(keyMap.UP).isDown())
				fireOnKey();
			
			if (mouse.isPressed())
				fireOnClick(mouse.getPosition());
			
			visibleObjects = 0;
			pooler.forEach(function(particle){
				particle.update(time);
				onOutOfScreen(particle);
			});
		}
		
		this.render = function(graphics) {
			pooler.forEach(function(particle) {
				particle.draw(graphics);
			});
			
			drawCount(graphics.ctx);
		}
	}
	
	return World;
});