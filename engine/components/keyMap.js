define(function () {

	class KeyMap {
		constructor() {
			let keyNames = {};
			this.W = 87;
			this.A = 65;
			this.S = 83;
			this.D = 68;
			this.Z = 90;
			this.Q = 81;
			this.E = 69;
			this.C = 67;
			this.X = 88;
			this.ENTER = 13;
			this.SPACE = 32;
			this.LEFT = 37;
			this.UP = 38;
			this.RIGHT = 39;
			this.DOWN = 40;
			this.I = 73;
			this.P = 80;
			this.L = 76;
			this.K = 75;
			this.M = 77;
			this.Key0 = 48;
			this.Key1 = 49;
			this.Key2 = 50;
			this.Key3 = 51;
			for (let key in this) {
				keyNames[this[key]] = key;
			}
			this.getKeyName = function (keyCode) {
				if (keyCode in keyNames)
					return keyNames[keyCode];
				else
					return undefined;
			};
		}
	}
	;
	this.keyMap = new KeyMap();
})