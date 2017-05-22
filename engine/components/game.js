define(['time', 'input', 'graphics'], function(Time, Input, Graphics) {
	
	function GameInfo() {

		this.paused = false;
		var width = 0;
		var height = 0; 
		this.originX = 0;
		this.originY = 0;

		this.init = function(gameWidth, gameHeight) {
			width = gameWidth;
			height = gameHeight; 
		}

		this.togglePaused = function() {
			this.paused = !this.paused;
		}

		this.getWidth = function() {
			return width;
		}

		this.getHeight = function() {
			return height;
		}

		this.setOriginToCenter = function() {
			this.originX = width / 2;
			this.originY = height / 2;
		}
	}

	function Game(canvasId, gameWorld) {

		var canvas = document.getElementById(canvasId);
		
		var gameInfo = new GameInfo();
		var time = new Time();
		var input = new Input(canvas, gameInfo);
		var graphics = new Graphics(canvas, gameInfo);
		gameInfo.init(graphics.getWidth(), graphics.getHeight());
		
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
	