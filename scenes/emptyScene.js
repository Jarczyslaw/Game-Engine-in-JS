define(function () {

	function Scene() {

		// called once at game start
		this.start = function (gameStatus, camera, input) {
			this.gameWidth = gameStatus.getWidth();
			this.gameHeight = gameStatus.getHeight();

			this.screenWidth = camera.getWidth();
			this.screenHeight = camera.getHeight();

			camera.setPointOfViewToCenter(); // set POV to canvas center
		};

		// called once every frame before render
		this.update = function (gameStatus, camera, input, time) {
			camera.moveTo(0, 0); // move camera to position
		}

		// called once per frame
		this.render = function (graphics, camera) {
			graphics.resetTransformToCamera(camera); // reset view to current camera
		}
	}

	return Scene;
})

