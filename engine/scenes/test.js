define(['commons/color'], function(Color){
	
	function Scene() {
	
		var that = this;

		var c = Color.random();
		
		this.start = function(gameStatus, camera, input) {
			this.width = camera.getWidth();
			this.height = camera.getHeight();
			camera.setPointOfViewToCenter();

			log.info(c.getA());
		};
		
		this.update = function(gameStatus, camera, input, time) {
		}

		this.render = function(graphics, camera) {
			graphics.resetTransformToCamera(camera);
			graphics.drawing.drawCircle(0, 0, 100, 'red');
			graphics.drawing.drawCircle(0, 0, 50, c.toText());
		}
	}
	
	return Scene;
})

