
define(['jquery'], function($) {

	return function(game) {
		// Private module vars and methods
		var $button_element = null; // This will point to the HTML button element
		var $debug_element = null;

		// store the state of the tile, active, flag, or question
		var _state = 'active';

		// store the array of neighbours
		var _neighbours = [];

		// the total number of mines around this tile
		var _bomb_count = 0;

		// For the getters/setters below
		var _is_mine = false;

		var mouse_up = function(event) {
			if(event.button === 0) {
				left_click();
			} else if(event.button === 1) {
				// Middle button, for highlighting neighbours
			} else if(event.button === 2) {
				right_click();
			}
			// Remove the focus to avoid the shadowed blue that stays after clicking
			remove_focus();
		};

		var mouse_down = function(event) {
			if(event.button === 1) {
				// Hold the middle button pressed to show the neighbours that will be affected
			 	return false;
			}
		};

		var dblclick = function(event) {
			// this event will only be triggered on a revealed square with a number
			if(isRevealed() && !isMine() && isMineNeighbour()) {
				console.log('double click detected');
			}
		};


		var left_click = function() {
			// Reveal the tile!
			if(isMine()) {
				// Game Over, notify the board
				get_square().trigger('mineexploded');
				// Remove the <i> inside
				get_square().find('i').remove();
				// Show the square as a red bomb
				var mine = $('<i>').addClass('fa fa-bomb');
				get_square().removeClass('btn-warning btn-default btn-primary btn-success disabled').append(mine).addClass('btn-danger');
			} else {
				// if not a bomb, reveal it and trigger the neighbour reveal
				reveal();
			}
		};

		var right_click = function() {
			toggle_state();
			refresh_tile();
		};

		var double_click = function() {
			// TODO: Complete the double-click
		};

		var remove_focus = function() {
			get_square().blur();
		};

		var get_square = function() {
			if(!$button_element)
				$button_element = $('<button>').attr('type', 'button').addClass("btn3d btn btn-primary cell");

			return $button_element;
		};

		var get_debug_element = function() {
			return $debug_element;
		};

		var reveal = function() {
			if(!isRevealed()) {
				if(_bomb_count === 0) {
					// change to white, and empty
					get_square().removeClass('btn-primary').addClass('btn-default active');
					// Mark it as revealed BEFORE invoking the neighbours so the neighbours events don't come back here
					setRevealed();
					// Trigger the neighbours
					for(var i = 0, l = _neighbours.length; i < l; i++) {
						_neighbours[i].reveal();
					}
				} else {
					// change to white with the bomb number inside it, and don't trigger the neighbours
					var $bomb_count_element = $('<span>').addClass('_' + _bomb_count).html(_bomb_count);
					get_square().removeClass('btn-primary').addClass('btn-default active').html($bomb_count_element);
					// Mark it as revealed so the neighbours events don't come back here
					setRevealed();
				}
			}
		};

		var get_content_html = function() {
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

		var isMine = function() {
			return _is_mine;
		};

		var isActive = function() {
			return _state === 'active';
		};

		var isFlag = function() {
			return _state === 'flag';
		};

		var isQuestion = function() {
			return _state === 'question';
		};

		var isRevealed = function() {
			return _state === 'revealed';
		};

		var isMineNeighbour = function() {
			return _bomb_count > 0;
		};

		var setMine = function(val) {
			_is_mine = val;
		};

		var setFlag = function() {
			_state = 'flag';
			get_square().trigger('squarestatechange', { state: _state } );
		};

		var setQuestion = function() {
			_state = 'question';
			get_square().trigger('squarestatechange', { state: _state } );
		};

		var setActive = function() {
			_state = 'active';
		};

		var setRevealed = function() {
			_state = 'revealed';
		};

		var _refresh_bomb_count = function() {
			_bomb_count = 0;
			for(var index = 0, len = _neighbours.length; index < len; index++) {
				if(_neighbours[index].isMine()) {
					_bomb_count += 1;
				}
			}
		}
		var isEmpty = function() {
			return _bomb_count === 0;
		};

		var add_neighbour = function(n) {
			_neighbours.push(n);
			_refresh_bomb_count();
		};

		var disable = function() {
			get_square().addClass('disabled');
		};

		// Event handlers and listeners
		var enable_click_events = function() {
			_on_mouseup();
			_on_mousedown();
			_on_double_click();
		};

		var _on_mouseup = function() {
			// Attach the mouse up event to the handler to catch the right click
			get_square().on('mouseup', mouse_up);
		};

		var _on_mousedown = function() {
			get_square().on('mousedown', mouse_down);
		};

		var _on_double_click = function() {
			get_square().on('dblclick', dblclick);
		};

		var on_state_change = function(handler) {
			get_square().on('squarestatechange', handler);
		};

		var on_mine_exploded = function(handler) {
			get_square().on('mineexploded', handler);
		};

		var on_revealed = function(handler) {

		};

		// Return the module
		return {
			getSquare: get_square,

			isActive: isActive,
			isMine: isMine,
			isFlag: isFlag,
			isQuestion: isQuestion,
			isRevealed: isRevealed,

			isMineNeighbour: isMineNeighbour,

			setMine: setMine,
			setFlag: setFlag,
			setQuestion: setQuestion,
			setRevealed: setRevealed,
			setActive: setActive,

			reveal: reveal,
			disable: disable,

			getContentHtml: get_content_html,

			addNeighbour: add_neighbour,

			enableClickEvents: enable_click_events,

			onStateChange: on_state_change,
			onMineExploded: on_mine_exploded,
			onRevealed: on_revealed
		}
	}
});