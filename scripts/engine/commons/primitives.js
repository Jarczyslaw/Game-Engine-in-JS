define(['commons/vector'], function(Vector) {
	
	function Circle() {
		
		this.size = 10;
		this.color = 'white';
		this.position = new Vector();
		
		this.draw = function(context) {
			context.beginPath();
			context.arc(this.position.x, this.position.y, this.size, 2 * Math.PI, false);
			context.fillStyle = this.color;
			context.fill();
		}
	};
	
	function Rectangle() {
		
		this.size = 10;
		this.color = 'white';
		this.position = new Vector();
		
		this.draw = function(context) {
			context.fillStyle = this.color;
			var halfSize = this.size / 2;
			context.fillRect(this.position.x - halfSize, this.position.y - halfSize, this.size, this.size);
		}
	};
	
	return {
		Circle : Circle,
		Rectangle : Rectangle
	};
});