
define(['jquery', 'scripts/pubsub'], function($, pubsub) {
	// This module generates the UI elements used by the board and square objects,
	// to make those UI-agnostic by creating HTML stuff in here, also the UI events are handled here,
	// and tiny pubsub will be used to bubble them to their respective owners.

		var _board_container;
		var _ui_squares = [];

		var get_board_container = function() {
			if(!_board_container) _board_container = $('div.board');
			return _board_container;
		};

		var _new_clear_float = function() {
			return $('<div>').css('clear', 'both');
		};

		var adjust_board_width = function(options) {
			switch(options.length) {
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

		var _new_hash = function(index) {
			// TODO: generate a hash based on the square index
			return index;
		};

		var add_squares_to_board = function(squares, options) {
			for(var index = 0, last = options.rows * options.length; index < last; index++) {
				// append the square to the board
				get_board_container().append( _new_square( _new_hash(index) ) );
			}
			// Add the clear float div to the end
			clear_board_float();
		}

		var clear_board_float = function() {
			get_board_container().append(_new_clear_float());
		};

		var empty_board = function() {
			get_board_container().empty();
		};

		var _new_square = function(hash) {
			return $('<button>')
				.data('squareId', hash)
				.attr('type', 'button')
				.addClass("btn3d btn btn-primary cell");
		};

		// Reveal
		return {
			// Board related
			getBoardContainer: get_board_container,
			addSquaresToBoard: add_squares_to_board,
			adjustBoardWidth: adjust_board_width,
			emptyBoard: empty_board

			// Square related

		};

});