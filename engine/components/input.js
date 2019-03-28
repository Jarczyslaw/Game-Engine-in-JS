define(function () {

	class Key {
		constructor(repeat) {
			this.repeat = repeat;
			let blocked = false;
			let pressed = false;
			let down = false;
			let up = false;

			this.keyDown = function () {
				if (this.repeat) {
					pressed = true;
					down = true;
				}
				else {
					if (!blocked) {
						pressed = true;
						down = true;
						blocked = true;
					}
				}
			};

			this.keyUp = function () {
				down = false;
				up = true;
				if (!this.repeat)
					blocked = false;
			};

			this.isPressed = function () {
				return pressed;
			};

			this.isDown = function () {
				return pressed || down;
			};

			this.isUp = function () {
				return up;
			};

			this.onFrameClear = function () {
				pressed = false;
				up = false;
			};
		}
	}

	class KeyInput {
		constructor(repeat) {
			let keys = {};

			this.addKey = function (keyCode, repeating = false) {
				if (keyCode in keys)
					throw 'KeyCode ' + keyCode + ' already assigned';
				else
					keys[keyCode] = new Key(repeating);
			};

			this.addKeys = function (keyCodes, repeating = false) {
				for (let i = 0; i < keyCodes.length; i++)
					this.addKey(keyCodes[i], repeating);
			};

			this.getKey = function (keyCode) {
				if (keyCode in keys)
					return keys[keyCode];
				else
					throw 'KeyCode ' + keyCode + ' not registered';
			};

			this.getKeys = function () {
				return keys;
			};

			this.setRepeating = function (enabled) {
				for (let key in keys)
					keys[key].repeat = enabled;
			};

			this.onFrameClear = function () {
				for (let key in keys)
					keys[key].onFrameClear();
			};
		}
	}

	class MouseInput {
		constructor(canvas) {
			this.canvasClamp = true;
			let position = { x: -1, y: -1 };
			let pressed = false;
			let down = false;
			let up = false;
			let that = this;

			let getMousePosition = function (event) {
				let rect = canvas.getBoundingClientRect();
				let mousePos = {
					x: event.clientX - rect.left,
					y: event.clientY - rect.top
				};
				if (that.canvasClamp) {
					if (mousePos.x > canvas.width)
						mousePos.x = canvas.width;
					else if (mousePos.x < 0)
						mousePos.x = 0;
					if (mousePos.y > canvas.height)
						mousePos.y = canvas.height;
					else if (mousePos.y < 0)
						mousePos.y = 0;
				}
				return mousePos;
			};
			
			this.mouseDown = function (evt) {
				pressed = true;
				down = true;
				position = getMousePosition(evt);
				;
			};

			this.mouseMove = function (evt) {
				position = getMousePosition(evt);
			};

			this.mouseUp = function (evt) {
				down = false;
				up = true;
				position = getMousePosition(evt);
			};

			this.isPressed = function () {
				return pressed;
			};

			this.isDown = function () {
				return pressed || down;
			};

			this.isUp = function () {
				return up;
			};

			this.getPosition = function () {
				return position;
			};

			this.getInGamePosition = function (camera) {
				var pos = { x: -1, y: -1 };
				var origin = camera.getOrigin();
				pos.x = position.x - origin.x;
				pos.y = position.y - origin.y;
				return pos;
			};

			this.onFrameClear = function () {
				pressed = false;
				up = false;
			};
		}
	}

	class Input {
		constructor(canvas) {
			let mouseInput = new MouseInput(canvas);
			let keyInput = new KeyInput();

			window.addEventListener('keydown', function (event) {
				let k = keyInput.getKeys();
				if (event.keyCode in k)
					keyInput.getKey(event.keyCode).keyDown();
			}, false);

			window.addEventListener('keyup', function (event) {
				let k = keyInput.getKeys();
				if (event.keyCode in k)
					keyInput.getKey(event.keyCode).keyUp();
			}, false);

			window.addEventListener('mousedown', function (event) {
				mouseInput.mouseDown(event);
			}, false);

			window.addEventListener('mouseup', function (event) {
				mouseInput.mouseUp(event);
			}, false);

			window.addEventListener('mousemove', function (event) {
				mouseInput.mouseMove(event);
			}, false);

			this.getMouse = function () {
				return mouseInput;
			};

			this.getKeys = function () {
				return keyInput;
			};

			this.onFrameClear = function () {
				keyInput.onFrameClear();
				mouseInput.onFrameClear();
			};

			this.addDefaultEngineKeys = function () {
				keyInput.addKey(keyMap.P, false); // press P to pause
				keyInput.addKey(keyMap.I, false); // press I to toggle status board
			};
		}
	}

	return Input;
})