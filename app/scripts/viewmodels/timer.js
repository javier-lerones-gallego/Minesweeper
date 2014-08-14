define(['scripts/services/util', 'scripts/services/pubsub'], function(utilService, pubsubService) {

	function TimerViewModel(constructor_arguments) {
		// This holds the number of seconds this timer will run through.
		// If we set it with set() the timer will be a countdown,
		// If starts from 0 it will count forward
		this.seconds = 0;
		this._timerId;

		this.paused = false;
		this.stopped = true;

		this._tick = function() {
			if(_stopped) {
				clearInterval(this._timerId);
			} else if(!this.paused) {
				this.seconds += 1;
				pubsubService.publish('timer.tick', { seconds: this.seconds, time: this.print() });
			}
		};
	};

	TimerViewModel.prototype.start  = function() {
		if(!_timerId)
			_timerId = setInterval(this._tick, 1000);
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