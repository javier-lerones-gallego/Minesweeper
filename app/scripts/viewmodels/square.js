
define(['jquery', 'scripts/services/pubsub'], function($, pubsubService) {

	function SquareViewModel(constructor_arguments) {
		var self = this;

		this.state = 'active';
		this.neighbours = [];
		this.bombCount = constructor_arguments.isMine ? -1 : 0; // -1 = mine, 0..8 number of mines around
		this.id = constructor_arguments.id;

		this._refresh_count = function() {
			if(this.bombCount > -1) {
				this.bombCount = 0;
				this.neighbours.forEach(function(square) {
					if(square.isMine())
						this.bombCount += 1;
				})
			}
		};

		this._neighbouring_flag_count = function() {
			var count = 0;
			neighbours.forEach(function(square) {
				if(square.isFlag())
					count += 1;
			});
			return count;
		};

		this._click_all_active_and_unflagged_neighbours = function() {
			neighbours.forEach(function(square) {
				if(square.isActive())
					square.click();
			});
		};

		this.on_square_click = function(args) {
			if(args.id === self.id) {

			}
		};

		this.on_square_mousedown = function(args) {
			if(args.id === self.id) {

			}
		};

		this.on_square_mouseup = function(args) {
			if(args.id === self.id) {

			}
		};

		this.on_square_dblclick = function(args) {
			if(args.id === self.id) {

			}
		};

		//
		// Pretty much this is the constructor logic
		//
		// First: Create the subscriptions
		pubsubService.subscribe('ui.square.click', this.on_square_click);
		pubsubService.subscribe('ui.square.mousedown', this.on_square_mousedown);
		pubsubService.subscribe('ui.square.mouseup', this.on_square_mouseup);
		pubsubService.subscribe('ui.square.dblclick', this.on_square_dblclick);
	}

	SquareViewModel.prototype.disable = function() {
		// Transmit the disable event to the UI service through pubsub
		pubsubService.publish('square.disable', { id: this.id });
	};

	SquareViewModel.prototype.addNeighbour = function(square) {
		this.neighbours.push(square);
		this._refresh_count();
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

	return SquareViewModel;

/*


		var _click_all_active_and_unflagged_neighbours = function() {

		};

		var _highlight_active_neighbours = function() {
			for(var n = 0, totaln = _neighbours.length; n < totaln; n++) {
				if(_neighbours[n].isActive())
					_neighbours[n].highlight();
			}
		};

		var _unhighlight_active_neighbours = function() {
			for(var n = 0, totaln = _neighbours.length; n < totaln; n++) {
				if(_neighbours[n].isActive())
					_neighbours[n].unhighlight();
			}
		};

		var click = function() {
			// Reveal the tile!
			if(isActive() && !isMine()) {
				// if not a bomb, reveal it and trigger the neighbour reveal
				reveal();
			} else if(isActive() && isMine()) {
				// Game Over, notify the board
				pubsubService.publish('board.mine.exploded');
			}
		};

		var right_click = function() {
			// If the square is revealed highlight the neighbours
			if(!isRevealed()) {
				toggle_state();
				refresh_tile();
			}
		};

		var right_click_highlight = function() {
			// If the square is revealed highlight the neighbours
			if(isRevealed() && _bomb_count > 0) {
				// highlight the neighbours
				_highlight_active_neighbours();
			}
		};

		var right_click_unhighlight = function() {
			// If the square is revealed highlight the neighbours
			if(isRevealed() && _bomb_count > 0) {
				// highlight the neighbours
				_unhighlight_active_neighbours();
			}
		};

		var double_click = function() {
			// this event will only be triggered on a revealed square with a number
			if(isRevealed() && !isMine() && hasMineAround()) {
				// Will trigger a special reveal in all neighbours if there is the same amount of flags in them as the number of mines around it.
				// If a neighbour with a mine wasn't covered with a flag is revealed, it will detonate the mine
				var totalFlagsAround = _neighbouring_flag_count();
				if(totalFlagsAround === _bomb_count) {
					_click_all_active_and_unflagged_neighbours();
				}
			}
		};

		var reveal = function() {
			if(!isRevealed() && !isFlag() && !isQuestion()) {
				if(_bomb_count === 0) {

					// change to white, and empty
					get_square().removeClass('btn-primary btn-default btn-warning btn-success btn-danger').addClass('btn-default active');


					// Mark it as revealed BEFORE invoking the neighbours so the neighbours events don't come back here
					setRevealed();
					// Trigger the neighbours
					for(var i = 0, l = _neighbours.length; i < l; i++) {
						_neighbours[i].reveal();
					}
				} else {

					// change to white with the bomb number inside it, and don't trigger the neighbours
					var $bomb_count_element = $('<span>').addClass('_' + _bomb_count).html(_bomb_count);
					get_square().removeClass('btn-primary btn-default btn-warning btn-success btn-danger').addClass('btn-default active').html($bomb_count_element);


					// Mark it as revealed so the neighbours events don't come back here
					setRevealed();
				}
			}
		};

		var get_debug_content = function() {
			if(isMine()) {
				return '*';
			} else {
				return _bomb_count;
			}
		};

		var toggle_state = function() {
			if(!isRevealed()) {
				// if active, switch to flag
				if(isActive()) setFlag();
				// if flag, switch to question
				else if(isFlag()) setQuestion();
				// if question, switch to active
				else if(isQuestion()) setActive();
			}
		};


		var hasMineAround = function() {
			return _bomb_count > 0;
		};

		var setMine = function(val) {
			_is_mine = val;
		};

		var setFlag = function() {
			_state = 'flag';
			pubsubService.publish('board.flag.added');
		};

		var setQuestion = function() {
			_state = 'question';
			pubsubService.publish('board.flag.removed');
		};

		var setActive = function() {
			_state = 'active';
		};

		var setRevealed = function() {
			_state = 'revealed';
			pubsubService.publish('board.square.revealed');
		};

		var isEmpty = function() {
			return _bomb_count === 0;
		};

		var add_neighbour = function(n) {
			_neighbours.push(n);
			_refresh_bomb_count();
		};











		///
		/// All of these need to be moved into UI instead, too much coupling happening here
		///

		var mouse_up = function(event) {
			if(event.button === 0) {
				click();
			} else if(event.button === 2) {
				right_click();
				right_click_unhighlight();
			}
			// Trigger the clicked event, only used to start the timer
			pubsubService.publish('board.square.clicked');
			// Remove the focus to avoid the shadowed blue that stays after clicking
			remove_focus();
		};

		var mouse_down = function(event) {
			if(event.button === 1) {
				// Cancel the scrolling
			 	return false;
			} else if(event.button === 2) {
				right_click_highlight();
			}
		};

		var highlight = function() {
			get_square().addClass('active');
		};

		var unhighlight = function() {
			get_square().removeClass('active');
		};

		var remove_focus = function() {
			get_square().blur();
		};

		var show_mine = function() {
			// Remove the <i> inside
			get_square().find('i').remove();
			// Show the square as a red bomb
			var mine = $('<i>').addClass('fa fa-bomb');
			get_square().removeClass('btn-warning btn-default btn-primary btn-success disabled').append(mine).addClass('btn-danger');
		};

		var refresh_tile = function() {
			if(isActive()) {
				// Remove the <i> inside
				get_square().find('i').remove();
				// Change class to btn-primary
				get_square().removeClass('btn-danger btn-default btn-warning btn-success disabled').addClass('btn-primary');
			}  else if(isFlag()) {
				// Add the <i> inside // <i class="fa fa-flag"></i>
				// Change class to btn-warning
				var flag = $('<i>').addClass('fa fa-flag');
				get_square().removeClass('btn-danger btn-default btn-primary btn-success disabled').append(flag).addClass('btn-warning');
			}  else if(_state === 'question') {
				// Change the <i> inside to be question
				get_square().find('i').removeClass('fa-flag').addClass('fa-question-circle');
				// Change class to btn-warning
				get_square().removeClass('btn-danger btn-default btn-primary btn-warning disabled').addClass('btn-success');
			}
		}







		// Return the module
		return {
			isActive: isActive,
			isMine: isMine,
			isFlag: isFlag,
			isQuestion: isQuestion,
			isRevealed: isRevealed,
			hasMineAround: hasMineAround,

			setMine: setMine,
			setFlag: setFlag,
			setQuestion: setQuestion,
			setRevealed: setRevealed,
			setActive: setActive,

			highlight: highlight,
			unhighlight: unhighlight,

			reveal: reveal,
			click: click,
			disable: disable,

			showMine: show_mine,

			getDebugContent: get_debug_content,

			addNeighbour: add_neighbour
		}
	}
	*/
});