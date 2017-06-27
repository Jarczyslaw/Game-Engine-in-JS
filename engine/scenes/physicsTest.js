define(['commons/physics', 'commons/primitives'], function(Physics, Primitives){
	
	function Scene() {

        var linearPhysics = new Physics.Linear();
		var angularPhysics = new Physics.Angular();
        var square = new Primitives.Square();
        square.size = 100;

        var physicsInit = function() {
            angularPhysics.angularVelocity = 20;
            angularPhysics.angularDrag = 1;
        }

        var drawPhysics = function(graphics) {
            
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
		}
	}
	
	return Scene;
})

