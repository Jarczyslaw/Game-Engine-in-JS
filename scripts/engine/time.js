define(function() {
	
	this.Time = function() {
		
		function FpsCounter () {
			
			var that = this;
			
			var fpsUpdate = 0.2;
			
			this.current = 0;
			var currentFpsAccu = 0;
			var lastFrames = 0;

			this.mean = 0;
			var meanFpsAccu = 0;
			var deltasQueue = [];
			var deltasQueueLength = 5;
			
			this.update = function(delta) {
				getCurrentFps(delta);
				getMeanFps(delta);
				//getMeanFps2(delta);
				
				if (getTime() > 10 && this.mean != 10)
					var x = 0;
			}
			
			var getCurrentFps = function(delta) {
				that.current = 1 / delta;
			}
			
			var getMeanFps = function(delta) {
				lastFrames++;
				meanFpsAccu += delta;
				if (meanFpsAccu > fpsUpdate) {
					that.mean = lastFrames / fpsUpdate;
					meanFpsAccu = 0;
					lastFrames = 0;
				}
			};
			
			var getMeanFps2 = function(delta) {
				deltasQueue.push(delta);
				if(deltasQueue.length > deltasQueueLength)
					deltasQueue.splice(0, 1);
				meanFpsAccu += delta;
				if (meanFpsAccu > fpsUpdate) {
					var deltaSum  = deltasQueue.reduce(function(a, b) { return a + b; }, 0);
					that.mean = 1 / (deltaSum / deltasQueue.length);
					meanFpsAccu = 0;
				}
			}
		};
		
		this.framesCounter = 0;
		this.timeSinceStart = 0;
		this.previousFrameTime = 0;
		this.delta = 0;
		this.fps = new FpsCounter();
		
		this.updateTime = 0;
		this.renderTime = 0;
		
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

			this.fps.update(this.delta);
		};
		
		this.tick = function() {
			tempTime = getTime();
		}
		
		this.tock = function() {
			return getTime() - tempTime;
		}
	}
})



