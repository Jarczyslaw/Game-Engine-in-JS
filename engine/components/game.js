define(['components/time', 'components/input', 'components/graphics', 'components/camera'],
	function (Time, Input, Graphics, Camera) {

		class GameStatus {
			constructor() {
				let width = 0;
				let height = 0;

				this.paused = false;
				this.drawStatus = true;
				
				this.init = function (gameWidth, gameHeight) {
					width = gameWidth;
					height = gameHeight;
				};

				this.togglePaused = function () {
					this.paused = !this.paused;
				};

				this.toggleDrawStatus = function () {
					this.drawStatus = !this.drawStatus;
				};

				this.getWidth = function () {
					return width;
				};

				this.getHeight = function () {
					return height;
				};
			}
		}

		class Game {
			constructor(canvasId, gameScene) {
				let canvas = document.getElementById(canvasId);
				let gameStatus = new GameStatus();
				let time = new Time();
				let input = new Input(canvas, gameStatus);
				let graphics = new Graphics(canvas);
				let camera = new Camera(graphics.getWidth(), graphics.getHeight());
				gameStatus.init(graphics.getWidth(), graphics.getHeight());

				this.start = function () {
					input.addDefaultEngineKeys();
					time.start();
					gameScene.start(gameStatus, camera, input);
					gameLoop();
					log.info('game start...');
				};

				let gameLoop = function () {
					checkGameStatus();
					update();
					input.onFrameClear();
					render();
					requestAnimationFrame(gameLoop);
				};

				let checkGameStatus = function () {
					let keys = input.getKeys();
					if (keys.getKey(keyMap.P).isPressed()) {
						gameStatus.togglePaused();
						time.enabled = !gameStatus.paused;
					}
					if (keys.getKey(keyMap.I).isPressed()) {
						gameStatus.toggleDrawStatus();
					}
				};

				let update = function () {
					time.nextFrame();
					time.tick();
					gameScene.update(gameStatus, camera, input, time);
					time.updateTime = time.tock();
				};

				let render = function () {
					time.tick();
					graphics.startDrawing();
					gameScene.render(graphics, camera);
					graphics.finishDrawing(gameStatus, time);
					time.renderTime = time.tock();
				};
			}
		}

		return Game;
	})
