
define(['jquery'], function($) {
	return function(element, board) {
		// Private module vars and methods
		var $element = element; // This will point to the HTML button element
		var $debugelement;
		var _board = board; 	// A reference to the board game to avoid doing pub/sub

		// store the state of right and left buttons, to know when both are clicked at the same time
		var _leftMouseDown = false;
		var _rightMouseDown = false;

		// store the state of the tile, active, flag, or question
		var _state = 'active';
		var _revealed = false;

		// store the array of neighbours
		var _neighbours = [];

		// the total number of bombs around this tile
		var _bombCount = 0;

		// For the getters/setters below
		var _isBomb = false;

		var mouse_down = function(e) {
			if(e.button === 0) _leftMouseDown = true;
			if(e.button === 2) _rightMouseDown = true;

			if(_leftMouseDown && _rightMouseDown) {
				// console.log('Doble button click detected', e);
				// This is very flimsy TODO: Improve the double button click
			}
		};

		var mouse_up = function(e) {
			// Putting this check here is the only way to make all 3 possibilities work, left, right, and double-button
			if(_leftMouseDown && _rightMouseDown) {
				_leftMouseDown = false;
				_rightMouseDown = false;
			} else if(_leftMouseDown) {
				left_click();
			} else if(_rightMouseDown) {
				// console.log('Right button click detected', e);
				right_click();
			}

			if(e.button === 0) _leftMouseDown = false;
			if(e.button === 2) _rightMouseDown = false;

			remove_focus();
		};

		var left_click = function() {
			// Reveal the tile!
			if(isBomb()) {
				// Game Over, notify the board
				_board.game_over();
			} else {
				// if not a bomb, reveal it and trigger the neighbour reveal
				reveal();
			}
		};

		var debug_mouseover = function() {
			for(var i = 0, l = _neighbours.length; i < l; i++) {
				_neighbours[i].getDebugElement().removeClass('btn-primary').addClass('btn-warning');
			};
		};

		var debug_mouseout = function() {
			for(var i = 0, l = _neighbours.length; i < l; i++) {
				_neighbours[i].getDebugElement().removeClass('btn-warning').addClass('btn-primary');
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
			$element.blur();
		};

		var getElement = function() {
			return $element;
		};

		var getDebugElement = function() {
			return $debugelement;
		};

		var reveal = function() {
			if(!_revealed) {
				if(_bombCount === 0) {
					// change to white, and empty
					$element.removeClass('btn-primary').addClass('btn-default factive disabled');
					// Mark it as revealed BEFORE invoking the neighbours so the neighbours events don't come back here
					_revealed = true;
					// Trigger the neighbours
					for(var i = 0, l = _neighbours.length; i < l; i++) {
						_neighbours[i].reveal();
					}
				} else {
					// change to white with the bomb number inside it, and don't trigger the neighbours
					$element.removeClass('btn-primary').addClass('btn-default factive disabled').html(_bombCount);
					// Mark it as revealed so the neighbours events don't come back here
					_revealed = true;
				}
			}
		};

		var get_content_html = function() {
			if(isBomb()) {
				return '*';
			} else {
				return getBombCount();
			}
		};

		var toggle_state = function() {
			// if active, switch to flag
			if(_state === 'active') _state = 'flag';
			// if flag, switch to question
			else if(_state === 'flag') _state = 'question';
			// if question, switch to active
			else if(_state === 'question') _state = 'active';
		};

		var refresh_tile = function() {
			if(_state === 'active') {
				// Remove the <i> inside
				$element.find('i').remove();
				// Change class to btn-primary
				$element.removeClass('btn-danger btn-default btn-warning btn-success disabled').addClass('btn-primary');
			}  else if(_state === 'flag') {
				// Add the <i> inside // <i class="fa fa-flag"></i>
				// Change class to btn-warning
				var flag = $('<i>').addClass('fa fa-flag');
				$element.removeClass('btn-danger btn-default btn-primary btn-success disabled').append(flag).addClass('btn-warning');
			}  else if(_state === 'question') {
				// Change the <i> inside to be question
				$element.find('i').removeClass('fa-flag').addClass('fa-question-circle');
				// Change class to btn-warning
				$element.removeClass('btn-danger btn-default btn-primary btn-warning disabled').addClass('btn-success');
			}
		}

		var isBomb = function() {
			return _isBomb;
		};

		var isActive = function() {

		};

		var isFlag = function() {

		};

		var isQuestion = function() {

		};

		var setBomb = function(val) {
			_isBomb = val;
		};

		var setFlag = function(val) {

		};

		var setQuestion = function(val) {

		};

		var getBombCount = function() {
			return _bombCount;
		};

		var refreshBombCount = function() {
			_bombCount = 0;
			for(var index = 0, len = _neighbours.length; index < len; index++) {
				if(_neighbours[index].isBomb()) {
					_bombCount += 1;
				}
			}
		}
		var isEmpty = function() {
			return bombCount() === 0;
		};

		var add_neighbour = function(n) {
			_neighbours.push(n);
			refreshBombCount();
		};

		var add_debug_element = function(de) {
			$debugelement = de;

			$debugelement.on('mouseover', debug_mouseover);
			$debugelement.on('mouseout', debug_mouseout);
		};


		// Attach the right click event to the handler
		$element.on('mousedown', mouse_down);
		$element.on('mouseup', mouse_up);


		// Return the module
		return {
			getElement: getElement,
			getDebugElement: getDebugElement,

			element: $element,

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