define(['time', 'input', 'graphics'], function(Time, Input, Graphics) {
	
	function GameInfo(width, height) {
		this.paused = false;
		var gameWidth = width;
		var gameHeight = height; 

		this.togglePaused = function() {
			this.paused = !this.paused;
		}

		this.getWidth = function() {
			return gameWidth;
		}

		this.getHeight = function() {
			return gameHeight;
		}
	}

	function Game(canvasId, gameWorld) {

		var canvas = document.getElementById(canvasId);
		
		var time = new Time();
		var input = new Input(canvas);
		var graphics = new Graphics(canvas);
		var gameInfo = new GameInfo(graphics.width, graphics.height);
		
		this.start = function() {
			time.start();
			gameWorld.start(gameInfo);
			gameLoop();
			log.info('game start...');
		};
		
		var gameLoop = function() {
			checkPause();
			update();
			input.onFrameClear();
			render();
			
			requestAnimationFrame(gameLoop);
		};

		var checkPause = function() {
			if (input.getKeys().getKey(keyMap.P).isPressed()) {
				gameInfo.togglePaused();
				time.enabled = !gameInfo.paused;
			}	
		}

		var update = function() {
			time.nextFrame();
			time.tick();
			gameWorld.update(gameInfo, input, time);
			time.updateTime = time.tock();
		}

		var render = function() {
			time.tick();
			graphics.startDrawing();
			gameWorld.render(graphics);
			graphics.finishDrawing(gameInfo, time);
			time.renderTime = time.tock();
		}
	}
	
	return Game;
})
	