define(['scripts/viewmodels/square', 'scripts/viewmodels/timer', 'scripts/services/pubsub', 'scripts/config/constants', 'scripts/services/util'], function(SquareViewModel, TimerViewModel, pubsubService, constantsService, utilService) {

	function BoardViewModel(constructor_arguments) {
		var self = this;
		// The viewmodel variables
		this.boardOptions = {}; // store the options here
		this.timer = new TimerViewModel();
		this.firstClick = true;
		this.squares = [];

		// Keep an index with the number of flags on the board
		this.flags = 0;
		// And another one with the number of revealed squares on the board
		this.revealed = 0;

		// Private functions
		this._disable = function() {
			this.squares.forEach(function(s) {
				s.disable();
			});
		};

		this._get_random_mines = function() {
			// The array to stored the indexes
			var mines = [];
			// Current attempts
			var attempts = 0;
			// Current number of mines added
			var added = 0;
			// Do either until we randomize the total number of mines,
			// or until we go over the maximum number of attempts
			while(added < this.boardOptions.mines && attempts < constantsService.MAX_ATTEMPTS_RANDOM_MINE_INDEX) {
				// Get a random index
				var newIndex = utilService.randomNumber(0, (this.boardOptions.rows * this.boardOptions.columns) - 1);
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

		this._show_all_mines = function() {
			this.squares.forEach(function(s, i) {
				if(s.isMine()) s.showMine();
			});
		};

		this._create_squares = function(mines) {
			// Now generate the squares, and if the index has a bomb, mark it as bomb
			// this.boardOptions.rows: number of rows in the board
			// this.boardOptions.length: length of each row
			for(var index = 0, last = this.boardOptions.rows * this.boardOptions.columns; index < last; index++) {
				// Add the square to the squares array
				this.squares.push(new SquareViewModel({ id: index, isMine: mines[index] }));
			};

			// Right after the square objects are created, find the neighbour squares for each one
			this._assign_neighbours();
		};

		this._assign_neighbours = function() {
			var self = this;
			// traverse the board one more time and add the neighbours to each square
			this.squares.forEach(function(s, si) {
				utilService.calculateNeighbours(si, self.boardOptions).forEach(function(n, ni) {
					self.squares[si].addNeighbour(self.squares[n]);
				});
			});
		};

		// Event Handlers and Listeners
		this.on_flag_added = function() {
			pubsubService.publish('flag.change', { count: self.boardOptions.mines - ++self.flags });
		};

		this.on_flag_removed = function() {
			pubsubService.publish('flag.change', { count: self.boardOptions.mines - --self.flags });
		};

		this.on_mine_exploded = function(event, args) {
			// Trigger the ongamelost event
			pubsubService.publish('game.lost');
			// Show all the mines
			self._show_all_mines();
			// Disable all squares
			self._disable();
		};

		this.on_square_revealed = function() {
			if(self._is_victory()) {
				pubsubService.publish('game.won');
			}
		};

		this.on_square_clicked = function(event, args) {
			if(self.firstClick) {
				self.firstClick = false;
				self.timer.start();
			}
		};

		this._is_victory = function() {
			// Conditions for game victory:
			// 1. all non mine squares have been revealed
			return this.revealed === (this.boardOptions.rows * this.boardOptions.columns) - this.boardOptions.mines;
		};

		//
		// Pretty much this is the constructor logic
		//
		// First: Create the subscriptions
		pubsubService.subscribe('board.flag.added', this.on_flag_added);
		pubsubService.subscribe('board.flag.removed', this.on_flag_removed);
		pubsubService.subscribe('board.mine.exploded', this.on_mine_exploded);
		pubsubService.subscribe('board.square.revealed', this.on_square_revealed);
		pubsubService.subscribe('board.square.clicked', this.on_square_clicked);
		// Second: ?
	};

	BoardViewModel.prototype.dispose = function() {
		this.boardOptions = null;
		this.timer = null;
		this.firstClick = null;
		this.squares = null;
		this.flags = null;
		this.revealed = null;
	};

	///
	/// Generates a new board with the indicated options
	///
	/// options.level = 'easy', 'medium', 'expert', 'custom'
	/// If options.level is 'custom' then:
	/// options.custom = { difficulty: 'Custom', rows: int, columns: int, mines: int }
	///
	BoardViewModel.prototype.generate = function(options) {
		// Store the options internally
		this.boardOptions = options.level !== 'custom' ? constantsService.BOARD_OPTIONS[options.level] : options.custom;

		// reset the first click flag
		this.firstClick = true;

		// first randomize the mines
		// this.boardOptions.mines: count of total mines, cannot be greater than the total amount
		if(this.boardOptions.mines >= this.boardOptions.rows * this.boardOptions.length) {
			throw new Error("Oops, can't create more mines than squares in the board.")
		} else {
			// Good to go
			this._create_squares( this._get_random_mines( this.boardOptions ) );
			// Trigger onminecountchange so the UI refreshes on load
			pubsubService.publish('game.flag.change', { count: this.boardOptions.mines - this.flags });
		}
	};

	BoardViewModel.prototype.reset = function() {
		// Clear the variables
		this.squares = [];
		// this.timer.Reset();
		this.flags = 0;
		this.revealed = 0;
		this.firstClick = true;
	};

	BoardViewModel.prototype.isEasy = function() {
		return this.boardOptions.difficulty === 'Easy';
	};

	BoardViewModel.prototype.isMedium = function() {
		return this.boardOptions.difficulty === 'Medium';
	};

	BoardViewModel.prototype.isExpert = function() {
		return this.boardOptions.difficulty === 'Expert';
	};

	BoardViewModel.prototype.isCustom = function() {
		return this.boardOptions.difficulty === 'Custom';
	};

	return BoardViewModel;
});