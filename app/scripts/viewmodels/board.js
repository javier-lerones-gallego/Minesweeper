define(['scripts/viewmodels/square', 'scripts/viewmodels/timer', 'scripts/services/pubsub', 'scripts/config/constants', 'scripts/services/util'], function(SquareViewModel, TimerViewModel, pubsubService, constantsService, toolsService) {

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


		this._create_squares = function(mines) {
			var squares = [];
			// Now generate the squares, and if the index has a bomb, mark it as bomb
			// this.boardOptions.rows: number of rows in the board
			// this.boardOptions.length: length of each row
			for(var index = 0, last = this.boardOptions.rows * this.boardOptions.columns; index < last; index++) {
				// Add the square to the squares array
				squares.push(new SquareViewModel({ id: index, neighbours: toolsService.calculateNeighbours(index, this.boardOptions) }));
			};

			// Set the mines (this allows the mine count to be updated on each neighbour)
			mines.forEach(function(mineIndex) {
				squares[mineIndex].setMine();
			});

			return squares;
		};


		// Event Handlers and Listeners
		this.board_on_flag_added = function() {
			pubsubService.publish('flag.change', { count: self.boardOptions.mines - ++self.flags });
		};

		this.board_on_flag_removed = function() {
			pubsubService.publish('flag.change', { count: self.boardOptions.mines - --self.flags });
		};

		this.board_on_mine_exploded = function(event, args) {
			// Trigger the ongamelost event
			pubsubService.publish('game.lost');
			// Show all the mines
			pubsubService.publish('square.show.mine');
			// Disable all squares
			pubsubService.publish('square.disable');
		};

		this.board_on_square_revealed = function() {
			self.revealed += 1;
			if(self._is_victory()) {
				pubsubService.publish('game.won');
			}
		};

		this._is_victory = function() {
			// Conditions for game victory:
			// 1. all non mine squares have been revealed
			return this.revealed === (this.boardOptions.rows * this.boardOptions.columns) - this.boardOptions.mines;
		};

		this.board_on_square_clicked = function(event, args) {
			if(self.firstClick) {
				self.firstClick = false;
				self.timer.start();
			}
		};



		//
		// Pretty much this is the constructor logic
		//
		// First: Create the subscriptions to all the relevan messages
		pubsubService.subscribe('square.flagged', this.board_on_flag_added);
		pubsubService.subscribe('square.questioned', this.board_on_flag_removed);
		pubsubService.subscribe('board.mine.exploded', this.board_on_mine_exploded);

		pubsubService.subscribe('square.revealed', this.board_on_square_revealed);
		pubsubService.subscribe('square.clicked', this.board_on_square_clicked);
	};

	BoardViewModel.prototype.dispose = function() {
		this.boardOptions = null;
		this.timer = null;
		this.firstClick = null;
		this.squares = null;
		this.flags = null;
		this.revealed = null;

		pubsubService.unsubscribe('square.flagged', this.board_on_flag_added);
		pubsubService.unsubscribe('square.questioned', this.board_on_flag_removed);
		pubsubService.unsubscribe('board.mine.exploded', this.board_on_mine_exploded);
		pubsubService.unsubscribe('square.revealed', this.board_on_square_revealed);
		pubsubService.unsubscribe('square.clicked', this.board_on_square_clicked);
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
			this.squares = this._create_squares( toolsService.getRandomMines( this.boardOptions ) );

			// Trigger onminecountchange so the UI refreshes on load
			pubsubService.publish('flag.change', { count: this.boardOptions.mines - this.flags });
		}
	};

	BoardViewModel.prototype.reset = function() {
		// Dispose the squares individually to remove pubsub subscriptions
		this.squares.forEach(function(square) {
			square.dispose();
		});
		// Clear the array
		this.squares = [];
		// this.timer.Reset();
		this.flags = 0;
		this.revealed = 0;
		// Trigger ui reset
		pubsubService.publish('board.reset');
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