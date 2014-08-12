define(['scripts/tools', 'scripts/pubsub'], function(tools, pubsub) {
	return function() {
		// This holds the number of seconds this timer will run through.
		// If we set it with set() the timer will be a countdown,
		// If starts from 0 it will count forward
		var _seconds = 0;
		var _timerId;

		var _paused = false;
		var _stopped = false;

		var get = function() {
			return _seconds;
		};

		var set = function(value) {
			_seconds = value;
		};

		var start = function() {
			_stopped = false;
			_timerId = setInterval(_tick, 1000);
		};

		var pause = function() {
			_paused = true;
		};

		var resume = function() {
			_paused = false;
		};

		var stop = function() {
			_stopped = true;
		};

		var reset = function() {
			_seconds = 0;
		};

		var _tick = function() {
			if(_stopped) {
				clearInterval(_timerId);
			} else if(!_paused) {
				_seconds += 1;
				pubsub.publish('timer.tick', { seconds: _seconds, time: get_print_time() });
			}
		};

		var get_print_time = function(showHours) {
			return tools.printTimeFromSeconds(_seconds, showHours);
		};

		return {
			start: start,
			pause: pause,
			stop: stop,
			resume: resume,

			reset: reset,

			getPrint: get_print_time,

			get: get,
			set: set
		}
	}
});