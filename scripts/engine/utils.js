define(function() {

	this.getTime = function() {
		return window.performance.now() / 1000;
	}

	this.getDateTime = function() {
		var now     = new Date(); 
		var year    = now.getFullYear();
		var month   = now.getMonth()+1; 
		var day     = now.getDate();
		var hour    = now.getHours();
		var minute  = now.getMinutes();
		var second  = now.getSeconds(); 
		if(month.toString().length == 1) {
			var month = '0' + month;
		}
		if(day.toString().length == 1) {
			var day = '0' + day;
		}   
		if(hour.toString().length == 1) {
			var hour = '0' + hour;
		}
		if(minute.toString().length == 1) {
			var minute = '0' + minute;
		}
		if(second.toString().length == 1) {
			var second = '0' + second;
		}   
		var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;   
		return dateTime;
	}

	this.sleep = function(delay) {
		var start = new Date().getTime();
		while (new Date().getTime() < start + delay);
	}

	this.getRandomColor = function() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	this.Math.radians = function(degrees) {
		return degrees * Math.PI / 180;
	};
	 
	this.Math.degrees = function(radians) {
		return radians * 180 / Math.PI;
	};
})

