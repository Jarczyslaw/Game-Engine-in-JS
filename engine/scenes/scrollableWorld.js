define(['commons/primitives', 'commons/vector'], function(Primitives, Vector){
	
	function TextSquare(size, x, y, color) {
		this.body = new Primitives.Square();
		this.body.size = size;
		this.body.color = color;
		this.position = new Vector(x, y);
		this.drawPosition = true;

		this.drawText = function(graphics) {
			graphics.ctx.textAlign = 'center';
			graphics.ctx.font = '16px Arial';
			graphics.ctx.fillStyle = 'green';
			graphics.ctx.fillText('['+ this.position.x + ',' + this.position.y + ']', 0, -5);
		}

		this.draw = function(graphics) {
			this.body.draw(graphics, this.position, 0);
			if (this.drawPosition) {
				this.drawText(graphics);
			}
		}
	}

	function VisibilityChecker() {

		var lastCheck = true;

		this.test = function(camera, positionX, positionY, size) {
			var visible = camera.checkVisibility(positionX, positionY, size);
			if (!lastCheck && visible)
				log.info('visible!');

			if (lastCheck && !visible)
				log.info('invisible!');

			lastCheck = visible;
		}

	}

	function World() {
	
		var that = this;

		var TextSquares = [];
		var gap = 100;
		var offset = 0;

		var len = 50;

		var player = new TextSquare(20, 0, 0, 'red');
		player.drawPosition = false;
		var player2 = new TextSquare(20, 0, 0, 'cyan');
		player2.drawPosition = false;
		var playerSpeed = 150;

		var visibilityChecker = new VisibilityChecker();

		for (let i = -len;i < len;i++)
		{
			for (let j = -len;j < len;j++)
			{
				var newRect = new TextSquare(5, offset + i * gap, j * gap, 'white');
				TextSquares.push(newRect);
			}
		}

		this.start = function(gameStatus, camera, input) {
			camera.setPointOfViewToCenter();
		};

		this.update = function(gameStatus, camera, input, time) {
			// move player with camera
			var keys = input.getKeys();
			if (keys.getKey(keyMap.UP).isDown())
				player.position.y -= time.delta * playerSpeed;
			if (keys.getKey(keyMap.DOWN).isDown())
				player.position.y += time.delta * playerSpeed;
			if (keys.getKey(keyMap.LEFT).isDown())
				player.position.x -= time.delta * playerSpeed;
			if (keys.getKey(keyMap.RIGHT).isDown())
				player.position.x += time.delta * playerSpeed;

			camera.moveTo(player.position.x + 50, player.position.y);

			// check mouse input
			var mouse = input.getMouse();
			if (mouse.isPressed()) {
				var pos = mouse.getInGamePosition(camera);
				log.info('In game position: ' + pos.x.toFixed() + ', ' + pos.y.toFixed());
			}

			// move square and test its visibility
			if (keys.getKey(keyMap.W).isDown())
				player2.position.y -= time.delta * playerSpeed;
			if (keys.getKey(keyMap.S).isDown())
				player2.position.y += time.delta * playerSpeed;
			if (keys.getKey(keyMap.A).isDown())
				player2.position.x -= time.delta * playerSpeed;
			if (keys.getKey(keyMap.D).isDown())
				player2.position.x += time.delta * playerSpeed;

			visibilityChecker.test(camera, player2.position.x, player2.position.y, player2.body.size);
		}
		
		this.render = function(graphics, camera) {
			TextSquares.forEach(function(rect, index) {
				if (camera.checkVisibility(rect.position.x, rect.position.y, 100)) {
					graphics.resetTransformToCamera(camera);
					rect.draw(graphics);
				}
			});

			graphics.resetTransformToCamera(camera);
			player.draw(graphics);

			graphics.resetTransformToCamera(camera);
			player2.draw(graphics);
		}
	}
	
	return World;
})

