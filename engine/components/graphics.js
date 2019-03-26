define(['commons/color'], function (Color) {

	class Drawing {
		constructor(context) {

			this.setPixel = function (x, y, color) {
				context.fillStyle = color;
				context.fillRect(x, y, 1, 1);
			};

			this.getPixel = function (x, y) {
				let p = context.getImageData(x, y, 1, 1).data;
				let color = new Color();
				color.setRGBA(p[0], p[1], p[2], p[3]);
				return color;
			};

			this.drawLine = function (startX, startY, endX, endY, width, color, dash = []) {
				context.setLineDash(dash);
				context.beginPath();
				context.moveTo(startX, startY);
				context.lineTo(endX, endY);
				context.lineWidth = width;
				context.strokeStyle = color;
				context.stroke();
			};

			this.drawCircle = function (centerX, centerY, size, color) {
				context.beginPath();
				context.arc(centerX, centerY, size, 2 * Math.PI, false);
				context.fillStyle = color;
				context.fill();
			};

			this.drawSquare = function (centerX, centerY, size, color) {
				this.drawRectangle(centerX, centerY, size, size, color);
			};

			this.drawRectangle = function (centerX, centerY, width, height, color) {
				context.fillStyle = color;
				context.fillRect(centerX - width / 2, centerY - height / 2, width, height);
			};

			this.drawTriangle = function (a, b, c, color) {
				context.fillStyle = color;
				context.beginPath();
				context.moveTo(a.x, a.y);
				context.lineTo(b.x, b.y);
				context.lineTo(c.x, c.y);
				context.fill();
			};
		}
	}

	class Text {
		constructor(context) {
			let defaultFontFamily = 'Arial';

			let getDefaultFont = function (size) {
				return 'bold ' + size + 'px ' + defaultFontFamily;
			};

			this.setTextAlignment = function (align, baseline) {
				context.textAlign = align;
				context.textBaseline = baseline;
			};

			this.setText = function (text, positionX, positionY, fontSize, fontColor) {
				context.font = getDefaultFont(fontSize);
				context.fillStyle = fontColor;
				context.fillText(text, positionX, positionY);
			};

			this.setTextBlock = function (lines, positionX, positionY, fontSize, fontColor) {
				for (let i = 0; i < lines.length; i++) {
					let linePositionX = positionX;
					let linePositionY = positionY + i * fontSize;
					this.setText(lines[i], linePositionX, linePositionY, fontSize, fontColor);
				}
			};

			this.measureText = function (text, fontSize) {
				context.font = getDefaultFont(fontSize);
				return Math.round(context.measureText(text).width + 1);
			};
		}
	}

	class StatusBoard {
		constructor() {
			let fontSize = 10;
			let fontColor = Color.white();
			let backColor = new Color();
			backColor.setRGBA(255, 0, 0, 127);

			this.draw = function (graphics, gameStatus, time) {
				let lines = [];
				lines.push('Paused: ' + (gameStatus.paused ? 'true' : 'false'));
				lines.push('FPS: ' + time.fpsCounter.getCurrent().toFixed());
				lines.push('Mean FPS: ' + time.fpsCounter.getMean().toFixed());
				lines.push('Time: ' + time.timeSinceStart.toFixed(2) + ' s');
				lines.push('Real time: ' + time.realTimeSinceStart.toFixed(2) + ' s');
				lines.push('Scale: ' + time.scale.toFixed(2));
				lines.push('Delta: ' + secondsToMillis(time.delta) + ' ms');
				lines.push('Real delta: ' + secondsToMillis(time.realDelta) + ' ms');
				lines.push('Update time: ' + secondsToMillis(time.updateTime) + ' ms');
				lines.push('Render time: ' + secondsToMillis(time.renderTime) + ' ms');
				let boxWidth = 110;
				let boxHeight = lines.length * fontSize + 3;
				graphics.resetTransform();
				graphics.drawing.drawRectangle(boxWidth / 2, boxHeight / 2, boxWidth, boxHeight, backColor.toText());
				graphics.text.setTextAlignment('left', 'top');
				graphics.text.setTextBlock(lines, 0, 0, fontSize, fontColor.toText());
			};
		}
	}

	class Graphics {
		constructor(canvas) {
			let width = canvas.width;
			let height = canvas.height;
			let blankColor = Color.black();
			let statusBoard = new StatusBoard();

			this.ctx = canvas.getContext("2d");
			this.ctx.imageSmoothingEnabled = false;
			this.drawing = new Drawing(this.ctx);
			this.text = new Text(this.ctx);
			
			this.clear = function (color) {
				this.ctx.fillStyle = color;
				this.ctx.fillRect(0, 0, width, height);
			};

			this.getRandomPos = function () {
				let randX = Math.random() * width;
				let randY = Math.random() * height;
				return {
					x: randX,
					y: randY
				};
			};

			this.resetTransformToCamera = function (camera) {
				let origin = camera.getOrigin();
				this.ctx.setTransform(1, 0, 0, 1, origin.x, origin.y);
			};

			this.resetTransform = function () {
				this.ctx.setTransform(1, 0, 0, 1, 0, 0);
			};

			this.drawInCameraContext = function (camera, drawableObject) {
				this.resetTransformToCamera(camera);
				drawableObject.draw(this);
			};

			this.startDrawing = function () {
				this.resetTransform();
				this.clear(blankColor.toText());
			};

			this.finishDrawing = function (gameStatus, time) {
				if (gameStatus.drawStatus)
					statusBoard.draw(this, gameStatus, time);
			};

			this.getWidth = function () {
				return width;
			};

			this.getHeight = function () {
				return height;
			};
		}
	}

	return Graphics;
})

