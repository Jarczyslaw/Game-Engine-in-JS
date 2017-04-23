requirejs.config({
    baseUrl: 'scripts/engine',
});

//add global modules
require(['utils', 'keyMap', 'log'], function(){
	console.log('global modules loaded');
});

//load game and world classes
require(['../domReady!', 'game', 'worlds/inputTest'], function(dom, Game, World) {
	console.log('game and world modules loaded');
	
	var game = new Game('game_canvas', new World());
	game.start();
});