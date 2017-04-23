define(function() {
	
	function KeyInput(repeat) {
		
		function Key() {
			
			this.repeat = repeat;
		
			var blocked = false;
			var pressed = false;
			var down = false;
			var up = false;
			
			this.keyDown = function() {
				if(this.repeat) {
					pressed = true;
					down = true;
				} else {
					if(!blocked) {
						pressed = true;
						down = true;
						blocked = true;
					}
				}
			};
			
			this.keyUp = function() {
				down = false;
				up = true;
				if(!this.repeat)
					blocked = false;
			};
			
			this.isPressed = function() {
				return pressed;
			};
			
			this.isDown = function(){
				return pressed || down;
			};
			
			this.isUp = function() {
				return up;
			};
			
			this.onFrameClear = function() {
				pressed = false;
				up = false;
			};
		}
		
		var defaultRepeat = true;
		
		var keys = {};
		
		this.addKey = function(keyCode, repeating) {
			if (keyCode in keys)
				throw 'KeyCode ' + keyCode + ' already assigned';
			else
				keys[keyCode] = new Key(repeating);
		}
		
		this.getKey = function(keyCode) {
			if (keyCode in keys)
				return keys[keyCode];
			else
				throw 'KeyCode ' + keyCode + ' not registered';
		};
		
		this.getKeys = function() {
			return keys;
		};
		
		this.setRepeating = function(enabled) {
			for(key in keys)
				keys[key].repeat = enabled;
		}
		
		this.onFrameClear = function() {
			for(key in keys)
				keys[key].onFrameClear();
		}
		
		// must be after addKey definition
		this.addKey(keyMap.UP, defaultRepeat);
		this.addKey(keyMap.DOWN, defaultRepeat);
		this.addKey(keyMap.LEFT, defaultRepeat);
		this.addKey(keyMap.RIGHT, defaultRepeat);
		
		this.addKey(keyMap.W, defaultRepeat);
		this.addKey(keyMap.A, defaultRepeat);
		this.addKey(keyMap.S, defaultRepeat);
		this.addKey(keyMap.D, defaultRepeat);
	}

	function MouseInput(canvas) {
		
		var that = this;
		
		var getMousePosition = function(event) {
			var rect = canvas.getBoundingClientRect();
			var mousePos = {
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
		
		this.canvasClamp = true;
		
		var position = { x : -1, y : -1};
		
		var pressed = false;
		var down = false;
		var up = false;
		
		this.mouseDown = function(evt) {
			pressed = true;
			down = true;
			position = getMousePosition(evt);;
		};
		
		this.mouseMove = function(evt) { 
			position = getMousePosition(evt);
		};
		
		this.mouseUp = function(evt) {
			down = false;
			up = true;
			position = getMousePosition(evt);
		};
		
		this.isPressed = function() {
			return pressed;
		};
		
		this.isDown = function() {
			return pressed || down;
		};
		
		this.isUp = function() {
			return up;
		};
		
		this.getPosition = function() {
			return position;
		};
		
		this.onFrameClear = function() {
			pressed = false;
			up = false;
		};
	}

	function Input(canvas) {
		
		var mouseInput = new MouseInput(canvas);
		var keyInput = new KeyInput();
		
		window.addEventListener('keydown', function(event) {
			var k = keyInput.getKeys();
			if(event.keyCode in k)
				keyInput.getKey(event.keyCode).keyDown();
		}, false);
		
		window.addEventListener('keyup', function(event) {
			var k = keyInput.getKeys();
			if(event.keyCode in k)
				keyInput.getKey(event.keyCode).keyUp();
		}, false);
		
		window.addEventListener('mousedown', function(event) {
			mouseInput.mouseDown(event);
		}, false);
		
		window.addEventListener('mouseup', function(event) {
			mouseInput.mouseUp(event);
		}, false);
		
		window.addEventListener('mousemove', function(event) {
			mouseInput.mouseMove(event);
		}, false);
		
		this.getMouse = function() {
			return mouseInput;
		};
		
		this.getKeys = function() {
			return keyInput;
		};
		
		this.onFrameClear = function(){
			keyInput.onFrameClear();
			mouseInput.onFrameClear();
		};
	}
	
	return Input;
})