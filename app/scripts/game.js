define(['jquery', 'scripts/square', 'scripts/tools'], function($, square, tools) {

	return function(element, debug) {
		var self = this;

		var $board_container = element;
		var $debug_container = debug;

		var _board_options = {}; // store the options here

		var _squares = [];
		var _mineIndexes = {};

		// Get out of the while loop condition, avoid endless loops due to random()
		var _max_attempts_random_mine_index = 1000;

		// Keep an index with the number of flags on the board
		var _flags = 0;

		// Store the game state
		var _state = null;
		// possible values:
		// null: not started not generated
		// started: generated and started
		// won: generated and finished correctly
		// lost: generated and finished incorrectly

		var get_element = function() {
			return $board_container;
		};
		var get_debug_element = function() {
			return $debug_container;
		};

		var add_flag = function() {
			_flags += 1;
			$('#minesleft').html(_flags);
		};

		var remove_flag = function() {
			_flags -= 1;
			$('#minesleft').html(_flags);
		};

		var _create_clear_float = function() {
			return $('<div>').css('clear', 'both');
		};

		var draw_debug = function() {
			for(var index = 0, len = _squares.length; index < len; index++) {
				// Create a new jqueryfied button for the UI
				var $debug_square = $('<button>').attr('type', 'button').addClass("btn btn-primary cell").html(_squares[index].getContentHtml());

				// append the square to the board
				$debug_container.append($debug_square);

				// add the debugelement to the square object
				_squares[index].addDebugElement($debug_square);
			}
			// add the float clear at the end
			$debug_container.append(_create_clear_float());
		};

		var hide_debug = function() {
			$debug_container.empty();
		};

		var _adjust_board_width = function() {
			// 43.33 pixes per square
			switch(_board_options.length) {
				case 9:
					$board_container.removeClass('medium expert').addClass('easy');
					$debug_container.removeClass('medium expert').addClass('easy');
					break;
				case 16:
					$board_container.removeClass('easy expert').addClass('medium');
					$debug_container.removeClass('easy expert').addClass('medium');
					break;
				case 30:
					$board_container.removeClass('easy medium').addClass('expert');
					$debug_container.removeClass('easy medium').addClass('expert');
					break;
				default:
					$board_container.removeClass('medium expert').addClass('easy');
					$debug_container.removeClass('medium expert').addClass('easy');
					break;
			}
		};

		var _randomize_mines = function() {
			// Current attempts
			var attempts = 0;
			// Current number of mines added
			var minesAdded = 0;
			// Do either until we randomize the total number of mines,
			// or until we go over the maximum number of attempts
			while(minesAdded < _board_options.mines && attempts < _max_attempts_random_mine_index) {
				// Get a random index
				var newIndex = tools.randomNumber(0, (_board_options.rows * _board_options.length) - 1);
				// If it doesn't exist, add it to the indexes
				if(!_mineIndexes[newIndex]) {
					_mineIndexes[newIndex] = newIndex; // Keep the value too for easier lookups
					minesAdded += 1;
				}
				attempts += 1; // Because having an operator just for the number 1 case is STUPID
			}
			// Show an error message if attempts went over the max
			if(attempts >= _max_attempts_random_mine_index) {
				throw new Error("Went over the maximum number of attempts allowed to calculate random positions for the mines.");
			}
		}


		var _create_squares = function() {
			// Now generate the squares, and if the index has a bomb, mark it as bomb
			// _board_options.rows: number of rows in the board
			// _board_options.length: length of each row
			for(var index = 0, last = _board_options.rows * _board_options.length; index < last; index++) {
				// Instantiate a new square with the jqueryfied button
				var newSquare = new square();

				// Is it a bomb?
				if(_mineIndexes[index])
					newSquare.setBomb(true);

				// Add the square to the squares array
				_squares.push(newSquare);
			}
		}

		var _add_squares = function() {
			for(var index = 0, last = _board_options.rows * _board_options.length; index < last; index++) {
				// append the square to the board
				$board_container.append(_squares[index].getElement());
			}
			// Add the clear float div to the end
			$board_container.append(_create_clear_float());
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

			// keep this in a var to avoid recalculating constantly
			var totalTiles = _board_options.rows * _board_options.length;

			// first randomize the mines
			// _board_options.mines: count of total mines, cannot be greater than the total amount
			if(_board_options.mines >= totalTiles) {
				throw new Error("Oops, can't create more mines than squares in the board.")
			} else {
				_randomize_mines();
				_create_squares();
				_assign_neighbours();
			}
		};

		var draw_board = function() {
			_adjust_board_width();
			_add_squares();
		};

		var hide_board = function() {

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
			$board_container.empty();

			// Empty the debug element
			$debug_container.empty();
		};

		var _set_state = function(state) {
			_state = state;
		};

		var set_state_started = function() {
			_set_state('started');
		};
		var set_state_gameover = function() {
			_set_state('lost');
		};
		var set_state_won = function() {
			_set_state('won');
		};

		var get_state = function() {
			return _state;
		};

		var is_started = function() {
			return _state === 'started';
		};

		var is_won = function() {
			return _state === 'won';
		};

		var is_lost = function() {
			return _state === 'lost';
		};

		var create_easy = function() {
			generate_board({rows: 9, length: 9, mines: 10});
		};

		var create_moderate = function() {
			generate_board({rows: 16, length: 16, mines: 40});
		};

		var create_expert = function() {
			generate_board({rows: 16, length: 30, mines: 99});
		};

		return {
			getElement: get_element,
			getDebugElement: get_debug_element,

			createEasy: create_easy,
			createModerate: create_moderate,
			createExpert: create_expert,

			generate: generate_board,
			reset: reset_board,

			show: draw_board,
			hide: hide_board,

			addFlag: add_flag,
			removeFlag: remove_flag,

			gameStart: set_state_started,
			gameOver: set_state_gameover,
			gameWon: set_state_won,

			getState: get_state,
			isStarted: is_started,
			isWon: is_won,
			isLost: is_lost,

			showDebug: draw_debug,
			hideDebug: hide_debug
		}
	}
});