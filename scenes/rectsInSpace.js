define(['commons/vector', 'commons/primitives'], function (Vector, Primitives) {

	function Rect3D() {
		this.rect = new Primitives.Square();
		this.position;
		this.z = 0;

		this.randomize = function () {
			this.position = new Vector(Math.randomInRange(-500, 500), Math.randomInRange(-500, 500));
			this.z = Math.randomInRange(0, 10000);
			this.rect.size = Math.randomInRange(40, 80);
		}
	}

	function Scene() {

		var squares = [];

		var focalLength = 1000;

		for (let i = 0; i < 100; i++) {
			var newSquare = new Rect3D();
			newSquare.randomize();
			squares.push(newSquare);
		}

		this.start = function (gameStatus, camera, input) {
			this.width = camera.getWidth();
			this.height = camera.getHeight();
			camera.setPointOfViewToCenter();
		};

		this.update = function (gameStatus, camera, input, time) {
			for (let i = 0; i < squares.length; i++) {
				var s = squares[i];
				s.z -= time.delta * 2000;

				if (s.z < 0)
					s.z = 10000;
			}
		}

		this.render = function (graphics, camera) {
			graphics.resetTransformToCamera(camera);

			for (let i = 0; i < squares.length; i++) {
				var s = squares[i];
				var perspective = focalLength / (focalLength + s.z);

				graphics.ctx.save();
				graphics.ctx.translate(s.position.x * perspective, s.position.y * perspective);
				graphics.ctx.scale(perspective, perspective);

				s.rect.draw(graphics, new Vector(0, 0), 0);

				graphics.ctx.restore();
			}
		}
	}

	return Scene;
})

