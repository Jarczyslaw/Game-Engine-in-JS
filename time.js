function Time() {
	
	var that = this;
	
	this.framesCounter = 0;
	this.timeSinceStart = 0;
	this.previousFrameTime = 0;
	this.delta = 0;
	this.fps = 0;
	
	this.updateTime = 0;
	this.renderTime = 0;
	
	var fpsUpdate = 0.5;
	var fpsAccu = 0;
	var lastFrames = 0;
	
	var tempTime;
	
	this.start = function() {
		this.framesCounter = 0;
		this.timeSinceStart = 0;
		this.previousFrameTime = getTime();
	};
	
	this.nextFrame = function() {
		var currentTime = getTime();
		this.delta = currentTime - this.previousFrameTime;
		this.previousFrameTime = currentTime;
		this.timeSinceStart += this.delta;
		this.framesCounter++;

		countFps();
	};
	
	var countFps = function() {
		lastFrames++;
		fpsAccu += that.delta;
		if (fpsAccu > fpsUpdate) {
			that.fps = lastFrames / fpsUpdate;
			fpsAccu -= fpsUpdate;
			lastFrames = 0;
		}
	};
	
	this.tick = function() {
		tempTime = getTime();
	}
	
	this.tock = function() {
		return getTime() - tempTime;
	}
}