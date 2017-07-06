define(['commons/color', 'commons/particles', 'commons/vector', 'commons/primitives'], function(Color, Particles, Vector, Primitives){
	
	function Scene() {
	
		var that = this;

		var c = Color.random();

		var p = new Particles.Particle();
		p.body = new Primitives.Square();
		p.body.size = 20;
		
		this.start = function(gameStatus, camera, input) {
			this.width = camera.getWidth();
			this.height = camera.getHeight();
			camera.setPointOfViewToCenter();

			p.init(new Vector(0, 0), 45);
		};
		
		this.update = function(gameStatus, camera, input, time) {
			p.update(time);
		}

		this.render = function(graphics, camera) {
			//graphics.resetTransformToCamera(camera);
			//graphics.drawing.drawCircle(0, 0, 100, 'red');
			//graphics.drawing.drawCircle(0, 0, 50, c.toText());
			graphics.resetTransformToCamera(camera);
			p.draw(graphics);
		}
	}
	
	return Scene;
})

