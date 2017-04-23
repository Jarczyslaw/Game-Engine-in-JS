define(function() {
	
	this.Graphics = function(canvas) {
		
		this.width = canvas.width;
		this.height = canvas.height;
		
		this.ctx = canvas.getContext("2d");
		this.ctx.imageSmoothingEnabled = false;
		this.pixel = this.ctx.createImageData(1,1);
		
		this.setPixel2 = function(x, y, r, g, b, a = 255) {
			this.pixel.data[0] = r;
			this.pixel.data[1] = g;
			this.pixel.data[2] = b;
			this.pixel.data[3] = a;
			this.ctx.putImageData(this.pixel, x, y);
		};
		
		this.setPixel = function(x, y, color) {
			this.ctx.fillStyle = color;
			this.ctx.fillRect(x, y, 1, 1);
		};
		
		this.setLine = function(xStart, yStart, xEnd, yEnd, width, color) {
			this.ctx.beginPath();
			this.ctx.moveTo(xStart, yStart);
			this.ctx.lineTo(xEnd, yEnd);
			this.ctx.lineWidth = width;
			this.ctx.strokeStyle = color;
			this.ctx.stroke();
		};
		
		this.clear = function() {
			this.ctx.fillStyle = 'white';
			this.ctx.fillRect(0, 0, this.width, this.height);
		};
		
		this.fill = function(r,g,b,a = 255) {
			this.ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
			this.ctx.fillRect(0, 0, this.width, this.height);
		};
		
		this.getRandomPos = function() {
			var randX = Math.random() * this.width;
			var randY = Math.random() * this.height;
			return {
				x : randX,
				y : randY
			};
		};
		
		this.getCenter = function() {
			return {
				x : this.width / 2,
				y : this.height / 2
			};
		};
		
		this.drawTime = function(time) {
			var fpsText = 'FPS: ' + time.fps.current.toFixed();
			var meanFpsText = 'Mean FPS: ' + time.fps.mean.toFixed();
			var timeText = 'Time: ' + time.timeSinceStart.toFixed(2) + ' s';
			var framesText = 'Frames: ' + time.framesCounter;
			var deltaText = 'Delta: ' + time.delta.toFixed(3) + ' s';
			var updateText = 'Update time: ' + (time.updateTime * 1000).toFixed() + ' ms';
			var renderText = 'Render: ' + (time.renderTime * 1000).toFixed() + ' ms';
			
			var fontSize = 12;
			this.ctx.font = 'bold ' + fontSize + 'px Arial';
			this.ctx.fillStyle = 'white';
			this.ctx.fillText(fpsText, 0, fontSize);
			this.ctx.fillText(meanFpsText, 0, 2* fontSize);
			this.ctx.fillText(timeText, 0, 3 * fontSize);
			this.ctx.fillText(framesText, 0, 4 * fontSize);
			this.ctx.fillText(deltaText, 0, 5 * fontSize);
			this.ctx.fillText(updateText, 0, 6 * fontSize);
			this.ctx.fillText(renderText, 0, 7 * fontSize);
		};
	}
})

