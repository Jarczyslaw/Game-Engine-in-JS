requirejs.config({
    baseUrl: 'engine/components',
});

require(['../domReady!', 'game', '../config',  
	'utils', 'keyMap', 'log'], 
	function(dom, Game, config) {
		// wait to load scene from config
		require(['../scenes/' + config.sceneName], function(Scene) {
			console.log('all modules loaded');
			var game = new Game(config.targetCanvas, new Scene());
			game.start();
		}) 
});