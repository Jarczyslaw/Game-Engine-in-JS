define(['commons/timeAccumulator'], function (TimeAccumulator) {

	class MeanFpsWithQueue {
		constructor(updateTime) {
			let meanFps = 0;
			let deltasQueue = [];
			let deltasQueueLength = 10;

			let timeAccumulator = new TimeAccumulator();
			timeAccumulator.setTickEvent(updateTime, function () {
				let fpsQueue = [];
				for (let i = 0; i < deltasQueue.length; i++) {
					if (deltasQueue[i] > 0)
						fpsQueue.push(1 / deltasQueue[i]);
				}
				let fpsSum = fpsQueue.reduce(function (a, b) { return a + b; }, 0);
				if (fpsQueue.length != 0)
					meanFps = fpsSum / fpsQueue.length;
			});
			timeAccumulator.enabled = true;

			this.calc = function (delta) {
				deltasQueue.push(delta);
				if (deltasQueue.length > deltasQueueLength)
					deltasQueue.splice(0, 1);
				timeAccumulator.add(delta);
				return meanFps;
			};
		}
	}

	class MeanFpsWithSum {
		constructor(updateTime) {
			let meanFps = 0;
			let framesAccu = 0;

			let timeAccumulator = new TimeAccumulator();
			timeAccumulator.setTickEvent(updateTime, function () {
				meanFps = framesAccu / updateTime;
				framesAccu = 0;
			});
			timeAccumulator.enabled = true;

			this.calc = function (delta) {
				framesAccu++;
				timeAccumulator.add(delta);
				return meanFps;
			};
		}
	}

	class FpsCounter {
		constructor() {
			let fpsUpdate = 0.2;
			let lastDelta = 0;
			let current = 0;
			let mean = 0;
			let meanFps = new MeanFpsWithQueue(fpsUpdate);

			let timeAccumulator = new TimeAccumulator();
			timeAccumulator.setTickEvent(fpsUpdate, function () {
				if (lastDelta != 0)
					current = 1 / lastDelta;
			});
			timeAccumulator.enabled = true;

			this.update = function (delta) {
				lastDelta = delta;
				timeAccumulator.add(delta);
				mean = meanFps.calc(delta);
			};

			this.getCurrent = function () {
				return current;
			};

			this.getMean = function () {
				return mean;
			};
		}
	}

	class Time {
		constructor() {
			let tickTockTime;
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
			this.enabled = true;

			this.start = function () {
				this.framesCounter = 0;
				this.timeSinceStart = 0;
				this.realTimeSinceStart = 0;
				this.previousFrameTime = getTime();
			};

			this.nextFrame = function () {
				let currentTime = getTime();
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

			this.tick = function () {
				tickTockTime = getTime();
			};

			this.tock = function () {
				return getTime() - tickTockTime;
			};
		}
	}

	return Time;
})



