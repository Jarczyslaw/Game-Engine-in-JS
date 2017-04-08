const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;

const KEY_ENTER = 13;
const KEY_SPACE = 32;

const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

function KeyInput(repeat) {
	
	this.repeat = repeat;
	
	var blocked = false;
	var pressed = false;
	var down = false;
	var up = false;
	
	this.downEvent = function() {
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
	
	this.upEvent = function() {
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
	
	this.clear = function() {
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
	
	this.clear = function() {
		pressed = false;
		up = false;
	};
}

function Input(canvas) {
	
	var defaultRepeat = true;
	
	var keys = {};
	keys[KEY_UP] = new KeyInput(defaultRepeat);
	keys[KEY_DOWN] = new KeyInput(defaultRepeat);
	keys[KEY_LEFT] = new KeyInput(defaultRepeat);
	keys[KEY_RIGHT] = new KeyInput(defaultRepeat);
	
	var mouse = new MouseInput(canvas);
	
	window.addEventListener('keydown', function(event) {
		if(event.keyCode in keys)
			keys[event.keyCode].downEvent();
	}, false);
	
	window.addEventListener('keyup', function(event) {
		if(event.keyCode in keys)
			keys[event.keyCode].upEvent();
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
	
	this.getKey = function(keyCode) {
		return keys[keyCode];
	};
	
	this.clearInput = function(){
		for(key in keys)
			keys[key].clear();
		mouse.clear();
	};
}