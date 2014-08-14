define(['jquery'], function($) {
	var _random_number = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};

	var _calculate_neighbour_indexes = function(index, options) {
		var neighbours = [];
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
			neighbours.push(topLeftCorner + 1);
			neighbours.push(topLeftCorner + options.columns);
			neighbours.push(topLeftCorner + options.columns + 1);
		} else if(index === topRightCorner) {
			neighbours.push(topRightCorner - 1);
			neighbours.push(topRightCorner + options.columns - 1);
			neighbours.push(topRightCorner + options.columns);
		} else if(index === bottomLeftCorner) {
			neighbours.push(bottomLeftCorner - options.columns);
			neighbours.push(bottomLeftCorner - options.columns + 1);
			neighbours.push(bottomLeftCorner + 1);
		} else if(index=== bottomRightCorner) {
			neighbours.push(bottomRightCorner - options.columns);
			neighbours.push(bottomRightCorner - options.columns - 1);
			neighbours.push(bottomRightCorner - 1);
		} else if(index > 0 && index < options.columns - 1) {
			// top row
			neighbours.push(index + 1);
			neighbours.push(index - 1);
			neighbours.push(index + options.columns);
			neighbours.push(index + options.columns - 1);
			neighbours.push(index + options.columns + 1);
		} else if(index > totalTiles - options.columns && index < totalTiles - 1) {
			// bottom row
			neighbours.push(index + 1);
			neighbours.push(index - 1);
			neighbours.push(index - options.columns);
			neighbours.push(index - options.columns - 1);
			neighbours.push(index - options.columns + 1);
		} else if(index % options.columns === 0 && index !== 0 && index !== totalTiles - options.columns -1) {
			// left column
			neighbours.push(index - options.columns);
			neighbours.push(index - options.columns + 1);
			neighbours.push(index + 1);
			neighbours.push(index + options.columns);
			neighbours.push(index + options.columns + 1);
		} else if(index % options.columns === (options.columns - 1) && index !== options.columns - 1 && index !== totalTiles - 1) {
			// right column
			neighbours.push(index - options.columns - 1);
			neighbours.push(index - options.columns);
			neighbours.push(index - 1);
			neighbours.push(index + options.columns - 1);
			neighbours.push(index + options.columns);
		} else {
			// every other tile
			neighbours.push(index - options.columns - 1);
			neighbours.push(index - options.columns);
			neighbours.push(index - options.columns + 1);
			neighbours.push(index - 1);
			neighbours.push(index + 1);
			neighbours.push(index + options.columns - 1);
			neighbours.push(index + options.columns);
			neighbours.push(index + options.columns + 1);
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

	return {
		randomNumber: _random_number,
		calculateNeighbours: _calculate_neighbour_indexes,
		printTimeFromSeconds: _print_time_from_seconds
	}
});