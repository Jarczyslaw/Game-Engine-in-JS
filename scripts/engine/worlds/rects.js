define(function() {
	
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
	
	function World() {
		
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
		
		this.start = function(gameInfo) {
			this.width = gameInfo.getWidth();
			this.height = gameInfo.getHeight();
			
			addRects(startCount, this);
		};
		
		this.update = function(gameInfo, input, time) {
			if (!gameInfo.paused) {
				var keys = input.getKeys();
			
				for(let i = 0;i < rects.length;i++)
					rects[i].update(time.delta);
				
				if(keys.getKey(keyMap.UP).isDown()) {
					addRects(countStep, this);
				}
				if(keys.getKey(keyMap.DOWN).isDown()){
					removeRects(countStep);
				}
				if(keys.getKey(keyMap.LEFT).isDown()) {
					if(this.speed - speedStep > 0)
						this.speed -= speedStep;
				}
				if(keys.getKey(keyMap.RIGHT).isDown()) {
					this.speed += speedStep;
				}
			}
		};
		
		this.render = function(graphics) {
			for(let i = 0;i < rects.length;i++)
				rects[i].draw(graphics);
			
			drawSpeed(graphics);
			drawCount(graphics);
		};
	}
	
	return World;
})