define(['jquery'], function($) {
	var _randomNumber = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};

	var _calculateNeighbourIndexes = function(index, options) {
		// index: the 0 based index of the tile we need to calculate the neighbouring indexes
		// options.rows, options.length
		
		var totalTiles = options.rows * options.length;

		// tiles on top: index - (options.length + 1), index - (options.length), index - (options.length - 1)
		// tiles before and after: index - 1, index + 1
		// tiles below: index + (options.length - 1), index + options.length, index + (options.length + 1)
		
		// corner cases: 
		// four corners only have 3 neighbours
		// 
		// 
		// also edge rows don't have all neighbours
		// 
		// top row: from 1 to options.length - 2 (excluded corners)
		// bottom row: from (totalTiles - options.length + 1)  to (totalTiles - 2) (excluded corners)
		// left colum: tileIndex % options.length = 0 (exclude corners)
		// right column: tileIndex % options.length = (options.length - 1) (exclude corners)
		
	}

	return {
		randomNumber: _randomNumber,
		calculateNeighbours: _calculateNeighbourIndexes
	}
});