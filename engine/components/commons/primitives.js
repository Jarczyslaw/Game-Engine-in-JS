define(['commons/vector', 'commons/color'], function(Vector, Color) {
	
	function Circle() {
		
		this.radius = 10;
		this.color = Color.white();
		
		this.draw = function(graphics, position) {
			graphics.ctx.translate(position.x, position.y);
			graphics.drawing.drawCircle(0, 0, this.radius, this.color.toText());
		}
	};
	
	function Square() {
		
		this.size = 10;
		this.color = Color.white();

		this.draw = function(graphics, position, rotation) {
			graphics.ctx.translate(position.x, position.y);
			graphics.ctx.rotate(rotation);
			graphics.drawing.drawSquare(0, 0, this.size, this.color.toText());
		}
	};

	function Rectangle() {

		this.width = 20;
		this.height = 10;
		this.color = Color.white();

		this.draw = function(graphics, position, rotation) {
			graphics.ctx.translate(position.x, position.y);
			graphics.ctx.rotate(rotation);
			graphics.drawing.drawRectangle(0, 0, this.width, this.height, this.color.toText());
		}
	}

	function Line() {

		this.width = 100;
		this.color = Color.white();

		this.draw = function(graphics, start, end) {
			var vect = end.substract(start);
			graphics.ctx.translate(start.x, start.y);
			graphics.drawing.drawLine(0, 0, vect.x, vect.y, this.width, this.color.toText());
		}
	}

	function Triangle() {

		this.baseLength = 40;
		this.height = 50;
		this.color = Color.white();

		this.draw = function(graphics, position, rotation) {
			graphics.ctx.translate(position.x, position.y);
			graphics.ctx.rotate(rotation);
			
			var p1 = this.height / 3;
			var p2 = 2 * p1;
			var p3 = this.baseLength / 2;
			var a = { x: -p1, y: -p3 };
			var b = { x: -p1, y: p3 };
			var c = { x: p2, y: 0 };
			graphics.drawing.drawTriangle(a, b, c, this.color.toText());
		}
	}
	
	return {
		Circle : Circle,
		Square : Square,
		Rectangle : Rectangle,
		Line : Line,
		Triangle : Triangle
	};
});