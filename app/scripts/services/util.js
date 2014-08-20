define(['scripts/config/constants'], function(constantsService) {
	var self = this;

	var _random_number = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};

	var _calculate_neighbour_indexes = function(index, options) {
		var neighbours = {};
		// index: the 0 based index of the tile we need to calculate the neighbouring indexes
		// options.rows, options.length

		var totalTiles = options.rows * options.columns;

		// special cases:
		// four corners only have 3 neighbours
		// also edge rows only have 5 neighbours

		var topLeftCorner = 0;
		var topRightCorner = options.columns - 1;
		var bottomLeftCorner = totalTiles - options.columns;
		var bottomRightCorner = totalTiles - 1;

		if(index === topLeftCorner) {
			neighbours[topLeftCorner + 1] = true;
			neighbours[topLeftCorner + options.columns] = true;
			neighbours[topLeftCorner + options.columns + 1] = true;
		} else if(index === topRightCorner) {
			neighbours[topRightCorner - 1] = true;
			neighbours[topRightCorner + options.columns - 1] = true;
			neighbours[topRightCorner + options.columns] = true;
		} else if(index === bottomLeftCorner) {
			neighbours[bottomLeftCorner - options.columns] = true;
			neighbours[bottomLeftCorner - options.columns + 1] = true;
			neighbours[bottomLeftCorner + 1] = true;
		} else if(index=== bottomRightCorner) {
			neighbours[bottomRightCorner - options.columns] = true;
			neighbours[bottomRightCorner - options.columns - 1] = true;
			neighbours[bottomRightCorner - 1] = true;
		} else if(index > 0 && index < options.columns - 1) {
			// top row
			neighbours[index + 1] = true;
			neighbours[index - 1] = true;
			neighbours[index + options.columns] = true;
			neighbours[index + options.columns - 1] = true;
			neighbours[index + options.columns + 1] = true;
		} else if(index > totalTiles - options.columns && index < totalTiles - 1) {
			// bottom row
			neighbours[index + 1] = true;
			neighbours[index - 1] = true;
			neighbours[index - options.columns] = true;
			neighbours[index - options.columns - 1] = true;
			neighbours[index - options.columns + 1] = true;
		} else if(index % options.columns === 0 && index !== 0 && index !== totalTiles - options.columns -1) {
			// left column
			neighbours[index - options.columns] = true;
			neighbours[index - options.columns + 1] = true;
			neighbours[index + 1] = true;
			neighbours[index + options.columns] = true;
			neighbours[index + options.columns + 1] = true;
		} else if(index % options.columns === (options.columns - 1) && index !== options.columns - 1 && index !== totalTiles - 1) {
			// right column
			neighbours[index - options.columns - 1] = true;
			neighbours[index - options.columns] = true;
			neighbours[index - 1] = true;
			neighbours[index + options.columns - 1] = true;
			neighbours[index + options.columns] = true;
		} else {
			// every other tile
			neighbours[index - options.columns - 1] = true;
			neighbours[index - options.columns] = true;
			neighbours[index - options.columns + 1] = true;
			neighbours[index - 1] = true;
			neighbours[index + 1] = true;
			neighbours[index + options.columns - 1] = true;
			neighbours[index + options.columns] = true;
			neighbours[index + options.columns + 1] = true;
		}

		return neighbours;
	}


	var _print_time_from_seconds = function(_seconds, showHours) {
		var sec_num = parseInt(_seconds, 10); // don't forget the second param
	    	var hours   = Math.floor(sec_num / 3600);
	    	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	    	var seconds = sec_num - (hours * 3600) - (minutes * 60);

	    	if (hours   < 10) {hours   = "0"+hours;}
	    	if (minutes < 10) {minutes = "0"+minutes;}
	    	if (seconds < 10) {seconds = "0"+seconds;}
	    	var time    = '';
	    	if(showHours)
	    		time = hours+':'+minutes+':'+seconds;
	    	else
	    		time = minutes+':'+seconds;
	    	return time;
	};

	var _get_random_mines = function(options) {
			// The array to stored the indexes
			var mines = [];
			// Current attempts
			var attempts = 0;
			// Current number of mines added
			var added = 0;
			// Do either until we randomize the total number of mines,
			// or until we go over the maximum number of attempts
			while(added < options.mines && attempts < constantsService.MAX_ATTEMPTS_RANDOM_MINE_INDEX) {
				// Get a random index
				var newIndex = this.randomNumber(0, (options.rows * options.columns) - 1);
				// If it doesn't exist, add it to the indexes
				if(!mines[newIndex]) {
					mines[newIndex] = newIndex; // Keep the value too for easier lookups
					added += 1;
				}
				attempts += 1; // Because having an operator just for the number 1 case is STUPID
			}
			// Show an error message if attempts went over the max
			if(attempts >= constantsService.MAX_ATTEMPTS_RANDOM_MINE_INDEX) {
				throw new Error("Went over the maximum number of attempts allowed to calculate random positions for the mines.");
			}
			// Return the indexes
			return mines;
		};

	return {
		randomNumber: _random_number,
		calculateNeighbours: _calculate_neighbour_indexes,
		printTimeFromSeconds: _print_time_from_seconds,
		getRandomMines: _get_random_mines
	}
});