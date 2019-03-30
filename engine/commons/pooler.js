define(function () {

	class Pooler {
		constructor() {
			this.capacity = 0;
			let objects = [];

			this.get = function (poolableObjectInstantiateCallback) {
				for (let i = 0; i < objects.length; i++) {
					let obj = objects[i];
					if (!obj.getEnabled()) {
						obj.setEnabled(true);
						return obj;
					}
				}
				let createNew = false;
				if (this.capacity <= 0)
					createNew = true;
				else {
					if (this.capacity > objects.length)
						createNew = true;
				}
				if (createNew) {
					let newObj = poolableObjectInstantiateCallback();
					newObj.setEnabled(true);
					objects.push(newObj);
					return newObj;
				}
				return null;
			};

			this.forEach = function (callback) {
				for (let i = 0; i < objects.length; i++)
					callback(objects[i]);
			};

			this.count = function () {
				return objects.length;
			};

			this.clear = function () {
				objects = [];
			};
		}
	}

	return Pooler;
});