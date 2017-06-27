define(['commons/physics', 'commons/primitives'], function(Physics, Primitives){
	
	function Scene() {

        var linearPhysics = new Physics.Linear();
		var angularPhysics = new Physics.Angular();
        var square = new Primitives.Square();
        square.size = 100;

        var physicsInit = function() {
            angularPhysics.velocity = 20;
            angularPhysics.drag = 1;
        }

        var drawLinearPhysicsValues = function(graphics) {
            var linear = [];
			linear.push('Linear physics');
			linear.push('Position: ' + linearPhysics.position.toString());
			linear.push('Velocity: ' + linearPhysics.velocity.toString());
			linear.push('Acceleration: ' + linearPhysics.acceleration.toString());

			graphics.resetTransform();
			graphics.text.setTextBlock(linear, 0, 150, 14, 'red');
        }

		var drawAngularPhysicsValues = function(graphics) {
			var angular = [];
			angular.push('Angular physics');
			angular.push('Rotation: ' + angularPhysics.rotation.toFixed(2));
			angular.push('Velocity: ' + angularPhysics.velocity.toFixed(2));
			angular.push('Acceleration: ' + angularPhysics.acceleration.toFixed(2));

			graphics.resetTransform();
			graphics.text.setTextBlock(angular, 0, 350, 14, 'red');
		}

		this.start = function(gameStatus, camera, input) {
			this.gameWidth = gameStatus.getWidth();
			this.gameHeight = gameStatus.getHeight();

			this.screenWidth = camera.getWidth();
			this.screenHeight = camera.getHeight();

			camera.setPointOfViewToCenter();
            physicsInit();
		};
		
		this.update = function(gameStatus, camera, input, time) {

			linearPhysics.update(time.delta);
			angularPhysics.update(time.delta);
		}
	
		this.render = function(graphics, camera) {
			graphics.resetTransformToCamera(camera);
            square.draw(graphics, linearPhysics.position, angularPhysics.rotation);

			drawLinearPhysicsValues(graphics);
			drawAngularPhysicsValues(graphics);
		}
	}
	
	return Scene;
})

