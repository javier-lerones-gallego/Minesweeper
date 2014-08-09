define(['jquery', 'scripts/ui', 'scripts/square', 'scripts/tools', 'scripts/timer'], function($, ui, square, tools, timer) {

	return function() {
		var self = this;

		var $board_container;
		var _board_options = {}; // store the options here

		var _timer;

		var _first_click = true;

		var _squares = [];
		var _mineIndexes = {};

		var _difficulty = 'Easy';

		// Get out of the while loop condition, avoid endless loops due to random()
		var MAXATTEMPTSRANDOMMINEINDEX = 1000;

		// Keep an index with the number of flags on the board
		var _flags = 0;

		var set_board = function(element) {
			$board_container = element;
		};

		var get_board = function() {
			return $board_container;
		};

		var create_timer = function() {
			_timer = new timer();
			_timer.reset();
			_listen_timer();
		};

		var get_timer = function() {
			return _timer;
		};

		var pause_timer = function() {
			_timer.pause();
		};

		var resume_timer = function() {
			_timer.resume();
		};

		var reset_timer = function() {
			_timer.reset();
		};

		var stop_timer = function() {
			_timer.stop();
		};

		var get_time = function(){
			_timer.get();
		};

		var _disable_board = function() {
			for(var i = 0, l = _squares.length; i < l; i++) {
				_squares[i].disable();
			}
		};

		var add_flag = function() {
			_flags += 1;
			get_board().trigger('onminecountchange', { count: _board_options.mines - _flags });
		};

		var remove_flag = function() {
			_flags -= 1;
			get_board().trigger('onminecountchange', { count: _board_options.mines - _flags });
		};

		var _create_clear_float = function() {
			return $('<div>').css('clear', 'both');
		};

		var _adjust_board_width = function() {
			switch(_board_options.length) {
				case 9:
					$board_container.removeClass('medium expert').addClass('easy');
					break;
				case 16:
					$board_container.removeClass('easy expert').addClass('medium');
					break;
				case 30:
					$board_container.removeClass('easy medium').addClass('expert');
					break;
				default:
					$board_container.removeClass('medium expert').addClass('easy');
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
			while(minesAdded < _board_options.mines && attempts < MAXATTEMPTSRANDOMMINEINDEX) {
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
			if(attempts >= MAXATTEMPTSRANDOMMINEINDEX) {
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
					newSquare.setMine(true);

				// Add the square to the squares array
				_squares.push(newSquare);
			}
		}

		var _add_squares = function() {
			for(var index = 0, last = _board_options.rows * _board_options.length; index < last; index++) {
				// set the state change event to capture flag count changes
				_squares[index].onStateChange(_on_square_state_change);
				_squares[index].onMineExploded(_on_mine_exploded);
				_squares[index].onRevealed(_check_for_game_won);
				_squares[index].onClick(_on_square_click);
				_squares[index].enableClickEvents();
				// append the square to the board
				$board_container.append(_squares[index].getSquare());
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

			// reset the first click flag
			_first_click = true;

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
				// Trigger onminecountchange so the UI refreshes on load
				get_board().trigger('onminecountchange', { count: _board_options.mines - _flags });
			}
		};

		var draw_board = function() {
			_adjust_board_width();
			_add_squares();
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
		};

		var create_easy = function() {
			_difficulty = 'Easy';
			generate_board({rows: 9, length: 9, mines: 10});
		};

		var create_medium = function() {
			_difficulty = 'Medium';
			generate_board({rows: 16, length: 16, mines: 40});
		};

		var create_expert = function() {
			_difficulty = 'Expert';
			generate_board({rows: 16, length: 30, mines: 99});
		};

		var get_difficulty = function() {
			return _difficulty;
		};

		var is_easy = function() {
			return _difficulty === 'Easy';
		};
		var is_medium = function() {
			return _difficulty === 'Medium';
		};
		var is_expert = function() {
			return _difficulty === 'Expert';
		};
		var is_custom = function() {
			return _difficulty === 'Custom';
		};

		var _show_all_mines = function() {
			for(var index = 0, l = _squares.length; index < l; index++) {
				if(_squares[index].isMine()) {
					_squares[index].showMine();
				}
			};
		};

		var _check_for_game_won = function() {
			// Conditions for game victory:
			// 1. all non mine squares have been revealed
			var victory = true;

			for(var index = 0, l = _squares.length; index < l; index++) {
				if(!_squares[index].isRevealed() && !_squares[index].isMine())
					victory = false;
			}

			if(victory) {
				get_board().trigger('ongamewon');
			}
		};

		// invoked when creating the object
		var _listen_timer = function() {
			_timer.onTick(function(event, args) {
				get_board().trigger('ontimertick', { time: args.time });
			});
		};

		// Event Handlers and Listeners
		var on_flag_count_change = function(callback) {
			get_board().on('onminecountchange', callback);
		};

		var on_game_won = function(callback) {
			get_board().on('ongamewon', callback);
		};

		var on_game_lost = function(callback) {
			get_board().on('ongamelost', callback);
		};

		var on_timer_tick = function(callback) {
			get_board().on('ontimertick', callback);
		};

		var _on_square_state_change = function(event, args) {
			if(args.state === 'flag') add_flag();
			else if(args.state === 'question') remove_flag();
		};

		var _on_mine_exploded = function(event, args) {
			// Trigger the ongamelost event
			get_board().trigger('ongamelost');
			// Show all the mines
			_show_all_mines();
			// Disable all squares
			_disable_board();
		};

		var _on_square_click = function(event, args) {
			if(_first_click) {
				_first_click = false;
				_timer.start();
			}
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
			getBoard: get_board,
			setBoard: set_board,

			createTimer: create_timer,
			getTimer: get_timer,
			pauseTimer: pause_timer,
			resumeTimer: resume_timer,
			stopTimer: stop_timer,
			resetTimer: reset_timer,
			getTime: get_time,

			createEasy: create_easy,
			createMedium: create_medium,
			createExpert: create_expert,

			generate: generate_board,
			reset: reset_board,

			show: draw_board,

			addFlag: add_flag,
			removeFlag: remove_flag,

			getDifficulty: get_difficulty,
			isEasy: is_easy,
			isMedium: is_medium,
			isExpert: is_expert,
			isCustom: is_custom,

			// Event listeners
			onFlagCountChange: on_flag_count_change,
			onGameWon: on_game_won,
			onGameLost: on_game_lost,
			onTimerTick: on_timer_tick,

			debug: log_debug
		}
	}
});