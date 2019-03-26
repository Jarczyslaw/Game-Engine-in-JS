define(['commons/vector'], function (Vector) {

	function KeyTest(inputTest) {

		var that = this;

		var pos = new Vector();
		var speed = new Vector();

		var size = 20;

		var keyStates = [];

		this.start = function (width, height, keys) {
			this.width = width;
			this.height = height;

			pos.x = this.width / 2 - size / 2;
			pos.y = this.height / 2 - size / 2;

			var keyCodes = [keyMap.UP, keyMap.DOWN, keyMap.LEFT, keyMap.RIGHT,
			keyMap.W, keyMap.A, keyMap.S, keyMap.D];
			keys.addKeys(keyCodes, false);
		};

		this.update = function (input, time) {
			var keys = input.getKeys();

			// rectangle
			var accelDelta = new Vector();
			var delta = time.delta * 20;
			var drag = 0.1;

			if (keys.getKey(keyMap.LEFT).isDown() || keys.getKey(keyMap.A).isDown())
				accelDelta.x = -delta;
			if (keys.getKey(keyMap.RIGHT).isDown() || keys.getKey(keyMap.D).isDown())
				accelDelta.x = delta;
			if (keys.getKey(keyMap.UP).isDown() || keys.getKey(keyMap.W).isDown())
				accelDelta.y = -delta;
			if (keys.getKey(keyMap.DOWN).isDown() || keys.getKey(keyMap.S).isDown())
				accelDelta.y = delta;

			accelDelta.x -= drag * speed.x;
			accelDelta.y -= drag * speed.y;

			speed = speed.add(accelDelta);
			pos = pos.add(speed);

			if (pos.x > that.width)
				pos.x -= (that.width + size);
			else if (pos.x + size < 0)
				pos.x += that.width + size;
			if (pos.y > that.height)
				pos.y -= (that.height + size);
			else if (pos.y + size < 0)
				pos.y += that.height + size;

			// key states
			keyStates = [];
			var k = keys.getKeys();
			for (key in k) {
				keyStates.push(keyMap.getKeyName(key) + ': ' + (k[key].isDown() ? 'down' : 'up'));
			}
		}

		this.render = function (graphics) {
			graphics.drawing.drawSquare(pos.x, pos.y, size, 'cyan');

			graphics.resetTransform();
			graphics.text.setTextBlock(keyStates, 0, 300, 15, 'red');
		}
	}

	function MouseTest() {

		var mouse;

		var pressedPoints = [];
		var upPoints = [];
		var movePoints = 0;
		var lines = [];
		var linesPoints = 0;

		var lastDown = { x: -1, y: -1 };

		this.start = function (width, height) {
			this.width = width;
			this.height = height;
		};

		this.update = function (input, time) {
			mouse = input.getMouse();
			var mousePos = mouse.getPosition();

			if (mouse.isPressed()) {
				pressedPoints.push(mousePos);

				var newLine = [];
				newLine.push(mousePos);
				lines.push(newLine);

				lastDown = mousePos;
			}

			if (mouse.isDown()) {
				movePoints++;

				if (mousePos.x != lastDown.x || mousePos.y != lastDown.y) {
					var lastLine = lines[lines.length - 1];
					lastLine.push(mousePos);

					lastDown = mousePos;
				}
			}

			if (mouse.isUp()) {
				upPoints.push(mousePos);

				var lastLine = lines[lines.length - 1];
				lastLine.push(mousePos);
			}

			linesPoints = 0;
			for (let i = 0; i < lines.length; i++)
				for (let j = 0; j < lines[i].length; j++)
					linesPoints++;
		}

		this.render = function (graphics) {
			// pressed points
			for (let i = 0; i < pressedPoints.length; i++) {
				graphics.drawing.drawSquare(pressedPoints[i].x, pressedPoints[i].y, 9, 'green');
			}

			// up points		
			for (let i = 0; i < upPoints.length; i++) {
				graphics.drawing.drawSquare(upPoints[i].x, upPoints[i].y, 9, 'red');
			}

			// lines
			for (let i = 0; i < lines.length; i++) {
				var line = lines[i];
				for (let j = 1; j < line.length; j++) {
					graphics.drawing.drawLine(line[j - 1].x, line[j - 1].y,
						line[j].x, line[j].y, 1, 'white');
				}

				for (let j = 0; j < line.length; j++) {
					graphics.drawing.drawSquare(line[j].x, line[j].y, 5, 'white');
				}
			}

			// mouse info
			var mouseInfo = [];
			var pos = mouse.getPosition();
			mouseInfo.push('Move position: [' + pos.x + ', ' + pos.y + ']');
			mouseInfo.push('Move down position: [' + lastDown.x + ', ' + lastDown.y + ']');
			mouseInfo.push('Mouse state: ' + (mouse.isDown() ? 'down' : 'up'));
			mouseInfo.push('MousePress points: ' + pressedPoints.length);
			mouseInfo.push('Move points: ' + movePoints);
			mouseInfo.push('Lines: ' + lines.length);
			mouseInfo.push('Lines points: ' + linesPoints);
			mouseInfo.push('MouseUp points: ' + upPoints.length);

			graphics.resetTransform();
			graphics.text.setTextBlock(mouseInfo, 0, 150, 15, 'red');
		}
	}

	function Scene() {

		var mouseTest = new MouseTest();
		var keyTest = new KeyTest();

		this.start = function (gameStatus, camera, input) {
			this.width = camera.getWidth();
			this.height = camera.getHeight();

			mouseTest.start(this.width, this.height);
			keyTest.start(this.width, this.height, input.getKeys());
		};

		this.update = function (gameStatus, camera, input, time) {
			mouseTest.update(input, time);
			keyTest.update(input, time);
		}

		this.render = function (graphics, camera) {
			mouseTest.render(graphics);
			keyTest.render(graphics);
			sleep(100);
		}
	}

	return Scene;
})