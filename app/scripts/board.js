define(['jquery', 'scripts/tile'], function($, tile) {

	return function(element) {
		var $element = element;
		var _tiles = {}; // Who wants to use arrays these days?

		var getElement = function() {
			return $element;
		};

		var createClearFloat = function() {
			return $('<div>').css('clear', 'both');
		};

		///
		/// Creates a new board
		var generate = function(options) {
			// options.rows: number of rows in the board
			// options.length: length of each row
			for(var index = 1, last = options.rows * options.length; index <= last; index++) {
				// Create a new jqueryfied button for the UI
				var $tile = $('<button>').attr('type', 'button').addClass("btn3d btn btn-primary cell");
				
				// Instantiate a new tile with the jqueryfied button
				var newTile = new tile($tile);

				// append the tile to the board
				$element.append($tile);
			}

			$element.append(createClearFloat());
		};


		return {
			getElement: getElement,

			generate: generate
		}
	}
});