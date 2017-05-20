define(['commons/vector', 'commons/primitives'], function(Vector, Primitives){
	
	function Rect3D() {
		this.rect = new Primitives.Rectangle();
		this.z = 0;
		
		this.randomize = function() {
			this.rect.position = new Vector(randomInRange(-500, 500), randomInRange(-500, 500));
			this.z = randomInRange(0, 10000);
			this.rect.size = randomInRange(40, 80);
		}
	}
	
	function World() {
		
		var squares = [];
		
		var focalLength = 1000;
		
		for(let i = 0;i < 100;i++) {
			var newSquare = new Rect3D();
			newSquare.randomize();
			squares.push(newSquare);
		}
		
		this.start = function(gameInfo) {
			this.width = gameInfo.getWidth();
			this.height = gameInfo.getHeight();
		};
		
		this.update = function(gameInfo, input, time) {
			for(let i = 0;i < squares.length;i++) {
				var s = squares[i];
				s.z -= time.delta * 2000;
				
				if (s.z < 0)
					s.z = 10000;
			}
		}
		
		this.render = function(graphics) {
			var center = graphics.getCenter();
			graphics.ctx.translate(center.x, center.y);
			
			for(let i = 0;i < squares.length;i++) {
				var s = squares[i];
				var perspective = focalLength / (focalLength + s.z);
				
				graphics.ctx.save();
				graphics.ctx.translate(s.rect.x * perspective, s.rect.y * perspective);
				graphics.ctx.scale(perspective, perspective);
				
				s.rect.draw(graphics.ctx);
				
				graphics.ctx.restore();
			}
		}
	}
	
	return World;
})

