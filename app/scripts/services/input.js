
define(['scripts/services/pubsub'], function(pubsubService) {
	var instance;

	function singletonConstructor(options) {

		var self = this;

		

	};

	return {
		// Singleton getInstance(defaults)
        getInstance: function (options) {
            if (instance === undefined) {
                instance = new singletonConstructor(options);
            }
            return instance;
        }
	};

});