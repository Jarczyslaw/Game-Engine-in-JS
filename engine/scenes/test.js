define(function(){
	
	function World() {
	
		var that = this;
		
		this.start = function(gameInfo) {
			this.width = gameInfo.getWidth();
			this.height = gameInfo.getHeight();
			gameInfo.setOriginToCenter();
		};
		
		this.update = function(gameInfo, input, time) {
		}

		this.render = function(graphics) {
			graphics.resetTransformToOrigin();
			graphics.drawing.drawCircle(0, 0, 10, 'white');
		}
	}
	
	return World;
})

