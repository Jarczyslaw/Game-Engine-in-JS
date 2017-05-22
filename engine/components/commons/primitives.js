define(['commons/vector'], function(Vector) {
	
	function Circle() {
		
		this.size = 10;
		this.color = 'white';
		
		this.draw = function(graphics, position, rotation) {
			graphics.ctx.translate(position.x, position.y);
			graphics.ctx.rotate(rotation);
			graphics.drawing.drawCircle(0, 0, this.size, this.color);
		}
	};
	
	function Square() {
		
		this.size = 10;
		this.color = 'white';

		this.draw = function(graphics, position, rotation) {
			graphics.ctx.translate(position.x, position.y);
			graphics.ctx.rotate(rotation);
			graphics.drawing.drawSquare(0, 0, this.size, this.color);
		}
	};

	function Rectangle() {

		this.width = 20;
		this.height = 10;
		this.color = 'white';

		this.draw = function(graphics, position, rotation) {
			graphics.ctx.translate(position.x, position.y);
			graphics.ctx.rotate(rotation);
			graphics.drawing.drawSquare(0, 0, this.width, this.height, this.color);
		}
	}
	
	return {
		Circle : Circle,
		Square : Square,
		Rectangle : Rectangle
	};
});