define(['vector'], function() {
	
	function KeyTest(inputTest) {
	
		var that = this;
		
		var pos = new Vector();
		var speed = new Vector();
		
		var size = 20;
		
		var keyStates = [];
		
		this.start = function(graphics) {
			this.width = graphics.width;
			this.height = graphics.height;
			
			pos.x = this.width / 2 - size / 2;
			pos.y = this.height / 2 - size / 2;	
		};
		
		this.update = function(input, time) {
			var keys = input.getKeys();
			
			// rectangle
			var accelDelta = new Vector();
			var delta = time.delta * 20;
			var drag = 0.1;
		
			if(keys.getKey(keyMap.LEFT).isDown() || keys.getKey(keyMap.A).isDown())
				accelDelta.x = -delta;
			if(keys.getKey(keyMap.RIGHT).isDown() || keys.getKey(keyMap.D).isDown())
				accelDelta.x = delta;
			if(keys.getKey(keyMap.UP).isDown() || keys.getKey(keyMap.W).isDown())
				accelDelta.y = -delta;
			if(keys.getKey(keyMap.DOWN).isDown() || keys.getKey(keyMap.S).isDown())
				accelDelta.y = delta;
			
			accelDelta.x -= drag * speed.x;
			accelDelta.y -= drag * speed.y;
			
			speed = speed.add(accelDelta);
			pos = pos.add(speed);
			
			if(pos.x > that.width)
				pos.x -= (that.width + size);
			else if(pos.x + size < 0)
				pos.x += that.width+ size;
			if(pos.y > that.height)
				pos.y -= (that.height + size);
			else if (pos.y + size < 0)
				pos.y += that.height+ size;
			
			// key states
			keyStates = [];
			var k = keys.getKeys();
			for(key in k) {
				keyStates.push({ 
					title: keyMap.getKeyName(key), 
					value: (k[key].isDown() ? 'down' : 'up') 
				});
			}
		}
		
		this.render = function(graphics) {
			graphics.ctx.fillStyle = 'cyan';
			graphics.ctx.fillRect(pos.x, pos.y, size, size);
			
			graphics.ctx.font = 'bold 15px Arial';
			graphics.ctx.fillStyle = 'red';
			
			inputTest.drawTextBlock(graphics.ctx, keyStates, 300, 15);
		}
	}

	function MouseTest(inputTest) {
		
		var mouse;
		
		var pressedPoints = [];
		var upPoints = [];
		var movePoints = 0;
		var lines = [];
		var linesPoints = 0;
		
		var lastDown = { x: -1, y : -1};
		
		this.start = function(graphics) {
			this.width = graphics.width;
			this.height = graphics.height;
		};
		
		this.update = function(input, time) {
			mouse = input.getMouse();
			var mousePos = mouse.getPosition();
			
			if(mouse.isPressed()) {						
				pressedPoints.push(mousePos);
				
				var newLine = [];
				newLine.push(mousePos);
				lines.push(newLine);
				
				lastDown = mousePos;
			}
			
			if (mouse.isDown()) {
				movePoints++;
				
				if (mousePos.x != lastDown.x || mousePos.y != lastDown.y) {
					var lastLine = lines[lines.length - 1];
					lastLine.push(mousePos);

					lastDown = mousePos;	
				}	
			}
			
			if (mouse.isUp()) {
				upPoints.push(mousePos);
				
				var lastLine = lines[lines.length - 1];
				lastLine.push(mousePos);
			}
			
			linesPoints = 0;
			for(let i = 0;i < lines.length;i++)
				for(let j = 0;j < lines[i].length;j++)
					linesPoints++;
		}
		
		this.render = function(graphics) {
			// pressed points
			for(let i = 0;i < pressedPoints.length;i++) {
				graphics.ctx.fillStyle = 'green';
				graphics.ctx.fillRect(pressedPoints[i].x - 5, pressedPoints[i].y - 5, 9, 9);
			}
			
			// up points		
			for(let i = 0;i < upPoints.length;i++) {
				graphics.ctx.fillStyle = 'red';
				graphics.ctx.fillRect(upPoints[i].x - 5, upPoints[i].y - 5, 9, 9);
			}
			
			// lines
			for (let i = 0;i < lines.length;i++) {
				var line = lines[i];
				for (let j = 1;j < line.length;j++) {
					graphics.setLine(line[j - 1].x, line[j - 1].y, 
						line[j].x, line[j].y, 1, 'white');
				}
				
				for (let j = 0;j < line.length;j++) {
					graphics.ctx.fillStyle = 'white';
					graphics.ctx.fillRect(line[j].x - 3, line[j].y - 3, 5, 5);
				}
			}
			
			// mouse info
			graphics.ctx.font = 'bold 15px Arial';
			graphics.ctx.fillStyle = 'red';
			
			var mouseInfo = [];
			var pos = mouse.getPosition();
			mouseInfo.push({ title: 'Move position', value: '[' + pos.x + ', ' + pos.y + ']' });
			mouseInfo.push({ title: 'Move down position', value: '[' + lastDown.x + ', ' + lastDown.y + ']' });
			mouseInfo.push({ title: 'Mouse state', value: (mouse.isDown() ? 'down' : 'up') });
			mouseInfo.push({ title: 'MousePress points', value: pressedPoints.length });
			mouseInfo.push({ title: 'Move points', value: movePoints });
			mouseInfo.push({ title: 'Lines', value: lines.length });
			mouseInfo.push({ title: 'Lines points', value: linesPoints });
			mouseInfo.push({ title: 'MouseUp points', value: upPoints.length });
			inputTest.drawTextBlock(graphics.ctx, mouseInfo, 150, 15);
		}
	}

	this.World = function() {
		
		var mouseTest = new MouseTest(this);
		var keyTest = new KeyTest(this);
		
		this.drawTextBlock = function(context, infos, startY, fontSize) {
			for(let i = 0;i < infos.length;i++) {
				var info = infos[i];
				context.fillText(info.title + ': ' + info.value, 0, startY + i * fontSize);
			}
		};
		
		this.start = function(graphics) {
			mouseTest.start(graphics);
			keyTest.start(graphics);
		};
		
		this.update = function(input, time) {
			mouseTest.update(input, time);
			keyTest.update(input, time);
		}
		
		this.render = function(graphics) {
			mouseTest.render(graphics);
			keyTest.render(graphics);
			sleep(100);
		}
	}
})