requirejs.config({
    baseUrl: 'scripts/engine',
});

require(['../domReady!', 'game', 'worlds/followingPoints', 
	'utils', 'keyMap', 'log'], 
	function(dom, Game, World) {
		console.log('all modules loaded');
	
		var game = new Game('game_canvas', new World());
		game.start();
});