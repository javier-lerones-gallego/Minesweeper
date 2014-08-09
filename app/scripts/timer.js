define(['jquery'], function($) {
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
		_timerId = setInterval(_tick, 1000);
	};

	var pause = function() {
		_paused = true;
	};

	var stop = function() {
		_stopped = true;
	};

	var _tick = function() {
		if(!_paused) {
			_seconds += 1;
			$(document).trigger('tick', { seconds: _seconds });
		} else if(_stopped) {
			clearInterval(_timerId);
		}
	};

	var onTick = function(handler) {
		$(document).on('tick', handler);
	};

	return {
		start: start,
		pause: pause,
		stop: stop,

		tick: onTick,

		get: get,
		set: set
	}
});