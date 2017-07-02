define(function() {
	
	function ConsoleLog() {

		this.info = function(message) {
			console.log(message);
		}

		this.error = function(message) {
			console.error(message);
		}

		this.clear = function() {
			console.clear();
		}
	}

	function DivLog() {

		var maxCapacity = 1000;
		var capacity = 0;
		
		var logContainer = document.getElementById('log');

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

		this.info = function(message) {
			if (logContainer == null) 
				return;

			logContainer.innerHTML += message + '<br />';
			checkCapacity();
			scrollToBottom();
		};
		
		this.error = function(message) {
			if (logContainer == null) 
				return;

			logContainer.innerHTML += '<span style="color:red;">' + message + '</span><br />';
			checkCapacity();
			scrollToBottom();
		};

		this.clear = function() {
			if (logContainer == null) 
				return;

			logContainer.innerHTML = '';
		};
	}

	function Log() {
		
		var consoleLog = new ConsoleLog();
		var divLog = new DivLog();

		var messageHeader = function(object) {
			var dt = '[' + getDateTime() + ']';
			if (object == null)
				return dt + ': ';
			else
				return dt + ' ' + object.constructor.name.toUpperCase() + ': ';
		};
		
		this.info = function(message, caller = null) {
			var msg = messageHeader(caller) + message;
			consoleLog.info(msg);
			divLog.info(msg);
		}
		
		this.error = function(message, caller = null) {
			var msg = messageHeader(caller) + message;
			consoleLog.error(msg);
			divLog.error(msg);
		}
		
		this.clear = function() {
			consoleLog.clear();
			divLog.clear();
		}
	}

	this.log = new Log();
})

