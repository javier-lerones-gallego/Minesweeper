
define(['jquery'], function($) {
	var mediator = $('<b/>');
	return {

		subscribe: function(topic, fn) {
			// Call fn, stripping out the 1st argument (the event object).
		    function wrapper() {
		      return fn.apply( this, Array.prototype.slice.call( arguments, 1 ) );
		    }

		    // Add .guid property to function to allow it to be easily unbound. Note
		    // that $.guid is new in jQuery 1.4+, and $.event.guid was used before.
		    wrapper.guid = fn.guid = fn.guid || ( $.guid ? $.guid++ : $.event.guid++ );

		    // Bind the handler.
		    mediator.on( topic, wrapper );
		},

		// Unsubscribe from a topic.
	  	unsubscribe: function() {
	    	mediator.off.apply( mediator, arguments );
	  	},

	  	// Publish a topic
	  	publish: function() {
	    	mediator.trigger.apply( mediator, arguments );
	  	}
	};

});