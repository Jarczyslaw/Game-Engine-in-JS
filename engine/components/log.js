define(function() {
	
	function Log(logContainerId) {
		
		var maxCapacity = 1000;
		var capacity = 0;
		
		var logContainer = document.getElementById(logContainerId);
		
		var messageHeader = function(object) {
			var dt = '[' + getDateTime() + ']';
			if (object == null)
				return dt + ': ';
			else
				return dt + ' ' + object.constructor.name.toUpperCase() + ': ';
		};
		
		var scrollToBottom = function() {
			logContainer.scrollTop = logContainer.scrollHeight;
		};
		
		var checkCapacity = function() {
			capacity++;
			if (capacity > maxCapacity) {
				capacity = 0;
				logContainer.innerHTML = "";
			}
		}
		
		this.info = function(message, object = null) {
			logContainer.innerHTML += messageHeader(object) + message + '<br />';
			checkCapacity();
			scrollToBottom();
		};
		
		this.error = function(message, object = null) {
			logContainer.innerHTML += messageHeader(object) + '<span style="color:red;">' + message + '</span><br />';
			checkCapacity();
			scrollToBottom();
		};
		
		this.clear = function() {
			logContainer.innerHTML = '';
		};
	}
	this.log = new Log('log');
})

