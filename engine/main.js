// if sceneToLoad is not defined, load default scene
var scene = 'pong';
if (typeof sceneToLoad !== 'undefined')
	scene = sceneToLoad;

requirejs.config({
    baseUrl: 'engine/components',
});

require(['../domReady!', 'game', '../../scenes/' + scene,  
	'utils', 'keyMap', 'log'], 
	function(dom, Game, Scene) {
		console.log('all modules loaded');
		var game = new Game('game_canvas', new Scene());
		game.start();
	}
);