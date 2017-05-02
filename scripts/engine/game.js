define(['time', 'input', 'graphics'], function(Time, Input, Graphics) {
	
	function Game(canvasId, gameWorld) {
		
		var canvas = document.getElementById(canvasId);
		
		var time = new Time();
		var input = new Input(canvas);
		var graphics = new Graphics(canvas);
		
		this.start = function() {
			log.info('game start...');
			time.start();
			gameWorld.start(graphics);
			gameLoop();
		};
		
		var gameLoop = function() {
			time.nextFrame();
			
			time.tick();
			gameWorld.update(input, time);
			time.updateTime = time.tock();
			
			input.onFrameClear();
			
			time.tick();
			graphics.startDrawing();
			gameWorld.render(graphics);
			time.renderTime = time.tock();
			
			graphics.finishDrawing(time);
			
			requestAnimationFrame(gameLoop);
		};
	}
	
	return Game;
})
	