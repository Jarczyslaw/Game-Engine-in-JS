define(['commons/primitives', 'commons/vector', 'commons/color'], function (Primitives, Vector, Color) {

	function TextSquare(size, x, y, color) {
		this.body = new Primitives.Square();
		this.body.size = size;
		this.body.color = color;
		this.position = new Vector(x, y);
		this.drawPosition = true;

		this.drawText = function (graphics) {
			var txt = '[' + this.position.x + ',' + this.position.y + ']';
			graphics.text.setTextAlignment('center', 'bottom');
			graphics.text.setText(txt, 0, -5, 16, 'green');
		}

		this.draw = function (graphics) {
			this.body.draw(graphics, this.position, 0);
			if (this.drawPosition) {
				this.drawText(graphics);
			}
		}
	}

	function VisibilityChecker() {

		var lastCheck = true;

		this.test = function (camera, positionX, positionY, size) {
			var visible = camera.checkVisibility(positionX, positionY, size);
			if (!lastCheck && visible)
				log.info('visible!');

			if (lastCheck && !visible)
				log.info('invisible!');

			lastCheck = visible;
		}
	}

	function ColorPicker() {
		var newPixel = false;
		var pixelPosition = { x: -1, y: -1 };

		this.setPixelPosition = function (position) {
			pixelPosition.x = position.x;
			pixelPosition.y = position.y;
			newPixel = true;
		}

		this.getPixel = function (graphics) {
			if (newPixel) {
				var color = graphics.drawing.getPixel(pixelPosition.x, pixelPosition.y);
				log.info(color.toText());
				newPixel = false;
			}
		}
	}

	function Scene() {

		var that = this;

		var textSquares = [];
		var gap = 100;
		var offset = 0;

		var len = 50;

		var player = new TextSquare(20, -20, 0, Color.red());
		player.drawPosition = false;
		var player2 = new TextSquare(20, 20, 0, Color.blue());
		player2.drawPosition = false;
		var playerSpeed = 150;

		var visibilityChecker = new VisibilityChecker();
		var colorPicker = new ColorPicker();

		for (let i = -len; i < len; i++) {
			for (let j = -len; j < len; j++) {
				var newRect = new TextSquare(5, offset + i * gap, j * gap, Color.white());
				textSquares.push(newRect);
			}
		}

		this.start = function (gameStatus, camera, input) {
			camera.setPointOfViewToCenter();

			var keys = input.getKeys();
			var keyCodes = [keyMap.UP, keyMap.DOWN, keyMap.LEFT, keyMap.RIGHT,
			keyMap.W, keyMap.A, keyMap.S, keyMap.D];
			keys.addKeys(keyCodes, false);
		};

		this.update = function (gameStatus, camera, input, time) {
			time.scale = 0.5;
			// move player with camera
			var keys = input.getKeys();
			if (keys.getKey(keyMap.UP).isDown())
				player.position.y -= time.delta * playerSpeed;
			if (keys.getKey(keyMap.DOWN).isDown())
				player.position.y += time.delta * playerSpeed;
			if (keys.getKey(keyMap.LEFT).isDown())
				player.position.x -= time.delta * playerSpeed;
			if (keys.getKey(keyMap.RIGHT).isDown())
				player.position.x += time.delta * playerSpeed;

			camera.moveTo(player.position.x, player.position.y);

			// check mouse input and selected pixel color
			var mouse = input.getMouse();
			if (mouse.isPressed()) {
				var pos = mouse.getInGamePosition(camera);
				log.info('In game position: ' + pos.x.toFixed() + ', ' + pos.y.toFixed());

				pos = mouse.getPosition();
				colorPicker.setPixelPosition(pos);
			}

			// move square and test its visibility
			if (keys.getKey(keyMap.W).isDown())
				player2.position.y -= time.delta * playerSpeed;
			if (keys.getKey(keyMap.S).isDown())
				player2.position.y += time.delta * playerSpeed;
			if (keys.getKey(keyMap.A).isDown())
				player2.position.x -= time.delta * playerSpeed;
			if (keys.getKey(keyMap.D).isDown())
				player2.position.x += time.delta * playerSpeed;

			visibilityChecker.test(camera, player2.position.x, player2.position.y, player2.body.size);
		}

		this.render = function (graphics, camera) {
			textSquares.forEach(function (rect, index) {
				if (camera.checkVisibility(rect.position.x, rect.position.y, 100)) {
					graphics.resetTransformToCamera(camera);
					rect.draw(graphics);
				}
			});

			graphics.drawInCameraContext(camera, player);

			graphics.drawInCameraContext(camera, player2);

			colorPicker.getPixel(graphics);
		}
	}

	return Scene;
})

