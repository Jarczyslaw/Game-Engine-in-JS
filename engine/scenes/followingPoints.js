define(['commons/primitives'], function(Primitives) {
	
	function FollowingPoints(pointsNumber) {
		
		var points = [];
		var easing = 20;
		
		var startSize = 10;
		var sizeDelta = startSize / pointsNumber;
		for (let i = 0;i < pointsNumber;i++) {
			var newPoint = new Primitives.Circle();
			newPoint.size = startSize - i * sizeDelta;
			newPoint.position.zero();
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
		
		this.draw = function(context) {
			for (let i = 0;i < pointsNumber;i++)
				points[i].draw(context);
		}
	};
	
	
	function World() {
		
		var pointsNumber = 50;
		
		var followingPoints = new FollowingPoints(pointsNumber);
		
		this.start = function(gameInfo) {
			this.width = gameInfo.getWidth();
			this.height = gameInfo.getHeight();
		};
		
		this.update = function(gameInfo, input, time) {
			var mouse = input.getMouse();
			followingPoints.update(mouse.getPosition(), time.delta);
		}
		
		this.render = function(graphics) {
			followingPoints.draw(graphics.ctx);
		}
	}

	return World;
});