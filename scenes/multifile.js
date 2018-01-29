var root = 'scenes/multifileDependencies/'
define([root + 'fileA', root + 'fileB'], function(Test, Content){
	
	function Scene() {
        
        var test = new Test();
        var content = new Content();

		this.start = function(gameStatus, camera, input) { 
            test.test();
		};
		
		this.update = function(gameStatus, camera, input, time) {
		}
		
		this.render = function(graphics, camera) {
			content.draw(graphics, camera);
		}
	}
	
	return Scene;
})

