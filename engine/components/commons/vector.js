define(function() {
	
	function Vector(x = 0, y = 0) {
	
		this.x = x;
		this.y = y;
		
		this.set = function(x, y) {
			this.x = x;
			this.y = y;
		};
		
		this.zero = function() {
			this.set(0, 0);
		};
		
		this.one = function() {
			this.set(1, 1);
		};
		
		this.normalize = function(vector) {
			var mag = this.magnitude();
			return new Vector(this.x / mag, this.y / mag);
		};
		
		this.magnitude = function() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		};

		this.sqrMagnitude = function() {
			return this.x * this.x + this.y * this.y;
		}
		
		this.setMagnitude = function(value) {
			var angle = this.angle();
			this.x = Math.cos(angle) * value;
			this.y = Math.sin(angle) * value;
		};
		
		this.angle = function() {
			return Math.atan2(this.y, this.x);
		};
		
		this.setAngle = function(value) {
			var mag = this.magnitude();
			this.x = Math.cos(value) * mag;
			this.y = Math.sin(value) * mag;
		};
		
		this.add = function(vector) {
			return new Vector(this.x + vector.x, this.y + vector.y);
		};
		
		this.substract = function(vector) {
			return new Vector(this.x - vector.x, this.y - vector.y);
		};
		
		this.multiply = function(value) {
			return new Vector(this.x * value, this.y * value);
		};
		
		this.divide = function(value) {
			return new Vector(this.x / value, this.y / value);
		};

		this.dotProduct = function(vector) {
			return this.x * vector.x + this.y * vector.y;
		}



		this.toString = function() {
			return '[' + this.x.toFixed(2) + ', ' + this.y.toFixed(2)  +']';
		}
	}

	Vector.zeros = function() {
		return new Vector(0, 0);
	}

	Vector.ones = function() {
		return new Vector(1, 1);
	}
	
	return Vector;
})

