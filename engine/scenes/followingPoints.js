define(['commons/primitives', 'commons/vector'], function(Primitives, Vector) {
	
	function Point() {
		this.body = new Primitives.Circle();
		this.position = new Vector(0, 0);

		this.draw = function(graphics) {
			this.body.draw(graphics, this.position, 0);
		}
	}
	
	function FollowingPoints(pointsNumber) {
		
		var points = [];
		var easing = 20;
		
		var startSize = 10;
		var sizeDelta = startSize / pointsNumber;
		for (let i = 0;i < pointsNumber;i++) {
			var newPoint = new Point();
			newPoint.body.size = startSize - i * sizeDelta;
			points.push(newPoint);
		}
		
		this.update = function(mousePosition, deltaTime) {
			var nextPosition = {
				x : mousePosition.x,
				y : mousePosition.y
			}
			for (let i = 0;i < pointsNumber;i++) {
				var currentPoint = points[i];
				currentPoint.position.x += (nextPosition.x - currentPoint.position.x) * easing * deltaTime;
				currentPoint.position.y += (nextPosition.y - currentPoint.position.y) * easing * deltaTime;
				
				nextPosition.x = currentPoint.position.x;
				nextPosition.y = currentPoint.position.y;
			}
		}
		
		this.draw = function(graphics) {
			for (let i = 0;i < pointsNumber;i++) {
				graphics.resetTransform();
				points[i].draw(graphics);
			}	
		}
	};
	
	
	function Scene() {
		
		var pointsNumber = 50;
		
		var followingPoints = new FollowingPoints(pointsNumber);
		
		this.start = function(gameStatus, camera, input) {
			this.width = camera.getWidth();
			this.height = camera.getHeight();
		};
		
		this.update = function(gameStatus, camera, input, time) {
			var mouse = input.getMouse();
			followingPoints.update(mouse.getPosition(), time.delta);
		}
		
		this.render = function(graphics, camera) {
			followingPoints.draw(graphics);
		}
	}

	return Scene;
});