
define(['scripts/services/pubsub', 'scripts/services/util'], function(pubsubService, toolsService) {

	function SquareViewModel(constructor_arguments) {
		var self = this;

		this.state = 'active';
		this.neighbours = constructor_arguments.neighbours;
		this.bombCount = 0; // -1 = mine, 0..8 number of mines around
		this.id = constructor_arguments.id;
		this.neighbouringFlagCount = 0;


		this.square_on_square_mousedown = function(args) {
			if(args.id === self.id) {
				if(args.event.button === 1) {
					// Cancel the scrolling for the middle button
				 	return false;
				} else if(args.event.button === 2 && self.isRevealed() && self.bombCount > 0) {
					// If the square is revealed highlight the neighbours on mousedown
					pubsubService.publish('square.neighbours.highlight', { id: self.id });
				}
			}
		};

		this.square_on_square_mouseup = function(args) {
			if(args.id === self.id) {
				if(args.event.button === 0) {
					if(self.isActive() && !self.isMine()) {
						// if not a bomb, reveal it and trigger the neighbour reveal
						self.reveal();
					} else if(self.isActive() && self.isMine()) {
						// Game Over, notify the board
						pubsubService.publish('board.mine.exploded');
						pubsubService.publish('ui.square.show.mine', { id: self.id });
					}
				} else if(args.event.button === 2) {
					if(!self.isRevealed()) {
						// if active, switch to flag
						if(self.isActive()) self.setFlag();
						// if flag, switch to question
						else if(self.isFlag()) self.setQuestion();
						// if question, switch to active
						else if(self.isQuestion()) self.setActive();
					} else if(self.bombCount > 0) {
						// highlight the neighbours
						pubsubService.publish('square.neighbours.unhighlight', { id: self.id });
					}
				}

				// Trigger the clicked event, only used to start the timer
				pubsubService.publish('square.clicked');

				// Remove the focus to avoid the shadowed blue that stays after clicking
				pubsubService.publish('square.remove.focus', { id: self.id });
			}
		};

		this.square_on_square_dblclick = function(args) {
			if(args.id === self.id) {
				if(self.isRevealed() && !self.isMine() && self.hasMineAround()) {
					// Will trigger a special reveal in all neighbours if there is the same amount of flags in them as the number of mines around it.
					// If a neighbour with a mine wasn't covered with a flag is revealed, it will detonate the mine
					if(self.neighbouringFlagCount === self.bombCount) {
						pubsubService.publish('square.neighbours.click', { id: self.id });
					}
				}
			}
		};

		this.square_on_square_neighbours_highlight = function(args) {
			if(self.neighbours[args.id]) {
				if(self.isActive())
					pubsubService.publish('ui.square.highlight', { id: self.id });
			}
		};

		this.square_on_square_neighbours_unhighlight = function(args) {
			if(self.neighbours[args.id]) {
				if(self.isActive())
					pubsubService.publish('ui.square.unhighlight', { id: self.id });
			}
		};

		this.square_on_square_neighbours_reveal = function(args) {
			if(self.neighbours[args.id]) {
				self.reveal();
			}
		};

		this.square_on_square_neighbours_add_mine = function(args) {
			if(self.neighbours[args.id]) {
				if(self.bombCount > -1)
					self.bombCount += 1;
			}
		};

		this.square_on_square_disable = function(args) {
			if(!!args && !!args['id']) {
				if(args.id === self.id)
					pubsubService.publish('ui.square.disable', { id: self.id });
			}
		};

		this.square_on_square_show_mine = function() {
			if(self.isMine()) {
				pubsubService.publish('ui.square.show.mine', { id: self.id });
			}
		};

		this.square_on_square_flagged = function(args) {
			if(self.neighbours[args.id]) {
				self.neighbouringFlagCount += 1;
			}
		};

		this.square_on_square_questioned = function(args) {
			if(self.neighbours[args.id]) {
				self.neighbouringFlagCount -= 1;
			}
		};

		this.square_on_square_neighbours_click = function(args) {
			if(self.neighbours[args.id]) {
				if(self.isActive() && !self.isMine()) {
					// if not a bomb, reveal it and trigger the neighbour reveal
					self.reveal();
				} else if(self.isActive() && self.isMine()) {
					// Game Over, notify the board
					pubsubService.publish('board.mine.exploded');
					pubsubService.publish('ui.square.show.mine', { id: self.id });
				}
			}
		};

		this.get_debug_content = function() {
			if(this.isMine()) {
				return '*';
			} else {
				return this.bombCount;
			}
		};

		//
		// Pretty much this is the constructor logic
		// make it an iffe to make it more obvious
		//
		(function() {
			// First: Create the subscriptions
			//
			// Events triggered by the UI
			pubsubService.subscribe('ui.square.mousedown', self.square_on_square_mousedown);
			pubsubService.subscribe('ui.square.mouseup', self.square_on_square_mouseup);
			pubsubService.subscribe('ui.square.dblclick', self.square_on_square_dblclick);
			// Events triggered by other objects in the application
			pubsubService.subscribe('square.show.mine', self.square_on_square_show_mine);
			pubsubService.subscribe('square.disable', self.square_on_square_disable);
			// Events triggered by other squares
			pubsubService.subscribe('square.neighbours.highlight', self.square_on_square_neighbours_highlight);
			pubsubService.subscribe('square.neighbours.unhighlight', self.square_on_square_neighbours_unhighlight);
			pubsubService.subscribe('square.neighbours.reveal', self.square_on_square_neighbours_reveal);
			pubsubService.subscribe('square.neighbours.add.mine', self.square_on_square_neighbours_add_mine);
			pubsubService.subscribe('square.flagged', self.square_on_square_flagged);
			pubsubService.subscribe('square.questioned', self.square_on_square_questioned);
			pubsubService.subscribe('square.neighbours.click', self.square_on_square_neighbours_click);
		}());


	}

	SquareViewModel.prototype.dispose = function() {
		this.state = null;
		this.neighbours = null;
		this.bombCount = null;
		this.id = null;
		this.neighbouringFlagCount = null;
		// Events triggered by the UI
		pubsubService.unsubscribe('ui.square.mousedown', this.square_on_square_mousedown);
		pubsubService.unsubscribe('ui.square.mouseup', this.square_on_square_mouseup);
		pubsubService.unsubscribe('ui.square.dblclick', this.square_on_square_dblclick);
		// Events triggered by other objects in the application
		pubsubService.unsubscribe('square.show.mine', this.square_on_square_show_mine);
		pubsubService.unsubscribe('square.disable', this.square_on_square_disable);
		// Events triggered by other squares
		pubsubService.unsubscribe('square.neighbours.highlight', this.square_on_square_neighbours_highlight);
		pubsubService.unsubscribe('square.neighbours.unhighlight', this.square_on_square_neighbours_unhighlight);
		pubsubService.unsubscribe('square.neighbours.reveal', this.square_on_square_neighbours_reveal);
		pubsubService.unsubscribe('square.neighbours.add.mine', this.square_on_square_neighbours_add_mine);
		pubsubService.unsubscribe('square.flagged', this.square_on_square_flagged);
		pubsubService.unsubscribe('square.questioned', this.square_on_square_questioned);
		pubsubService.unsubscribe('square.neighbours.click', this.square_on_square_neighbours_click);
	};

	SquareViewModel.prototype.reveal = function() {
		if(!this.isRevealed() && !this.isFlag() && !this.isQuestion()) {
			if(this.bombCount === 0) {
				// change to white, and empty
				pubsubService.publish('ui.square.reveal.empty', { id: this.id });

				// Mark it as revealed BEFORE invoking the neighbours so the neighbours events don't come back here
				this.setRevealed();

				// Trigger the neighbours
				pubsubService.publish('square.neighbours.reveal', { id: this.id });
			} else if(this.bombCount > 0) {
				// change to white with the bomb number inside it, and don't trigger the neighbours
				pubsubService.publish('ui.square.reveal.count', { id: this.id, count: this.bombCount });

				// Mark it as revealed so the neighbours events don't come back here
				this.setRevealed();
			}

			// Trigger the square has been revealed event for everybody listening
			pubsubService.publish('square.revealed');
		}
	};

	SquareViewModel.prototype.disable = function() {
		// Transmit the disable event to the UI service through pubsub
		pubsubService.publish('square.disable', { id: this.id });
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
		pubsubService.publish('square.neighbours.add.mine', { id: this.id });
	};

	SquareViewModel.prototype.setFlag = function() {
		this.state = 'flag';
		pubsubService.publish('square.flagged', { id: this.id });
	};

	SquareViewModel.prototype.setQuestion = function() {
		this.state = 'question';
		pubsubService.publish('square.questioned', { id: this.id });
	};

	SquareViewModel.prototype.setActive = function() {
		this.state = 'active';
		pubsubService.publish('square.activated', { id: this.id });
	};

	SquareViewModel.prototype.setRevealed = function() {
		this.state = 'revealed';
	};

	SquareViewModel.prototype.isEmpty = function() {
		return this.bombCount === 0;
	};

	return SquareViewModel;

});