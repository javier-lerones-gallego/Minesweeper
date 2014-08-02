define(['jquery'], function($) {
	var _randomNumber = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};

	var _calculateNeighbourIndexes = function(index, options) {
		var neighbours = [];
		// index: the 0 based index of the tile we need to calculate the neighbouring indexes
		// options.rows, options.length

		var totalTiles = options.rows * options.length;

		// tiles on top: index - (options.length + 1), index - (options.length), index - (options.length - 1)
		// tiles before and after: index - 1, index + 1
		// tiles below: index + (options.length - 1), index + options.length, index + (options.length + 1)

		// corner cases:
		// four corners only have 3 neighbours
		// also edge rows don't have all neighbours
		// top row: from 1 to options.length - 2 (excluded corners)
		// bottom row: from (totalTiles - options.length + 1)  to (totalTiles - 2) (excluded corners)
		// left colum: tileIndex % options.length = 0 && tileIndex != 0 && tileIndex != (totalTiles - options.length) (excluded corners)
		// right column: tileIndex % options.length = (options.length - 1) && tileIndex != options.length - 1 && tileIndex != totalTiles - 1 (excluded corners)

		var topLeftCorner = 0;
		var topRightCorner = options.length - 1;
		var bottomLeftCorner = totalTiles - options.length - 1;
		var bottomRightCorner = totalTiles - 1;

		if(index === topLeftCorner) {
			neighbours.push(topLeftCorner + 1);
			neighbours.push(topLeftCorner + options.length);
			neighbours.push(topLeftCorner + options.length + 1);
		} else if(index === topRightCorner) {
			neighbours.push(topRightCorner - 1);
			neighbours.push(topRightCorner + options.length - 1);
			neighbours.push(topRightCorner + options.length);
		} else if(index === bottomLeftCorner) {
			neighbours.push(bottomLeftCorner - options.length);
			neighbours.push(bottomLeftCorner - options.length + 1);
			neighbours.push(bottomLeftCorner + 1);
		} else if(index=== bottomRightCorner) {
			neighbours.push(bottomRightCorner - options.length);
			neighbours.push(bottomRightCorner - options.length - 1);
			neighbours.push(bottomRightCorner - 1);
		} else if(index > 0 && index < options.length - 1) {
			// top row
			neighbours.push(index + 1);
			neighbours.push(index - 1);
			neighbours.push(index + options.length);
			neighbours.push(index + options.length - 1);
			neighbours.push(index + options.length + 1);
		} else if(index > totalTiles - options.length + 1 && index < totalTiles - 1) {
			// bottom row
			neighbours.push(index + 1);
			neighbours.push(index - 1);
			neighbours.push(index - options.length);
			neighbours.push(index - options.length - 1);
			neighbours.push(index - options.length + 1);
		} else if(index % options.length === 0 && index !== 0 && index !== totalTiles - options.length -1) {
			// left column
			neighbours.push(index - options.length);
			neighbours.push(index - options.length + 1);
			neighbours.push(index + 1);
			neighbours.push(index + options.length);
			neighbours.push(index + options.length + 1);
		} else if(index % (options.length - 1) === 0 && index !== options.length - 1 && index !== totalTiles - 1) {
			// right column
			neighbours.push(index - options.length - 1);
			neighbours.push(index - options.length);
			neighbours.push(index - 1);
			neighbours.push(index + options.length - 1);
			neighbours.push(index + options.length);
		} else {
			// every other tile
			neighbours.push(index - options.length - 1);
			neighbours.push(index - options.length);
			neighbours.push(index - options.length + 1);
			neighbours.push(index - 1);
			neighbours.push(index + 1);
			neighbours.push(index + options.length - 1);
			neighbours.push(index + options.length);
			neighbours.push(index + options.length + 1);
		}

		return neighbours;
	}

	return {
		randomNumber: _randomNumber,
		calculateNeighbours: _calculateNeighbourIndexes
	}
});