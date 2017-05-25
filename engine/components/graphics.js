define(function() {
	
	function Drawing(context) {

		var pixel = context.createImageData(1,1);
		
		this.setPixel2 = function(x, y, r, g, b, a = 255) {
			pixel.data[0] = r;
			pixel.data[1] = g;
			pixel.data[2] = b;
			pixel.data[3] = a;
			context.putImageData(this.pixel, x, y);
		};
		
		this.setPixel = function(x, y, color) {
			context.fillStyle = color;
			context.fillRect(x, y, 1, 1);
		};

		this.getPixel = function(x, y) {
			var p = context.getImageData(x, y).data;
			// TODO implement later
		}
		
		this.drawLine = function(startX, startY, endX, endY, width, color) {
			context.beginPath();
			context.moveTo(startX, startY);
			context.lineTo(endX, endY);
			context.lineWidth = width;
			context.strokeStyle = color;
			context.stroke();
		};

		this.drawCircle = function(centerX, centerY, size, color) {
			context.beginPath();
			context.arc(centerX, centerY, size, 2 * Math.PI, false);
			context.fillStyle = color;
			context.fill();
		}

		this.drawSquare = function(centerX, centerY, size, color) {
			var halfSize = size / 2;
			context.fillStyle = color;
			context.fillRect(centerX - halfSize, centerY - halfSize, size, size);
		}

		this.drawRectangle = function(centerX, centerY, width, height, color) {
			context.fillStyle = color;
			context.fillRect(centerX - width / 2, centerY - height / 2, width, height);
		}
	}

	function Graphics(canvas) {
		
		var that = this;

		this.ctx = canvas.getContext("2d");
		this.ctx.imageSmoothingEnabled = false;
		
		var width = canvas.width;
		var height = canvas.height;
		
		this.drawing = new Drawing(this.ctx);

		this.clear = function() {
			this.ctx.fillStyle = 'white';
			this.ctx.fillRect(0, 0, width, height);
		};
		
		this.fill = function(r, g, b, a = 255) {
			this.ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
			this.ctx.fillRect(0, 0, width, height);
		};
		
		this.getRandomPos = function() {
			var randX = Math.random() * width;
			var randY = Math.random() * height;
			return {
				x : randX,
				y : randY
			};
		};

		this.resetTransformToCamera = function(camera) {
			var origin = camera.getOrigin();
			this.ctx.setTransform(1, 0, 0,
				1, origin.x, origin.y);
		}

		this.resetTransform = function() {
			this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		}

		this.drawInCameraContext = function(camera, drawCallback) {
			this.resetTransformToCamera(camera);
			drawCallback();
		}
		
		this.startDrawing = function() {
			this.resetTransform();
			this.fill(0, 0, 0);
		}

		this.finishDrawing = function(gameStatus, time) {
			if (gameStatus.drawStatus) {
				this.resetTransform();
				drawStatus(gameStatus, time);
			}
		}
		
		var drawStatus = function(gameStatus, time) {
			var fontSize = 10;
			
			var lines = [];
			lines.push('Paused: ' + (gameStatus.paused ? 'true' : 'false'));
			lines.push('FPS: ' + time.fps.current.toFixed());
			lines.push('Mean FPS: ' + time.fps.mean.toFixed());
			lines.push('Time: ' + time.timeSinceStart.toFixed(2) + ' s');
			lines.push('Real time: ' + time.realTimeSinceStart.toFixed(2) + ' s');
			lines.push('Scale: ' + time.scale.toFixed(2));
			lines.push('Delta: ' + secondsToMillis(time.delta) + ' ms');
			lines.push('Real delta: ' + secondsToMillis(time.realDelta) + ' ms');
			lines.push('Update time: ' + secondsToMillis(time.updateTime) + ' ms');
			lines.push('Render time: ' + secondsToMillis(time.renderTime) + ' ms');
			
			that.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
			that.ctx.fillRect(0, 0, 110, lines.length * fontSize + 3);
			
			that.ctx.font = 'bold ' + fontSize + 'px Arial';
			that.ctx.textAlign = 'left';
			that.ctx.fillStyle = 'white';
			for (let i = 0;i < lines.length;i++)
				that.ctx.fillText(lines[i], 0, (i + 1) * fontSize);
		};

		this.getWidth = function() {
			return width;
		}

		this.getHeight = function() {
			return height;
		}
	}
	
	return Graphics;
})

