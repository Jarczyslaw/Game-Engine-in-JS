define(['commons/timeAccumulator'], function(TimeAccumulator) {
	
	function MeanFpsWithQueue(updateTime) {

		var meanFps = 0;

		var deltasQueue = [];
		var deltasQueueLength = 10;
		var timeAccumulator = new TimeAccumulator();
		timeAccumulator.setTickEvent(updateTime, function() {
			var fpsQueue = []
			for (let i = 0;i < deltasQueue.length;i++) {
				if (deltasQueue[i] > 0)
					fpsQueue.push(1 / deltasQueue[i]);
			}
			var fpsSum  = fpsQueue.reduce(function(a, b) { return a + b; }, 0);
			if (fpsQueue.length != 0)
				meanFps = fpsSum / fpsQueue.length;
		});
		timeAccumulator.enabled = true;

		this.calc = function(delta) {
			deltasQueue.push(delta);
			if(deltasQueue.length > deltasQueueLength)
				deltasQueue.splice(0, 1);
			timeAccumulator.add(delta);
			return meanFps;
		}
	}

	function MeanFpsWithSum(updateTime) {

		var meanFps = 0;

		var framesAccu = 0;
		var timeAccumulator = new TimeAccumulator();
		timeAccumulator.setTickEvent(updateTime, function() {
			meanFps = framesAccu / updateTime;
			framesAccu = 0;
		});
		timeAccumulator.enabled = true;

		this.calc = function(delta) {
			framesAccu++;
			timeAccumulator.add(delta);
			return meanFps;
		}
	}

	function FpsCounter () {
			
		var fpsUpdate = 0.2;
		
		var lastDelta = 0;
		var current = 0;
		var mean = 0;
		var meanFps = new MeanFpsWithQueue(fpsUpdate);
		var timeAccumulator = new TimeAccumulator();
		timeAccumulator.setTickEvent(fpsUpdate, function() {
			if (lastDelta != 0)
				current = 1 / lastDelta;
		});
		timeAccumulator.enabled = true;
		
		this.update = function(delta) {
			lastDelta = delta;
			timeAccumulator.add(delta);
			mean = meanFps.calc(delta);
		}
		
		this.getCurrent = function(delta) {
			return current;
		}

		this.getMean = function() {
			return mean;
		}
	};
	
	function Time() {
		
		this.framesCounter = 0;
		this.timeSinceStart = 0;
		this.realTimeSinceStart = 0;
		this.previousFrameTime = 0;
		this.scale = 1;
		this.delta = 0;
		this.realDelta = 0;
		this.fpsCounter = new FpsCounter();
		
		this.updateTime = 0;
		this.renderTime = 0;
		
		var tickTockTime;

		this.enabled = true;
		
		this.start = function() {
			this.framesCounter = 0;
			this.timeSinceStart = 0;
			this.realTimeSinceStart = 0;
			this.previousFrameTime = getTime();
		};
		
		this.nextFrame = function() {
			var currentTime = getTime();
			this.realDelta = currentTime - this.previousFrameTime;
			this.delta = this.scale * this.realDelta;
			this.previousFrameTime = currentTime;
			if (this.enabled) {
				this.timeSinceStart += this.delta;
				this.framesCounter++;
			}
			this.realTimeSinceStart += this.realDelta;

			this.fpsCounter.update(this.realDelta);
		};
		
		this.tick = function() {
			tickTockTime = getTime();
		}
		
		this.tock = function() {
			return getTime() - tickTockTime;
		}
	}
	
	return Time;
})



