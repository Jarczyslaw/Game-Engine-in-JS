define(function(){
	
	function World() {
	
		var that = this;
		
		this.start = function(gameStatus, camera, input) {
			this.width = camera.getWidth();
			this.height = camera.getHeight();
			camera.setPointOfViewToCenter();
		};
		
		this.update = function(gameStatus, camera, input, time) {
		}

		this.render = function(graphics, camera) {
			graphics.resetTransformToCamera(camera);
			graphics.drawing.drawCircle(0, 0, 10, 'white');
		}
	}
	
	return World;
})

