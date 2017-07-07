define(['commons/primitives', 'commons/vector', 'commons/color', 'commons/collisions'], function(Primitives, Vector, Color, Collisions){
	
	function Scene() {
	
        var hitCircle = new Primitives.Circle();
        hitCircle.radius = 30;
        var hitCirclePosition = new Vector(0, 0);

        var line = new Primitives.Line();
        var lineStart = new Vector(700, 500);
        var lineEnd = new Vector(600, 100);
        var d = new Vector(0, 0); // projection

        var rectangle = new Primitives.Rectangle();
        rectangle.width = 150;
        rectangle.height = 400;
        var rectanglePosition = new Vector(200, 300);
        var c = new Vector(0, 0);

        var circle = new Primitives.Circle();
        circle.radius = 100;
        var circlePosition = new Vector(500, 500);
        var x = new Vector(0, 0);

		this.start = function(gameStatus, camera, input) {
			this.gameWidth = gameStatus.getWidth();
			this.gameHeight = gameStatus.getHeight();

			this.screenWidth = camera.getWidth();
			this.screenHeight = camera.getHeight();
		};
		
		this.update = function(gameStatus, camera, input, time) {
            var mouse = input.getMouse();
            var mousePosition = mouse.getPosition();
            hitCirclePosition.set(mousePosition.x, mousePosition.y);

            // test with line
            var lineTest = Collisions.circleLineCollision(hitCirclePosition, hitCircle.radius, lineStart, lineEnd);
            if (lineTest.hit)
                line.color = Color.red();        
            else
                line.color = Color.white();
            d = lineTest.hitPoint;

            // test with rectangle
            var rectangleTest = Collisions.circleRectangleCollision(hitCirclePosition, hitCircle.radius, rectanglePosition, rectangle.width, rectangle.height)
            if (rectangleTest.hit)
                rectangle.color = Color.red();
            else
                rectangle.color = Color.white();
            c = rectangleTest.hitPoint;

            // test with circle
            var circleTest = Collisions.circleCircleCollision(hitCirclePosition, hitCircle.radius, circlePosition, circle.radius);
            if (circleTest.hit)
                circle.color = Color.red();
            else
                circle.color = Color.white();
            x = circleTest.hitPoint;
        }

		this.render = function(graphics, camera) {
            // reset test circle
			graphics.resetTransformToCamera(camera);
            hitCircle.draw(graphics, hitCirclePosition, 0);
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
            // draw circle
            graphics.resetTransformToCamera(camera);
            circle.draw(graphics, circlePosition, 0);
            // draw circles hit point
            graphics.resetTransformToCamera(camera);
            graphics.drawing.drawCircle(x.x, x.y, 5, 'green');
		}
	}
	
	return Scene;
})

