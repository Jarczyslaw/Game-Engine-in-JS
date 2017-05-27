requirejs.config({
    baseUrl: 'engine/components',
});

require(['../domReady!', 'game', '../scenes/asteroids', 
	'utils', 'keyMap', 'log'], 
	function(dom, Game, Scene) {
		console.log('all modules loaded');
	
		var game = new Game('game_canvas', new Scene());
		game.start();
});