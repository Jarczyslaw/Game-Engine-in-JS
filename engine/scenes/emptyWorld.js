define(function(){
	
	function World() {
	
		var that = this;
		
		// called once at game start
		this.start = function(gameInfo) {
			this.width = gameInfo.getWidth();
			this.height = gameInfo.getHeight();
		};
		
		// called once every frame before render
		this.update = function(gameInfo, input, time) {
		}
		
		// called once per frame
		this.render = function(graphics) {
		}
	}
	
	return World;
})

