function RectWorld() {
	
	function Rect(gameWorld) {
	
		var xLimit = gameWorld.width;
		var yLimit = gameWorld.height;
		
		var size = 30;
		var pos = { x : 0, y : 0};
		var tempPos = { x : 0, y : 0 };
		var speedDir = { x : 0, y : 0};
		var color;
		
		this.init = function() {
			pos.x = Math.random() * (xLimit - size);
			pos.y = Math.random() * (yLimit - size);
			
			var angle = Math.random() * 2 * Math.PI;
			speedDir.x = Math.cos(angle);
			speedDir.y = Math.sin(angle);
			
			color = getRandomColor();
		};
		
		this.update = function(delta) {
			tempPos.x = pos.x + delta * speedDir.x * gameWorld.speed;
			tempPos.y = pos.y + delta * speedDir.y * gameWorld.speed;
			
			if((tempPos.x + size) > xLimit || tempPos.x < 0)
				speedDir.x = -speedDir.x;
			if ((tempPos.y + size) > yLimit || tempPos.y < 0)
				speedDir.y = -speedDir.y;
			
			pos.x += delta * speedDir.x * gameWorld.speed;
			pos.y += delta * speedDir.y * gameWorld.speed;
		};
		
		this.draw = function(graphics) {
			graphics.ctx.fillStyle = color;
			graphics.ctx.fillRect(pos.x, pos.y, size, size);
		};
		
		this.setSpeed = function(speed) {
			speedValue = speed;
		};
	}
	
	var that = this;
	
	this.width = 0;
	this.height = 0;
	this.speed = 50;
	
	var startCount = 1000;
	var countStep = 500;
	var speedStep = 10;
	
	var rects = [];
	var rectsToAdd = [];
	
	var addRects = function(cnt, gameWorld) {
		for(let i = 0;i < cnt;i++) {
			var r = new Rect(gameWorld);
			rects.push(r);
			r.init();
		}
	};
	
	var removeRects = function(cnt) {
		if(rects.length - cnt > 0) {
			rects.splice(rects.length - cnt - 1, cnt);
		}
	}
	
	var drawCount = function(graphics) {
		var txt = "Count: " + rects.length;
		
		graphics.ctx.font = 'bold 20px Arial';
		graphics.ctx.fillStyle = 'red';
		var txtSize = graphics.ctx.measureText(txt);
		graphics.ctx.fillText(txt, graphics.width - txtSize.width, graphics.height);
	};
	
	var drawSpeed = function(graphics) {
		var txt = "Speed: " + that.speed;
		
		graphics.ctx.font = 'bold 20px Arial';
		graphics.ctx.fillStyle = 'red';
		var txtSize = graphics.ctx.measureText(txt);
		graphics.ctx.fillText(txt, graphics.width - txtSize.width, graphics.height - 20);
	}
	
	this.start = function(graphics) {
		this.width = graphics.width;
		this.height = graphics.height;
		
		addRects(startCount, this);
	};
	
	this.update = function(input, time) {
		for(let i = 0;i < rects.length;i++)
			rects[i].update(time.delta);
		
		if(input.getKey(keyMap.UP).getDown()) {
			addRects(countStep, this);
		}
		if(input.getKey(keyMap.DOWN).getDown()){
			removeRects(countStep);
		}
		if(input.getKey(keyMap.LEFT).getDown()) {
			if(this.speed - speedStep > 0)
				this.speed -= speedStep;
		}
		if(input.getKey(keyMap.RIGHT).getDown()) {
			this.speed += speedStep;
		}
		
	};
	
	this.render = function(graphics) {
		for(let i = 0;i < rects.length;i++)
			rects[i].draw(graphics);
		
		drawSpeed(graphics);
		drawCount(graphics);
	};
}

function Fountain() {
	
	function Particle() {
		
		this.size = 10;
		
		this.position = new Vector();
		this.velocity = new Vector();
		this.drag = 0;
		this.gravity = new Vector(0, 300);
		
		this.enabled = true;
		
		this.setRandomSize = function() {
			this.size = Math.random() * 10 + 5;
		};
		
		this.fire = function(width, height) {
			this.setRandomSize();
			this.position.x = width / 2;
			this.position.y = height;
			
			this.velocity.setMagnitude(Math.random() * 100 + 500);
			var range = Math.radians(30); 
			this.velocity.setAngle(-Math.PI / 2 + Math.random() * range - range / 2);
		};
		
		this.update = function(time, width, height) {
			if(this.enabled) {
				var accel = new Vector();
				accel.x = -this.drag * this.velocity.x + this.gravity.x;
				accel.y = -this.drag * this.velocity.y + this.gravity.y;
				
				this.position.x = this.position.x + time.delta * this.velocity.x;
				this.position.y = this.position.y + time.delta * this.velocity.y;
				
				this.velocity.x = this.velocity.x + time.delta * accel.x;
				this.velocity.y = this.velocity.y + time.delta * accel.y;
				
				if(this.position.x - this.size > width)
					this.enabled = false;
				if(this.position.x + this.size < 0)
					this.enabled = false;
				if(this.position.y - this.size > height)
					this.enabled = false;

			}
		};
		
		this.draw = function(graphics) {
			if(this.enabled) {
				graphics.ctx.beginPath();
				graphics.ctx.arc(this.position.x, this.position.y, this.size, 2 * Math.PI, false);
				graphics.ctx.fillStyle = 'white';
				graphics.ctx.fill();
			}
		};
	}
	
	var that = this;
	
	var particles = [];
	
	var getParticle = function() {
		var result = null;
		for(let i = 0;i < particles.length;i++) {
			if (!particles[i].enabled) {
				result = particles[i];
				particles[i].enabled = true;
				return particles[i];
			}
		}
		
		var newParticle = new Particle();
		particles.push(newParticle);
		return newParticle;
	}
	
	var drawCount = function(ctx) {
		ctx.font = 'bold 20px Arial';
		ctx.fillStyle = 'red';
		ctx.fillText('Count: ' + particles.length, 0, 150);
	}
	
	this.start = function(graphics) {
		this.width = graphics.width;
		this.height = graphics.height;
	};
	
	this.update = function(input, time) {
		if (input.getKey(keyMap.UP).getDown()) {
			var particle = getParticle();
			particle.fire(this.width, this.height);
		}
		
		for(let i = 0;i < particles.length;i++)
			particles[i].update(time, this.width, this.height);
	}
	
	this.render = function(graphics) {
		for(let i = 0;i < particles.length;i++) 
			particles[i].draw(graphics);
		
		drawCount(graphics.ctx);
	}
}

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
		// rectangle
		var accelDelta = new Vector();
		var delta = time.delta * 20;
		var drag = 0.1;
	
		if(input.getKey(keyMap.LEFT).getDown())
			accelDelta.x = -delta;
		if(input.getKey(keyMap.RIGHT).getDown())
			accelDelta.x = delta;
		if(input.getKey(keyMap.UP).getDown())
			accelDelta.y = -delta;
		if(input.getKey(keyMap.DOWN).getDown())
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
		input.getKeys(function(keyCode, keyInput) {
			keyStates.push({ 
				title: keyMap.getKeyName(keyCode), 
				value: (keyInput.getDown() ? 'down' : 'up') 
			});
		});
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
	
	var pressedPoints = [];
	var upPoints = [];
	var movePoints = 0;
	var lines = [];
	var linesPoints = 0;
	
	var lastPoint = { x: -1, y: -1};
	
	var mouseMovePosition = { x : -1, y : -1 };
	var mouseDown = false;
	
	var mousePressedPosition = { x: -1, y : -1};
	
	this.start = function(graphics) {
		this.width = graphics.width;
		this.height = graphics.height;
	};
	
	this.update = function(input, time) {
		mouseMovePosition = input.getMouse().getMovePosition();
		
		if(input.getMouse().getPressed()) {
			var mousePos = input.getMouse().getPosition();
			
			mousePressedPosition = mousePos;
			
			pressedPoints.push(mousePos);
			
			var newLine = [];
			newLine.push(mousePos);
			lines.push(newLine);
			
			lastPoint.x = mousePos.x;
			lastPoint.y = mousePos.y;
		}
		
		if (input.getMouse().getDown()) {
			var mousePos = input.getMouse().getPosition();
			
			mouseDown = true;
			
			movePoints++;
			
			if (mousePos.x != lastPoint.x || mousePos.y != lastPoint.y) {
				var lastLine = lines[lines.length - 1];
				lastLine.push(mousePos);

				lastPoint.x = mousePos.x;
				lastPoint.y = mousePos.y;	
			}	
		}
		
		if (input.getMouse().getUp()) {
			var mousePos = input.getMouse().getPosition();
			
			mouseDown = false;
			
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
		graphics.ctx.font = 'bold 15px Arial';
		graphics.ctx.fillStyle = 'red';
		
		var mouseInfo = [];
		mouseInfo.push({ title: 'Move position', value: '[' + mouseMovePosition.x + ', ' + mouseMovePosition.y + ']' });
		mouseInfo.push({ title: 'Last click position', value: '[' + mousePressedPosition.x + ', ' + mousePressedPosition.y + ']' });
		mouseInfo.push({ title: 'Mouse state', value: (mouseDown ? 'down' : 'up') });
		mouseInfo.push({ title: 'MousePress points', value: pressedPoints.length });
		mouseInfo.push({ title: 'Move points', value: movePoints });
		mouseInfo.push({ title: 'Lines', value: lines.length });
		mouseInfo.push({ title: 'Lines points', value: linesPoints });
		mouseInfo.push({ title: 'MouseUp points', value: upPoints.length });
		inputTest.drawTextBlock(graphics.ctx, mouseInfo, 150, 15);
		
		// pressed points
		for(let i = 0;i < pressedPoints.length;i++) {
			graphics.ctx.fillStyle = 'green';
			graphics.ctx.fillRect(pressedPoints[i].x - 3, pressedPoints[i].y - 3, 7, 7);
		}
		
		// up points		
		for(let i = 0;i < upPoints.length;i++) {
			graphics.ctx.fillStyle = 'red';
			graphics.ctx.fillRect(upPoints[i].x - 3, upPoints[i].y - 3, 7, 7);
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
				graphics.ctx.fillRect(line[j].x - 1, line[j].y - 1, 3, 3);
			}
		}
	}
}

function InputTest() {
	
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

function EmptyWorld() {
	
	var that = this;
	
	this.start = function(graphics) {
		this.width = graphics.width;
		this.height = graphics.height;
	};
	
	this.update = function(input, time) {
	}
	
	this.render = function(graphics) {
	}
}

window.onload = function() {
	var game = new Game('canvas', new InputTest());
	//var game = new Game('canvas', new RectWorld());
	//var game = new Game('canvas', new Fountain());
	game.start();
};

