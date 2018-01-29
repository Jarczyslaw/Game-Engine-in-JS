define(['commons/color', 'commons/particles', 'commons/vector', 'commons/primitives'], 
	function(Color, Particles, Vector, Primitives){
	
	function Scene() {
	
		var c = Color.white();

		var cameraSpeed = 50;

		this.start = function(gameStatus, camera, input) {
			this.width = camera.getWidth();
			this.height = camera.getHeight();
			camera.setPointOfViewToCenter();
		};
		
		this.update = function(gameStatus, camera, input, time) {
			var delta = time.delta * 50;
			camera.moveBy(delta, 0);
		}

		this.render = function(graphics, camera) {
			graphics.resetTransformToCamera(camera);
			graphics.drawing.drawCircle(0, 0, 100, c.toText());
		}
	}
	
	return Scene;
})

