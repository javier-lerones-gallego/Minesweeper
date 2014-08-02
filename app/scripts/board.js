define(['jquery', 'scripts/tile', 'scripts/tools'], function($, tile, tools) {

	return function(element, debug) {
		var $element = element;
		var $debug = debug;

		var _tiles = [];
		var _bombsIndexes = {};

		var _drawDebugBoard = false;

		// Get out of the while loop condition, avoid endless loops due to random()
		var _maxAttemptsToGetBombIndex = 1000;

		var getElement = function() {
			return $element;
		};

		var createClearFloat = function() {
			return $('<div>').css('clear', 'both');
		};

		var draw_debug = function(enable) {
			if(enable) {
				for(var index = 0, len = _tiles.length; index < len; index++) {
					// Create a new jqueryfied button for the UI
					var $debugtile = $('<button>').attr('type', 'button').addClass("btn btn-primary cell disabled").html(_tiles[index].getContentHtml());

					// append the tile to the board
					debug.append($debugtile); 
				}

				$debug.append(createClearFloat());
			}
		};

		///
		/// Creates a new board
		///
		var generate = function(options) {
			// keep this in a var to avoid recalculating constantly
			var totalTiles = options.rows * options.length;
			// first randomize the bombs
			// options.bombs: count of total bombs, cannot be greater than the total amount
			if(options.bombs >= totalTiles) {
				throw new Error("Oops, can't create more bombs than tiles in the board.")
			} else {
				var attempts = 0;
				var bombsAdded = 0;
				while(bombsAdded < options.bombs && attempts < _maxAttemptsToGetBombIndex) {
					// Get a random index
					var newIndex = tools.randomNumber(0, totalTiles - 1);
					// If it doesn't exist, add it to the indexes
					if(!_bombsIndexes[newIndex]) {
						_bombsIndexes[newIndex] = newIndex; // Keep the value too for easier lookups
						bombsAdded += 1;
					}
					attempts += 1; // Because having an operator just for the number 1 case is STUPID
				}
			}

			// Now generate the tiles, and if the index has a bomb, mark it as bomb
			// options.rows: number of rows in the board
			// options.length: length of each row
			for(var index = 0, last = options.rows * options.length; index < last; index++) {

				// Create a new jqueryfied button for the UI
				var $tile = $('<button>').attr('type', 'button').addClass("btn3d btn btn-primary cell");

				// Instantiate a new tile with the jqueryfied button
				var newTile = new tile($tile);

				// append the tile to the board
				$element.append($tile);

				// Is it a bomb?
				if(_bombsIndexes[index])
					newTile.isBomb(true);

				// Add the tile to the tiles array
				_tiles.push(newTile);
			}

			$element.append(createClearFloat());

			// traverse the board one more time and add the neighbours to each tile
			for(var tileIndex = 0, lastTile = _tiles.length; tileIndex < lastTile; tileIndex += 1) {
				var neighbours = tools.calculateNeighbours(tileIndex, options);

				for(var nindex = 0, nlen = neighbours.length; nindex < nlen; nindex++) {
					_tiles[tileIndex].addNeighbour(_tiles[nindex]);
				};
			};
		};


		return {
			getElement: getElement,

			generate: generate,

			debug: draw_debug
		}
	}
});