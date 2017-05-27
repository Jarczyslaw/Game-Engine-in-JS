# Game Engine in JavaScript

Simple engine to create 2D games and animations with JavaScript and canvas object. Strongly inspired by [CodingMath](https://www.youtube.com/user/codingmath) series and Unity3D engine. 

It's substantially my first time with JS in OOP manner so there are many places where something can be done far better.

# Game architecture

This engine based on classic game loop:
```csharp
while(true)
{
    checkInput();
    updateGameState();
    render();
}
```
with small improvements. It provides many components and helper classes to make game creating a little easier. The most important thing for me is a fact, that game itself is separated from engine. Every game/animation is created in independent scene.

# Components

There are several components in engine that allow to draw shapes, check user's input and so on:

| Component | Description |
| ------ | ------ |
| Camera | Set point of view location and change canvases drawing start position |
| Game | Main game engine class. It initializes all other components and starts the game |
| Graphics | Provides basic functionality for drawing and transforming canvas context |
| Input | Intercepts user's input from mouse and keyboard |
| KeyMap | Contains keyboard keys definitions |
| Log | Simple logging into div's body |
| Time | Calculates all neccessary timing values like timeDelta, timeSinceStartup and so on |
| Utils | Some helper classes |

There are also some other classes like particle with physics, 2D vectors, primitive shapes, time accumulator etc.

# Empty scene

All scenes have basis:

```js
define(function(){
	
	function Scene() {
	
		var that = this;
		
		// called once at game start
		this.start = function(gameStatus, camera, input) {
			this.gameWidth = gameStatus.getWidth();
			this.gameHeight = gameStatus.getHeight();

			this.screenWidth = camera.getWidth();
			this.screenHeight = camera.getHeight();

			camera.setPointOfViewToCenter(); // set POV to canvas center
		};
		
		// called once every frame before render
		this.update = function(gameStatus, camera, input, time) {
			camera.moveTo(0, 0); // move camera to position
		}
		
		// called once per frame
		this.render = function(graphics, camera) {
			graphics.resetTransformToCamera(camera); // reset view to current camera
		}
	}
	
	return Scene;
})
```
which can be found in emptyScene file. There are three methods which executes in fixed order. They have suitable components as parameters. If you want to add another scene just copy emptyScene and write your game's logic in these functions.

# Sample scenes

During development I've wrote some scenes:

 - Asteroids - well-known asteroids game clone
 - InputTest - scene which test almost all Input component functionalities
 - Rects - tons of random-coloured rectangles, good to test drawing performance
 - ScrollableScene - huge scene which tests camera component (moving camera to position, testing objects visibility etc.)
 - Fireworks - particles which can be emmitted by up arrow key or mouse click (uses objects pooling)

During engine development I will add more scenes. 

# RequireJS

Game engine is splitted into components with [RequireJS](http://requirejs.org/). If you want to add new scene, add it to scenes directory and change proper dependency in main.js.
