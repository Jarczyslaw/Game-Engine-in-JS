// if sceneToLoad is not defined, load default scene
var scene = 'pong';
if (typeof sceneToLoad !== 'undefined')
	scene = sceneToLoad;

requirejs.config({
    baseUrl: 'engine',
	paths: {
		components: 'components',
		commons: 'components/commons',
		scenes: '../scenes'
	}
});

require(['domReady!', 'components/game', 'scenes/' + scene,  
	'components/utils', 'components/keyMap', 'components/log'], 
	function(dom, Game, Scene) {
		console.log('all modules loaded');
		var game = new Game('game_canvas', new Scene());
		game.start();
	}
);