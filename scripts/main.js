requirejs.config({
    baseUrl: 'scripts/engine',
});

require(['../domReady!', 'game', 'worlds/inputTest'], function() {
	var game = new Game('game_canvas', new World());
	game.start();
});