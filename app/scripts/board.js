define(['jquery', 'scripts/ui', 'scripts/square', 'scripts/tools', 'scripts/timer', 'scripts/pubsub'], function($, ui, square, tools, timer, pubsub) {

	return function() {

		var _board_options = {}; // store the options here
		var _timer;
		var _first_click = true;
		var _squares = [];
		var _mineIndexes = {};
		// Get out of the while loop condition, avoid endless loops due to random()
		var MAXATTEMPTSRANDOMMINEINDEX = 1000;
		// Keep an index with the number of flags on the board
		var _flags = 0;

		var create_timer = function() {
			_timer = new timer();
			_timer.reset();
		};

		var get_timer = function() {
			return _timer;
		};

		var _disable_board = function() {
			for(var i = 0, l = _squares.length; i < l; i++) {
				_squares[i].disable();
			};
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
			while(added < options.mines && attempts < MAXATTEMPTSRANDOMMINEINDEX) {
				// Get a random index
				var newIndex = tools.randomNumber(0, (options.rows * options.length) - 1);
				// If it doesn't exist, add it to the indexes
				if(!mines[newIndex]) {
					mines[newIndex] = newIndex; // Keep the value too for easier lookups
					added += 1;
				}
				attempts += 1; // Because having an operator just for the number 1 case is STUPID
			}
			// Show an error message if attempts went over the max
			if(attempts >= MAXATTEMPTSRANDOMMINEINDEX) {
				throw new Error("Went over the maximum number of attempts allowed to calculate random positions for the mines.");
			}
			// Return the indexes
			return mines;
		}


		var _create_squares = function(_mines) {
			// Now generate the squares, and if the index has a bomb, mark it as bomb
			// _board_options.rows: number of rows in the board
			// _board_options.length: length of each row
			for(var index = 0, last = _board_options.rows * _board_options.length; index < last; index++) {
				// Instantiate a new square with the jqueryfied button
				var newSquare = new square();

				// Is it a bomb?
				// TODO: This probably should be moved into the square constructor
				newSquare.setMine(_mines[index]);

				// Add the square to the squares array
				_squares.push(newSquare);
			}

			// Right after the square objects are created, find the neighbour squares for each one
			_assign_neighbours();
		}

		var _assign_neighbours = function() {
			// traverse the board one more time and add the neighbours to each square
			for(var squareIndex = 0, lastTile = _squares.length; squareIndex < lastTile; squareIndex += 1) {
				var neighbours = tools.calculateNeighbours(squareIndex, _board_options);

				for(var nindex = 0, nlen = neighbours.length; nindex < nlen; nindex++) {
					_squares[squareIndex].addNeighbour(_squares[neighbours[nindex]]);
				};
			};
		}

		///
		/// Creates a new board
		///
		var generate_board = function(options) {
			// Store the options internally
			_board_options = options;

			// reset the first click flag
			_first_click = true;

			// first randomize the mines
			// _board_options.mines: count of total mines, cannot be greater than the total amount
			if(_board_options.mines >= _board_options.rows * _board_options.length) {
				throw new Error("Oops, can't create more mines than squares in the board.")
			} else {
				// Good to go
				_create_squares(_get_random_mines(_board_options));

				// Trigger onminecountchange so the UI refreshes on load
				pubsub.publish('game.flag.change', { count: _board_options.mines - _flags });
			}
		};

		var draw_board = function() {
			ui.adjustBoardWidth(_board_options);
			ui.addSquaresToBoard(_squares, _board_options);
		};

		///
		/// Clears and Resets the board
		///
		var reset_board = function() {
			// Clear the variables
			_squares = [];
			_mineIndexes = {};
			_flags = 0;

			// Empty the UI board element
			ui.emptyBoard();
		};

		var create_easy = function() {
			generate_board({rows: 9, length: 9, mines: 10, difficulty: 'Easy'});
		};

		var create_medium = function() {
			generate_board({rows: 16, length: 16, mines: 40, difficulty: 'Medium'});
		};

		var create_expert = function() {
			generate_board({rows: 16, length: 30, mines: 99, difficulty: 'Expert'});
		};

		var get_difficulty = function() {
			return _board_options.difficulty;
		};

		var is_easy = function() {
			return _board_options.difficulty === 'Easy';
		};
		var is_medium = function() {
			return _board_options.difficulty === 'Medium';
		};
		var is_expert = function() {
			return _board_options.difficulty === 'Expert';
		};
		var is_custom = function() {
			return _board_options.difficulty === 'Custom';
		};

		var _show_all_mines = function() {
			for(var index = 0, l = _squares.length; index < l; index++) {
				if(_squares[index].isMine()) {
					_squares[index].showMine();
				}
			};
		};


		// Event Handlers and Listeners
		var on_flag_added = function() {
			pubsub.publish('game.flag.change', { count: _board_options.mines - ++_flags });
		};

		var on_flag_removed = function() {
			pubsub.publish('game.flag.change', { count: _board_options.mines - --_flags });
		};

		var on_mine_exploded = function(event, args) {
			// Trigger the ongamelost event
			pubsub.publish('game.lost');
			// Show all the mines
			_show_all_mines();
			// Disable all squares
			_disable_board();
		};

		var on_square_revealed = function() {
			// Conditions for game victory:
			// 1. all non mine squares have been revealed
			var victory = true;

			for(var index = 0, l = _squares.length; index < l; index++) {
				if(!_squares[index].isRevealed() && !_squares[index].isMine())
					victory = false;
			}

			if(victory) {
				pubsub.publish('game.won');
			}
		};

		var on_square_clicked = function(event, args) {
			if(_first_click) {
				_first_click = false;
				_timer.start();
			}
		};


		var create_subscriptions = function() {
			pubsub.subscribe('board.flag.added', on_flag_added);
			pubsub.subscribe('board.flag.removed', on_flag_removed);
			pubsub.subscribe('board.mine.exploded', on_mine_exploded);
			pubsub.subscribe('board.square.revealed', on_square_revealed);
			pubsub.subscribe('board.square.clicked', on_square_clicked);
		};

		var log_debug = function() {
			console.log('Board Options: ', _board_options)
			var debug_table = [];
			for(var columns = 0; columns < _board_options.length; columns++) {
				var debug_row = [];
				for(var rows = 0; rows < _board_options.rows; rows++) {
					debug_row.push(_squares[(columns * _board_options.length) + rows].getDebugContent());
				}
				debug_table.push(debug_row);
			}
			console.table(debug_table);
		};

		return {
			createTimer: create_timer,
			getTimer: get_timer,

			createEasy: create_easy,
			createMedium: create_medium,
			createExpert: create_expert,

			createSubscriptions: create_subscriptions,

			generate: generate_board,
			reset: reset_board,

			show: draw_board,

			getDifficulty: get_difficulty,
			isEasy: is_easy,
			isMedium: is_medium,
			isExpert: is_expert,
			isCustom: is_custom,

			debug: log_debug
		}
	}
});