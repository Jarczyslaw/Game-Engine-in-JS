requirejs.config({
    baseUrl: 'engine/components',
});

require(['../domReady!', 'game', '../scenes/test', 
	'utils', 'keyMap', 'log'], 
	function(dom, Game, World) {
		console.log('all modules loaded');
	
		var game = new Game('game_canvas', new World());
		game.start();
});