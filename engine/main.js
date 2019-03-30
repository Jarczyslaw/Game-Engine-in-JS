var scene = 'circleCollisions';
if (typeof sceneToLoad !== 'undefined')
	scene = sceneToLoad;

requirejs.config({
	baseUrl: 'engine'
});

require(['requirejs/domReady!', 'components/game', '../scenes/' + scene,
	'components/utils', 'components/keyMap', 'components/log'],
	function (dom, Game, Scene) {
		console.log('all modules loaded');
		var game = new Game('game_canvas', new Scene());
		game.start();
	}
);