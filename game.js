function Game(canvasId, gameWorld) {
	
	var canvas = document.getElementById(canvasId);
	
	var time = new Time();
	var input = new Input(canvas);
	var graphics = new Graphics(canvas);
	
	this.start = function() {
		console.log('game start...');
		time.start();
		gameWorld.start(graphics);
		gameLoop();
	};
	
	var gameLoop = function() {
		time.nextFrame();
		
		time.tick();
		gameWorld.update(input, time);
		time.updateTime = time.tock();
		
		input.frameClear();
		
		time.tick();
		graphics.fill(0,0,0);
		gameWorld.render(graphics);
		time.renderTime = time.tock();
		
		graphics.drawTime(time);
		
		requestAnimationFrame(gameLoop);
	};
}