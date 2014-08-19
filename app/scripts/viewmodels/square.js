
define(['scripts/services/pubsub'], function(pubsubService) {

	function SquareViewModel(constructor_arguments) {
		this.state = 'active';
		this.neighbours = [];
		this.bombCount = constructor_arguments.isMine ? -1 : 0; // -1 = mine, 0..8 number of mines around
		this.id = constructor_arguments.id;

		var self = this;

		this._refresh_count = function() {
			if(this.bombCount > -1) {
				this.bombCount = 0;
				this.neighbours.forEach(function(square) {
					if(square.isMine())
						this.bombCount += 1;
				});
			}
		};

		this._neighbouring_flag_count = function() {
			var count = 0;
			this.neighbours.forEach(function(square) {
				if(square.isFlag())
					count += 1;
			});
			return count;
		};

		this._click_all_active_and_unflagged_neighbours = function() {
			this.neighbours.forEach(function(square) {
				if(square.isActive())
					square.click();
			});
		};

		this._highlight_active_neighbours = function() {
			this.neighbours.forEach(function(square) {
				if(square.isActive())
					square.highlight();
			});
		};

		this._unhighlight_active_neighbours = function() {
			this.neighbours.forEach(function(square) {
				if(square.isActive())
					square.unhighlight();
			});
		};

		this.right_click_highlight = function() {
			// If the square is revealed highlight the neighbours
			if(this.isRevealed() && this.bombCount > 0) {
				// highlight the neighbours
				this._highlight_active_neighbours();
			}
		};

		this.right_click_unhighlight = function() {
			// If the square is revealed highlight the neighbours
			if(this.isRevealed() && this.bombCount > 0) {
				// highlight the neighbours
				this._unhighlight_active_neighbours();
			}
		};

		this.on_square_mousedown = function(args) {
			if(args.id === self.id) {
				if(args.event.button === 1) {
					// Cancel the scrolling
				 	return false;
				} else if(args.event.button === 2) {
					self.right_click_highlight();
				}
			}
		};

		this.on_square_mouseup = function(args) {
			if(args.id === self.id) {
				if(args.event.button === 0) {
					self.click();
				} else if(args.event.button === 2) {
					self.rightClick();
					self.right_click_unhighlight();
				}

				// Trigger the clicked event, only used to start the timer
				pubsubService.publish('board.square.clicked');

				// Remove the focus to avoid the shadowed blue that stays after clicking
				pubsubService.publish('square.remove.focus', { id: this.id });
			}
		};

		this.on_square_dblclick = function(args) {
			if(args.id === self.id) {
				self.doubleClick();
			}
		};

		this.on_show_mines = function() {
			pubsubService.publish('square.show.mine', { id: this.id });
		};

		this.get_debug_content = function() {
			if(thisisMine()) {
				return '*';
			} else {
				return this.bombCount;
			}
		};

		//
		// Pretty much this is the constructor logic
		//
		// First: Create the subscriptions
		pubsubService.subscribe('ui.square.mousedown', this.on_square_mousedown);
		pubsubService.subscribe('ui.square.mouseup', this.on_square_mouseup);
		pubsubService.subscribe('ui.square.dblclick', this.on_square_dblclick);
		pubsubService.subscribe('ui.show.mines', this.on_show_mines);
	}

	SquareViewModel.prototype.disable = function() {
		// Transmit the disable event to the UI service through pubsub
		pubsubService.publish('square.disable', { id: this.id });
	};

	SquareViewModel.prototype.addNeighbour = function(square) {
		this.neighbours.push(square);
		this._refresh_count();
	};

	SquareViewModel.prototype.click = function() {
		// Reveal the tile!
		if(this.isActive() && !this.isMine()) {
			// if not a bomb, reveal it and trigger the neighbour reveal
			this.reveal();
		} else if(this.isActive() && this.isMine()) {
			// Game Over, notify the board
			pubsubService.publish('board.mine.exploded');
		}
	};

	SquareViewModel.prototype.rightClick = function() {
		// If the square is revealed highlight the neighbours
		if(!this.isRevealed()) {
			this.toggleState();
			pubsubService.publish('square.refresh', { id: this.id });
		}
	};

	SquareViewModel.prototype.doubleClick = function() {
		// this event will only be triggered on a revealed square with a number
		if(this.isRevealed() && !this.isMine() && this.hasMineAround()) {
			// Will trigger a special reveal in all neighbours if there is the same amount of flags in them as the number of mines around it.
			// If a neighbour with a mine wasn't covered with a flag is revealed, it will detonate the mine
			var totalFlagsAround = this._neighbouring_flag_count();
			if(totalFlagsAround === this.bombCount) {
				this._click_all_active_and_unflagged_neighbours();
			}
		}
	};

	SquareViewModel.prototype.toggleState = function() {
		if(!this.isRevealed()) {
			// if active, switch to flag
			if(this.isActive()) this.setFlag();
			// if flag, switch to question
			else if(this.isFlag()) this.setQuestion();
			// if question, switch to active
			else if(this.isQuestion()) this.setActive();
		}
	};

	SquareViewModel.prototype.reveal = function() {
		if(!this.isRevealed() && !this.isFlag() && !this.isQuestion()) {
			if(this.bombCount === 0) {

				// change to white, and empty
				pubsubService.publish('square.reveal.empty', { id: this.id });

				// Mark it as revealed BEFORE invoking the neighbours so the neighbours events don't come back here
				this.setRevealed();

				// Trigger the neighbours
				this.neighbours.forEach(function(square) {
					square.reveal();
				});
			} else {
				// change to white with the bomb number inside it, and don't trigger the neighbours
				pubsubService.publish('square.reveal.neighbour', { id: this.id, count: this.bombCount });

				// Mark it as revealed so the neighbours events don't come back here
				this.setRevealed();
			}
		}
	};

	SquareViewModel.prototype.isMine = function() {
		return this.bombCount === -1;
	};

	SquareViewModel.prototype.isActive = function() {
		return this.state === 'active';
	};

	SquareViewModel.prototype.isFlag = function() {
		return this.state === 'flag';
	};

	SquareViewModel.prototype.isQuestion = function() {
		return this.state === 'question';
	};

	SquareViewModel.prototype.isActive = function() {
		return this.state === 'active';
	};

	SquareViewModel.prototype.isRevealed = function() {
		return this.state === 'revealed';
	};

	SquareViewModel.prototype.hasMineAround = function() {
		return this.bombCount > 0;
	};

	SquareViewModel.prototype.setMine = function() {
		this.bombCount = -1;
	};

	SquareViewModel.prototype.setFlag = function() {
		this.state = 'flag';
		pubsubService.publish('board.flag.added');
	};

	SquareViewModel.prototype.setQuestion = function() {
		this.state = 'question';
		pubsubService.publish('board.flag.removed');
	};

	SquareViewModel.prototype.setActive = function() {
		this.state = 'active';
	};

	SquareViewModel.prototype.setRevealed = function() {
		this.state = 'revealed';
		pubsubService.publish('board.square.revealed');
	};

	SquareViewModel.prototype.isEmpty = function() {
		return this.bombCount === 0;
	};

	SquareViewModel.prototype.addNeighbour = function(n) {
		this.neighbours.push(n);
		this._refresh_count();
	};

	return SquareViewModel;

/*















		///
		/// All of these need to be moved into UI instead, too much coupling happening here
		///

		var highlight = function() {
			get_square().addClass('active');
		};

		var unhighlight = function() {
			get_square().removeClass('active');
		};




	*/
});