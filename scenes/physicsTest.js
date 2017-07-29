define(['commons/physics', 'commons/primitives'], function(Physics, Primitives){
	
	function Scene() {

        var linearPhysics = new Physics.Linear();
		var angularPhysics = new Physics.Angular();
        var square = new Primitives.Square();
        square.size = 100;

		var linearForce = 200;
		var torque = 10;

        var physicsInit = function() {
			linearPhysics.velocity.y = -200;
			linearPhysics.drag = 1;
			linearPhysics.enabled = true;

            angularPhysics.velocity = 20;
            angularPhysics.drag = 1;
			angularPhysics.enabled = true;
        }

        var drawLinearPhysicsValues = function(graphics) {
            var linear = [];
			linear.push('Linear physics');
			linear.push('Position: ' + linearPhysics.position.toString());
			linear.push('Velocity: ' + linearPhysics.velocity.toString());
			linear.push('Acceleration: ' + linearPhysics.getAcceleration().toString());
			linear.push('Force: ' + linearPhysics.force.toString());

			graphics.resetTransform();
			graphics.text.setTextBlock(linear, 0, 150, 14, 'red');
        }

		var drawAngularPhysicsValues = function(graphics) {
			var angular = [];
			angular.push('Angular physics');
			angular.push('Rotation: ' + angularPhysics.rotation.toFixed(2));
			angular.push('Velocity: ' + angularPhysics.velocity.toFixed(2));
			angular.push('Acceleration: ' + angularPhysics.getAcceleration().toFixed(2));
			angular.push('Torque: ' + angularPhysics.torque.toFixed(2));

			graphics.resetTransform();
			graphics.text.setTextBlock(angular, 0, 350, 14, 'red');
		}

		this.start = function(gameStatus, camera, input) {
			this.gameWidth = gameStatus.getWidth();
			this.gameHeight = gameStatus.getHeight();

			this.screenWidth = camera.getWidth();
			this.screenHeight = camera.getHeight();

			// register additional keys
			input.getKeys().addKey(keyMap.Q, false);
			input.getKeys().addKey(keyMap.E, false);
			input.getKeys().addKey(keyMap.X, false);

			camera.setPointOfViewToCenter();
            physicsInit();
		};
		
		this.update = function(gameStatus, camera, input, time) {
			linearPhysics.enabled = !gameStatus.paused;
			angularPhysics.enabled = !gameStatus.paused;

			var keys = input.getKeys();
			// stop all 
			if (keys.getKey(keyMap.X).isPressed()) {
				linearPhysics.stop();
				angularPhysics.stop();
			}

			// linear movement
			if (keys.getKey(keyMap.A).isDown())
				linearPhysics.force.x = -linearForce;
			else if(keys.getKey(keyMap.D).isDown())
				linearPhysics.force.x = linearForce;
			else
				linearPhysics.force.x = 0;

			if (keys.getKey(keyMap.W).isDown())
				linearPhysics.force.y = -linearForce;
			else if (keys.getKey(keyMap.S).isDown())	
				linearPhysics.force.y = linearForce;
			else
				linearPhysics.force.y = 0;

			// angular movement
			if (keys.getKey(keyMap.Q).isDown())
				angularPhysics.torque = -torque;
			else if (keys.getKey(keyMap.E).isDown())
				angularPhysics.torque = torque;
			else
				angularPhysics.torque = 0;

			// move instantly to mouse position
			var mouse = input.getMouse();
			if (mouse.isPressed()) {
				var mousePosition = mouse.getInGamePosition(camera);
				linearPhysics.position.set(mousePosition.x, mousePosition.y);
			}

			// update physics
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

