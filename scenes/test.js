define(['commons/color', 'commons/particles', 'commons/vector', 'commons/primitives'], 
	function(Color, Particles, Vector, Primitives){
	
	function Test() {

		this.test = function(callback) {
			var obj = callback();
			obj.foo();
		}

	}

	function Bar() {
		this.foo = function() {
			console.log("FOO");
		}
	}

	function Scene() {
	
		var c = Color.white();

		var cameraSpeed = 50;

		var test = new Test();

		this.start = function(gameStatus, camera, input) {
			this.width = camera.getWidth();
			this.height = camera.getHeight();
			camera.setPointOfViewToCenter();

			test.test(function() {
				return new Bar();
			});
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

