define(function() {

	function Pooler(poolableObject, instantiateCallback) {
		
		this.capacity = 0;
		
		var objects = [];
		
		this.get = function() {
			for(let i = 0;i < objects.length;i++) {
				var obj = objects[i];
				if(!obj.getEnabled()) {
					obj.setEnabled(true);
					return obj;
				}
			}
			
			var createNew = false;
			if(this.capacity <= 0) 
				createNew = true;
			else 
			{
				if(this.capacity > objects.length) 
					createNew = true;
			}
				
			if (createNew) {
				var newObj = new poolableObject();
				if (instantiateCallback != null)
					instantiateCallback(newObj); // pass new instantiated object to callback to set its initial parameters
				newObj.setEnabled(true);
				objects.push(newObj);
				return newObj;
			}
			
			return null;
		}
		
		this.forEach = function(callback) {
			for (let i = 0;i < objects.length;i++) 
				callback(objects[i]);
		}
		
		this.count = function() {
			return objects.length;
		}
		
		this.clear = function() {
			objects = [];
		}
	}
	
	return Pooler;
});