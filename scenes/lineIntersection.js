define(['commons/vector', 'commons/primitives', 'commons/color', 'commons/collisions'], function (Vector, Primitives, Color, Collisions) {

	function Line() {
		this.body = new Primitives.Line();
		this.start = new Vector();
		this.end = new Vector();
		this.body.width = 1;

		this.set = function (selected) {
			if (selected)
				this.body.color = Color.red();
			else
				this.body.color = Color.white();
		}
	}

	function Scene() {

		var testLine = new Line();
		testLine.body.width = 1;
		var lines = [];

		var intersections = [];

		var addLine = function (start, end) {
			var newLine = new Line();
			newLine.start = start;
			newLine.end = end;
			lines.push(newLine);
		}

		addLine(new Vector(100, 500), new Vector(200, 100));
		addLine(new Vector(500, 100), new Vector(700, 200));
		addLine(new Vector(300, 500), new Vector(500, 200));

		this.start = function (gameStatus, camera, input) {
			this.gameWidth = gameStatus.getWidth();
			this.gameHeight = gameStatus.getHeight();

			this.screenWidth = camera.getWidth();
			this.screenHeight = camera.getHeight();
		};

		this.update = function (gameStatus, camera, input, time) {
			var mouse = input.getMouse();
			var mousePos = mouse.getPosition();
			testLine.start.set(mousePos.x - 50, mousePos.y - 50);
			testLine.end.set(mousePos.x + 50, mousePos.y + 50);

			intersections = [];
			for (let i = 0; i < lines.length; i++) {
				var l = lines[i];
				var test = Collisions.lineIntersection(testLine.start, testLine.end, l.start, l.end);
				if (test != null) {
					l.set(true);
					intersections.push(test);
				} else
					l.set(false);
			}
		}

		this.render = function (graphics, camera) {
			graphics.resetTransform();
			testLine.body.draw(graphics, testLine.start, testLine.end);

			// draw lines
			for (let i = 0; i < lines.length; i++) {
				var l = lines[i];
				graphics.resetTransform();
				l.body.draw(graphics, l.start, l.end);
			}

			// draw intersections
			for (let i = 0; i < intersections.length; i++) {
				graphics.resetTransform();
				var p = intersections[i];
				graphics.drawing.drawCircle(p.x, p.y, 5, 'green');
			}
		}
	}

	return Scene;
})

