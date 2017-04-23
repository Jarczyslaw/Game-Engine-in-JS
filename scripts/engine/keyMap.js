define(function() {
	
	function KeyMap() {
		
		var keyNames = {};
		
		this.W = 87;
		this.A = 65;
		this.S = 83;
		this.D = 68;
		
		this.ENTER = 13;
		this.SPACE = 32;
		
		this.LEFT = 37;
		this.UP = 38;
		this.RIGHT = 39;
		this.DOWN = 40;

		for(var key in this) {
			keyNames[this[key]] = key;
		}

		this.getKeyName = function(keyCode) {
			if (keyCode in keyNames)
				return keyNames[keyCode]
			else
				return undefined;
		};
	};
	this.keyMap = new KeyMap();
})