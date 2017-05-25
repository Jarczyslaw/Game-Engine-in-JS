define(function() {
	
	function Rect(gameScene) {
		
		var xLimit = gameScene.width;
		var yLimit = gameScene.height;
		
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
			tempPos.x = pos.x + delta * speedDir.x * gameScene.speed;
			tempPos.y = pos.y + delta * speedDir.y * gameScene.speed;
			
			if((tempPos.x + size) > xLimit || tempPos.x < 0)
				speedDir.x = -speedDir.x;
			if ((tempPos.y + size) > yLimit || tempPos.y < 0)
				speedDir.y = -speedDir.y;
			
			pos.x += delta * speedDir.x * gameScene.speed;
			pos.y += delta * speedDir.y * gameScene.speed;
		};
		
		this.draw = function(graphics) {
			graphics.ctx.fillStyle = color;
			graphics.ctx.fillRect(pos.x, pos.y, size, size);
		};
		
		this.setSpeed = function(speed) {
			speedValue = speed;
		};
	}
	
	function Scene() {
		
		var that = this;
		
		this.width = 0;
		this.height = 0;
		this.speed = 50;
		
		var startCount = 1000;
		var countStep = 500;
		var speedStep = 10;
		
		var rects = [];
		var rectsToAdd = [];
		
		var addRects = function(cnt, gameScene) {
			for(let i = 0;i < cnt;i++) {
				var r = new Rect(gameScene);
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
			graphics.ctx.fillText(txt, graphics.getWidth() - txtSize.width, graphics.getHeight());
		};
		
		var drawSpeed = function(graphics) {
			var txt = "Speed: " + that.speed;
			
			graphics.ctx.font = 'bold 20px Arial';
			graphics.ctx.fillStyle = 'red';
			var txtSize = graphics.ctx.measureText(txt);
			graphics.ctx.fillText(txt, graphics.getWidth() - txtSize.width, graphics.getHeight() - 20);
		}
		
		this.start = function(gameStatus, camera, input) {
			this.width = camera.getWidth();
			this.height = camera.getHeight();
			
			addRects(startCount, this);
		};
		
		this.update = function(gameStatus, camera, input, time) {
			if (!gameStatus.paused) {
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
		
		this.render = function(graphics, camera) {
			for(let i = 0;i < rects.length;i++)
				rects[i].draw(graphics);
			
			drawSpeed(graphics);
			drawCount(graphics);
		};
	}
	
	return Scene;
})