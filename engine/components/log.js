define(function () {

	class ConsoleLog {
		constructor() {
			this.info = function (message) {
				console.log(message);
			};

			this.error = function (message) {
				console.error(message);
			};

			this.clear = function () {
				console.clear();
			};
		}
	}

	class DivLog {
		constructor() {
			let maxCapacity = 1000;
			let capacity = 0;
			let logContainer = document.getElementById('log');

			let scrollToBottom = function () {
				logContainer.scrollTop = logContainer.scrollHeight;
			};

			let checkCapacity = function () {
				capacity++;
				if (capacity > maxCapacity) {
					capacity = 0;
					logContainer.innerHTML = "";
				}
			};

			this.info = function (message) {
				if (logContainer == null)
					return;
				logContainer.innerHTML += message + '<br />';
				checkCapacity();
				scrollToBottom();
			};

			this.error = function (message) {
				if (logContainer == null)
					return;
				logContainer.innerHTML += '<span style="color:red;">' + message + '</span><br />';
				checkCapacity();
				scrollToBottom();
			};

			this.clear = function () {
				if (logContainer == null)
					return;
				logContainer.innerHTML = '';
			};
		}
	}

	class Log {
		constructor() {
			let consoleLog = new ConsoleLog();
			let divLog = new DivLog();

			let messageHeader = function (object) {
				var dt = '[' + getDateTime() + ']';
				if (object == null)
					return dt + ': ';
				else
					return dt + ' ' + object.constructor.name.toUpperCase() + ': ';
			};

			this.info = function (message, caller = null) {
				let msg = messageHeader(caller) + message;
				consoleLog.info(msg);
				divLog.info(msg);
			};

			this.error = function (message, caller = null) {
				let msg = messageHeader(caller) + message;
				consoleLog.error(msg);
				divLog.error(msg);
			};

			this.clear = function () {
				consoleLog.clear();
				divLog.clear();
			};
		}
	}

	this.log = new Log();
})

