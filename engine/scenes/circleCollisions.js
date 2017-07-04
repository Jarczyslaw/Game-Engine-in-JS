define(['commons/primitives', 'commons/vector', 'commons/color'], function(Primitives, Vector, Color){
	
	function Scene() {
	
        var circle = new Primitives.Circle();
        circle.radius = 30;
        var circlePosition = new Vector(0, 0);

        var line = new Primitives.Line();
        var lineStart = new Vector(600, 500);
        var lineEnd = new Vector(500, 100);
        var d = new Vector(0, 0); // projection

        var rectangle = new Primitives.Rectangle();
        rectangle.width = 150;
        rectangle.height = 400;
        var rectanglePosition = new Vector(200, 300);
        var c = new Vector(0, 0);

        this.withLineCollision = function(circlePosition, circleRadius, lineStart, lineEnd) {
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
                    return dr.magnitude() < circleRadius;
                }
            // check if line points are inside the circle
            if (circlePosition.substract(lineStart).magnitude() < circleRadius ||
                circlePosition.substract(lineEnd).magnitude() < circleRadius)
                return true;
            return false;
        }

        this.withRectangleCollision = function(circlePosition, circleRadius, rectangleCenter, rectangleWidth, rectangleHeight) {
            // get rectangle corners
            var halfWidth = rectangleWidth / 2;
            var halfHeight = rectangleHeight / 2;
            var rectangleX1 = rectangleCenter.x - halfWidth;
            var rectangleX2 = rectangleCenter.x + halfWidth;
            var rectangleY1 = rectangleCenter.y - halfHeight;
            var rectangleY2 = rectangleCenter.y + halfHeight;
            // get closest to circle point in rectangle
            var closestX = Math.clamp(circlePosition.x, rectangleX1, rectangleX2);
            var closestY = Math.clamp(circlePosition.y, rectangleY1, rectangleY2);
            c.set(closestX, closestY);
            // check if point is in circle
            return (c.substract(circlePosition).magnitude() < circleRadius); 
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

            if (this.withLineCollision(circlePosition, circle.radius, lineStart, lineEnd))
                line.color = Color.red();        
            else
                line.color = Color.white();

            if (this.withRectangleCollision(circlePosition, circle.radius, rectanglePosition, rectangle.width, rectangle.height))
                rectangle.color = Color.red();
            else
                rectangle.color = Color.white();
        }

		this.render = function(graphics, camera) {
            // reset test circle
			graphics.resetTransformToCamera(camera);
            circle.draw(graphics, circlePosition, 0);
            // draw line
            graphics.resetTransformToCamera(camera);
            line.draw(graphics, lineStart, lineEnd);
            // draw lines projection point
            graphics.resetTransformToCamera(camera);
            graphics.drawing.drawCircle(d.x, d.y, 5, 'green');
            // draw rectangle
            graphics.resetTransformToCamera(camera);
            rectangle.draw(graphics, rectanglePosition, 0);
            // draw rectangles closest point
            graphics.resetTransformToCamera(camera);
            graphics.drawing.drawCircle(c.x, c.y, 5, 'green');
		}
	}
	
	return Scene;
})

