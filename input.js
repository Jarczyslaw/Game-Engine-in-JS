function KeyMap() {
	
	var keyNames = {};
	
	this.W = 87;
	this.A = 65;
	this.S = 83;
	this.D = 68;
	
	this.ENTER = 13;
	this.SPACE = 32;
	
	this.LEFT = 37;
	this.UP = 38;
	this.RIGHT = 39;
	this.DOWN = 40;

	for(var key in this) {
		keyNames[this[key]] = key;
	}

	this.getKeyName = function(keyCode) {
		if (keyCode in keyNames)
			return keyNames[keyCode]
		else
			return undefined;
	};
};
var keyMap = new KeyMap();


function KeyInput(repeat) {
	
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
	
	this.getPressed = function() {
		return pressed;
	};
	
	this.getDown = function(){
		return pressed || down;
	};
	
	this.getUp = function() {
		return up;
	};
	
	this.frameClear = function() {
		pressed = false;
		up = false;
	};
}

function MouseInput(canvas) {
	
	var getMousePosition = function(event) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	};
	
	var position = { x : -1, y : -1};
	var movePosition = { x : -1, y : -1};
	
	var pressed = false;
	var down = false;
	var up = false;
	
	this.mouseDown = function(evt) {
		pressed = true;
		down = true;
		position = getMousePosition(evt);
	};
	
	this.mouseUp = function(evt) {
		down = false;
		up = true;
		position = getMousePosition(evt);
	};
	
	this.mouseMove = function(evt) {
		var pos = getMousePosition(evt);
		if(down)
			position = pos;
		movePosition = pos;
	};
	
	this.getPressed = function() {
		return pressed;
	};
	
	this.getDown = function() {
		return pressed || down;
	};
	
	this.getUp = function() {
		return up;
	};
	
	this.getPosition = function() {
		return position;
	};
	
	this.getMovePosition = function() {
		return movePosition;
	};
	
	this.frameClear = function() {
		pressed = false;
		up = false;
	};
}

function Input(canvas) {
	
	var defaultRepeat = true;
	
	var keys = {};
	
	var mouse = new MouseInput(canvas);
	
	window.addEventListener('keydown', function(event) {
		if(event.keyCode in keys)
			keys[event.keyCode].keyDown();
	}, false);
	
	window.addEventListener('keyup', function(event) {
		if(event.keyCode in keys)
			keys[event.keyCode].keyUp();
	}, false);
	
	canvas.addEventListener('mousedown', function(event) {
		mouse.mouseDown(event);
	}, false);
	
	canvas.addEventListener('mouseup', function(event) {
		mouse.mouseUp(event);
	}, false);
	
	canvas.addEventListener('mousemove', function(event) {
		mouse.mouseMove(event);
	}, false);
	
	this.getMouse = function() {
		return mouse;
	};
	
	this.addKey = function(keyCode, repeating) {
		if (keyCode in keys)
			throw 'KeyCode ' + keyCode + ' already assigned';
		else
			keys[keyCode] = new KeyInput(repeating);
	}
	
	this.getKey = function(keyCode) {
		return keys[keyCode];
	};
	
	this.getKeys = function(keyCallback) {
		for(key in keys)
			keyCallback(key, keys[key]);
	};
	
	this.frameClear = function(){
		for(key in keys)
			keys[key].frameClear();
		mouse.frameClear();
	};
	
	// must be after addKey definition
	this.addKey(keyMap.UP, defaultRepeat);
	this.addKey(keyMap.DOWN, defaultRepeat);
	this.addKey(keyMap.LEFT, defaultRepeat);
	this.addKey(keyMap.RIGHT, defaultRepeat);
}