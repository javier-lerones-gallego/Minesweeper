
define(['jquery'], function($) {
	return function(game) {
		// Private module vars and methods
		var $button_element = null; // This will point to the HTML button element
		var $debug_element = null;

		// store the state of right and left buttons, to know when both are clicked at the same time
		var _left_mousedown = false;
		var _right_mousedown = false;

		// store the state of the tile, active, flag, or question
		var _state = 'active';
		var _revealed = false;

		// store the array of neighbours
		var _neighbours = [];

		// the total number of mines around this tile
		var _bomb_count = 0;

		// For the getters/setters below
		var _is_bomb = false;

		var mouse_down = function(e) {
			if(e.button === 0) _left_mousedown = true;
			if(e.button === 2) _right_mousedown = true;

			if(_left_mousedown && _right_mousedown) {
				// console.log('Doble button click detected', e);
				// This is very flimsy TODO: Improve the double button click
			}
		};

		var mouse_up = function(e) {
			// Putting this check here is the only way to make all 3 possibilities work, left, right, and double-button
			if(_left_mousedown && _right_mousedown) {
				_left_mousedown = false;
				_right_mousedown = false;
			} else if(_left_mousedown) {
				left_click();
			} else if(_right_mousedown) {
				// console.log('Right button click detected', e);
				right_click();
			}

			if(e.button === 0) _left_mousedown = false;
			if(e.button === 2) _right_mousedown = false;

			remove_focus();
		};

		var left_click = function() {
			// Reveal the tile!
			if(isBomb()) {
				// Game Over, notify the board

			} else {
				// if not a bomb, reveal it and trigger the neighbour reveal
				reveal();
			}
		};

		var debug_highlight = function(highlight) {
			if(highlight) {
				$debug_element.removeClass('btn-primary').addClass('btn-warning');
			} else {
				$debug_element.removeClass('btn-warning').addClass('btn-primary');
			}
		};

		var debug_mouseover = function() {
			for(var i = 0, l = _neighbours.length; i < l; i++) {
				_neighbours[i].debugHighlight(true);
			};
		};

		var debug_mouseout = function() {
			for(var i = 0, l = _neighbours.length; i < l; i++) {
				_neighbours[i].debugHighlight(false);
			};
		};

		var right_click = function() {
			toggle_state();
			refresh_tile();
		};

		var double_click = function() {
			// TODO: Complete the double-click
		};

		var remove_focus = function() {
			get_element().blur();
		};

		var get_element = function() {
			if(!$button_element)
				$button_element = $('<button>').attr('type', 'button').addClass("btn3d btn btn-primary cell");

			return $button_element;
		};

		var get_debug_element = function() {
			return $debug_element;
		};

		var reveal = function() {
			if(!_revealed) {
				if(_bomb_count === 0) {
					// change to white, and empty
					get_element().removeClass('btn-primary').addClass('btn-default active disabled');
					// Mark it as revealed BEFORE invoking the neighbours so the neighbours events don't come back here
					_revealed = true;
					// Trigger the neighbours
					for(var i = 0, l = _neighbours.length; i < l; i++) {
						_neighbours[i].reveal();
					}
				} else {
					// change to white with the bomb number inside it, and don't trigger the neighbours
					var $bomb_count_element = $('<span>').addClass('_' + _bomb_count).html(_bomb_count);
					get_element().removeClass('btn-primary').addClass('btn-default active disabled').html($bomb_count_element);
					// Mark it as revealed so the neighbours events don't come back here
					_revealed = true;
				}
			}
		};

		var get_content_html = function() {
			if(isBomb()) {
				return '*';
			} else {
				return _bomb_count;
			}
		};

		var toggle_state = function() {
			// if active, switch to flag
			if(isActive()) setFlag();
			// if flag, switch to question
			else if(isFlag()) setQuestion();
			// if question, switch to active
			else if(isQuestion()) setActive();
		};

		var refresh_tile = function() {
			if(isActive()) {
				// Remove the <i> inside
				get_element().find('i').remove();
				// Change class to btn-primary
				get_element().removeClass('btn-danger btn-default btn-warning btn-success disabled').addClass('btn-primary');
			}  else if(isFlag()) {
				// Add the <i> inside // <i class="fa fa-flag"></i>
				// Change class to btn-warning
				var flag = $('<i>').addClass('fa fa-flag');
				get_element().removeClass('btn-danger btn-default btn-primary btn-success disabled').append(flag).addClass('btn-warning');
			}  else if(_state === 'question') {
				// Change the <i> inside to be question
				get_element().find('i').removeClass('fa-flag').addClass('fa-question-circle');
				// Change class to btn-warning
				get_element().removeClass('btn-danger btn-default btn-primary btn-warning disabled').addClass('btn-success');
			}
		}

		var isBomb = function() {
			return _is_bomb;
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

		var setBomb = function(val) {
			_is_bomb = val;
		};

		var setFlag = function() {
			_state = 'flag';
			console.log(game);
			game.addFlag();
		};

		var setQuestion = function() {
			_state = 'question';
			game.removeFlag();
		};

		var setActive = function() {
			_state = 'active';
		};

		var _refresh_bomb_count = function() {
			_bomb_count = 0;
			for(var index = 0, len = _neighbours.length; index < len; index++) {
				if(_neighbours[index].isBomb()) {
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

		var add_debug_element = function(de) {
			$debug_element = de;

			get_element().on('mouseover', debug_mouseover);
			get_element().on('mouseout', debug_mouseout);
		};


		// Attach the right click event to the handler
		get_element().on('mousedown', mouse_down);
		get_element().on('mouseup', mouse_up);


		// Return the module
		return {
			getElement: get_element,
			getDebugElement: get_debug_element,
			debugHighlight: debug_highlight,

			isBomb: isBomb,
			isFlag: isFlag,
			isQuestion: isQuestion,

			setBomb: setBomb,
			setFlag: setFlag,
			setQuestion: setQuestion,

			reveal: reveal,

			getContentHtml: get_content_html,

			addNeighbour: add_neighbour,

			addDebugElement: add_debug_element
		}
	}
});