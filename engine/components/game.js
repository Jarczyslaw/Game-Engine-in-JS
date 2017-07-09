define(['components/time', 'components/input', 'components/graphics', 'components/camera'], 
function(Time, Input, Graphics, Camera) {
	
	function GameStatus() {

		this.paused = false;
		this.drawStatus = true;
		var width = 0;
		var height = 0; 
		
		this.init = function(gameWidth, gameHeight) {
			width = gameWidth;
			height = gameHeight; 
		}

		this.togglePaused = function() {
			this.paused = !this.paused;
		}

		this.toggleDrawStatus = function() {
			this.drawStatus = !this.drawStatus;
		}

		this.getWidth = function() {
			return width;
		}

		this.getHeight = function() {
			return height;
		}
	}

	function Game(canvasId, gameScene) {

		var canvas = document.getElementById(canvasId);
		
		var gameStatus = new GameStatus();
		var time = new Time();
		var input = new Input(canvas, gameStatus);
		var graphics = new Graphics(canvas);
		var camera = new Camera(graphics.getWidth(), graphics.getHeight());
		gameStatus.init(graphics.getWidth(), graphics.getHeight());

		this.start = function() {
			time.start();
			gameScene.start(gameStatus, camera, input);
			gameLoop();
			log.info('game start...');
			log.error('test error');
		};
		
		var gameLoop = function() {
			checkGameStatus();
			update();
			input.onFrameClear();
			render();
			
			requestAnimationFrame(gameLoop);
		};

		var checkGameStatus = function() {
			var keys = input.getKeys();
			if (keys.getKey(keyMap.P).isPressed()) {
				gameStatus.togglePaused();
				time.enabled = !gameStatus.paused;
			}	

			if (keys.getKey(keyMap.I).isPressed()) {
				gameStatus.toggleDrawStatus();
			}
		}

		var update = function() {
			time.nextFrame();
			time.tick();
			gameScene.update(gameStatus, camera, input, time);
			time.updateTime = time.tock();
		}

		var render = function() {
			time.tick();
			graphics.startDrawing();
			gameScene.render(graphics, camera);
			graphics.finishDrawing(gameStatus, time);
			time.renderTime = time.tock();
		}
	}
	
	return Game;
})
	