define(function() {
	
	function Graphics(canvas) {
		
		var that = this;
		
		this.width = canvas.width;
		this.height = canvas.height;
		
		this.ctx = canvas.getContext("2d");
		this.ctx.imageSmoothingEnabled = false;
		
		var pixel = this.ctx.createImageData(1,1);
		
		this.setPixel2 = function(x, y, r, g, b, a = 255) {
			pixel.data[0] = r;
			pixel.data[1] = g;
			pixel.data[2] = b;
			pixel.data[3] = a;
			ctx.putImageData(this.pixel, x, y);
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
		
		this.startDrawing = function() {
			this.ctx.setTransform(1, 0, 0, 1, 0, 0);
			this.fill(0,0,0);
		}
		
		this.finishDrawing = function(time) {
			this.ctx.setTransform(1, 0, 0, 1, 0, 0);
			drawTime(time);
		}
		
		var drawTime = function(time) {
			var fontSize = 12;
			
			var lines = [];
			lines.push('FPS: ' + time.fps.current.toFixed());
			lines.push('Mean FPS: ' + time.fps.mean.toFixed());
			lines.push('Time: ' + time.timeSinceStart.toFixed(2) + ' s');
			lines.push('Frames: ' + time.framesCounter);
			lines.push('Delta: ' + time.delta.toFixed(3) + ' s');
			lines.push('Update time: ' + (time.updateTime * 1000).toFixed() + ' ms');
			lines.push('Render: ' + (time.renderTime * 1000).toFixed() + ' ms');
			
			that.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
			that.ctx.fillRect(0, 0, 120, lines.length * fontSize + 3);
			
			that.ctx.font = 'bold ' + fontSize + 'px Arial';
			that.ctx.fillStyle = 'white';
			for (let i = 0;i < lines.length;i++)
				that.ctx.fillText(lines[i], 0, (i + 1) * fontSize);
		};
	}
	
	return Graphics;
})

