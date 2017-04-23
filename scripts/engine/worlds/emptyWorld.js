define(function(){
	
	function World() {
	
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
	
	return World;
})

