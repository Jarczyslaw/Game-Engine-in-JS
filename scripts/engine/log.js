define(function() {
	
	function Log(logContainerId) {
		
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
		
		this.info = function(message, object = null) {
			logContainer.innerHTML += messageHeader(object) + message + '<br />';
			scrollToBottom();
		};
		
		this.error = function(message, object = null) {
			logContainer.innerHTML += messageHeader(object) + '<span style="color:red;">' + message + '</span><br />';
			scrollToBottom();
		};
		
		this.clear = function() {
			logContainer.innerHTML = '';
		};
	}
	this.log = new Log('log');
})

