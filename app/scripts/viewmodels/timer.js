define(['scripts/services/util', 'scripts/services/pubsub'], function(utilService, pubsubService) {

	function TimerViewModel(constructor_arguments) {
		// This holds the number of seconds this timer will run through.
		// If we set it with set() the timer will be a countdown,
		// If starts from 0 it will count forward
		var self = this;
		
		this.seconds = 0;
		this._timerId;

		this.paused = false;
		this.stopped = true;

		this._tick = function() {
			if(self._stopped) {
				clearInterval(self._timerId);
			} else if(!self.paused) {
				self.seconds += 1;
				pubsubService.publish('timer.tick', { seconds: self.seconds, time: self.toString() });
			}
		};
	};

	TimerViewModel.prototype.start  = function() {
		if(!this._timerId)
			this._timerId = setInterval(this._tick, 1000);
		this.stopped = false;
	};

	TimerViewModel.prototype.pause = function() {
		this.paused = true;
	};

	TimerViewModel.prototype.resume = function() {
		this.paused = false;
	};

	TimerViewModel.prototype.stop = function() {
		this.stopped = true;
	};

	TimerViewModel.prototype.reset = function() {
		this.seconds = 0;
	};

	TimerViewModel.prototype.toString = function(showHours) {
		return utilService.printTimeFromSeconds(this.seconds, showHours);
	};

	return TimerViewModel;
});