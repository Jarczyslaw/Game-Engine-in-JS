function getTime() {
	return window.performance.now() / 1000;
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
 
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};