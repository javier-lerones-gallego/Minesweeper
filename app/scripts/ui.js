
define(['jquery', 'scripts/pubsub'], function($, pubsub) {
	// This module generates the UI elements used by the board and square objects,
	// to make those UI-agnostic by creating HTML stuff in here, also the UI events are handled here,
	// and tiny pubsub will be used.

	return function(options) {
		var _board_container;

		var get_board_container = function() {
			if(!_board_container) _board_container = $('div.board');
			return _board_container;
		};

		var _new_clear_float = function() {
			return $('<div>').css('clear', 'both');
		};

		var _adjust_board_width = function() {
			switch(_board_options.length) {
				case 9:
					get_board_container().removeClass('medium expert').addClass('easy');
					break;
				case 16:
					get_board_container().removeClass('easy expert').addClass('medium');
					break;
				case 30:
					get_board_container().removeClass('easy medium').addClass('expert');
					break;
				default:
					get_board_container().removeClass('medium expert').addClass('easy');
					break;
			}
		};

		var clear_board_float = function() {
			get_board_container().append(_new_clear_float());
		};

		var add_square_to_board_container = function($square) {
			get_board_container().append($square);
		};

		var new_square = function() {
			return $('<button>').attr('type', 'button').addClass("btn3d btn btn-primary cell");
		};

		// Reveal
		return {
			// Board related
			getBoardContainer: get_board_container,
			addSquare: add_square_to_board_container,
			clearBoardFloat: clear_board_float,

			// Square related
			newSquare: new_square,

		}
	};

});