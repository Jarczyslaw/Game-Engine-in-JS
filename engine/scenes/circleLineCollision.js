define(['commons/primitives', 'commons/vector', 'commons/color'], function(Primitives, Vector, Color){
	
	function Scene() {
	
        var circle = new Primitives.Circle();
        circle.radius = 30;
        var circlePosition = new Vector(0, 0);

        var line = new Primitives.Line();
        var lineStart = new Vector(500, 400);
        var lineEnd = new Vector(200, 100);

        var d = new Vector(0, 0); // projection

        this.checkCollision = function(circlePosition, circleRadius, lineStart, lineEnd) {
            // get circle center projection on line
            var lineVect = lineEnd.substract(lineStart);
            var lineLen = lineVect.sqrMagnitude();
            var circleToStart = circlePosition.substract(lineStart);
            d = lineStart.add(lineVect.multiply(circleToStart.dotProduct(lineVect) / lineVect.dotProduct(lineVect))); // projection
            // check if projection is in the segment of line
            if ((lineStart.x < d.x && d.x < lineEnd.x) ||
                (lineStart.x > d.x && d.x > lineEnd.x) ||
                (lineStart.y < d.y && d.y < lineEnd.y) ||
                (lineStart.y > d.y && d.y > lineEnd.y)) {
                    // check if projection is in circle
                    var dr = circlePosition.substract(d);
                    return dr.magnitude() < circleRadius
                }
            // check if line points are inside the circle
            if (circlePosition.substract(lineStart).magnitude() < circleRadius ||
                circlePosition.substract(lineEnd).magnitude() < circleRadius)
                return true;
            return false;
        }

		this.start = function(gameStatus, camera, input) {
			this.gameWidth = gameStatus.getWidth();
			this.gameHeight = gameStatus.getHeight();

			this.screenWidth = camera.getWidth();
			this.screenHeight = camera.getHeight();
		};
		
		this.update = function(gameStatus, camera, input, time) {
            var mouse = input.getMouse();
            var mousePosition = mouse.getPosition();
            circlePosition.set(mousePosition.x, mousePosition.y);

            if (this.checkCollision(circlePosition, circle.size, lineStart, lineEnd))
                line.color = Color.red();        
            else
                line.color = Color.white();
		}

		this.render = function(graphics, camera) {
			graphics.resetTransformToCamera(camera);
            circle.draw(graphics, circlePosition, 0);
            graphics.resetTransformToCamera(camera);
            line.draw(graphics, lineStart, lineEnd);

            graphics.resetTransformToCamera(camera);
            graphics.drawing.drawCircle(d.x, d.y, 5, 'green');
		}
	}
	
	return Scene;
})

