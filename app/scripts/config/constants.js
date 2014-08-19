define([], function() {
	// Get out of the while loop condition, avoid endless loops due to random()
	var _MAX_ATTEMPTS_RANDOM_MINE_INDEX = 1000;

	// Store the default properties for the basic games here, this helps to avoid comparing strings
	var _BOARD_OPTIONS = {
		easy: {
			difficulty: 'Easy',
			rows: 9,
			columns: 9,
			mines: 10
		},
		medium: {
			difficulty: 'Medium',
			rows: 16,
			columns: 16,
			mines: 40
		},
		expert: {
			difficulty: 'Expert',
			rows: 30,
			columns: 16,
			mines: 99
		},
		custom: {
			difficulty: 'Custom'
		}
	}

	return {
		MAX_ATTEMPTS_RANDOM_MINE_INDEX: _MAX_ATTEMPTS_RANDOM_MINE_INDEX,
		BOARD_OPTIONS: _BOARD_OPTIONS
	}
});