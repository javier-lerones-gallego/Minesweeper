
define(['jquery'], function($) {
	return function(options) {
		var o = $('<b/>');

		var _subscribe = function(topic, fn) {
			// Call fn, stripping out the 1st argument (the event object).
		    function wrapper() {
		      return fn.apply( this, Array.prototype.slice.call( arguments, 1 ) );
		    }

		    // Add .guid property to function to allow it to be easily unbound. Note
		    // that $.guid is new in jQuery 1.4+, and $.event.guid was used before.
		    wrapper.guid = fn.guid = fn.guid || ( $.guid ? $.guid++ : $.event.guid++ );

		    // Bind the handler.
		    o.on( topic, wrapper );
		};

		// Unsubscribe from a topic.
	  	var _unsubscribe = function() {
	    	o.off.apply( o, arguments );
	  	};

	  	// Publish a topic
	  	var _publish = function() {
	    	o.trigger.apply( o, arguments );
	  	};

		// Reveal
		return {
			subscribe: _subscribe,
			publish: _publish,
			unsubscribe: _unsubscribe
		}
	};

});