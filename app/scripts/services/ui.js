
define(['jquery', 'scripts/services/pubsub'], function($, pubsubService) {
	// This module generates the UI elements used by the board and square objects,
	// to make those UI-agnostic by creating HTML stuff in here, also the UI events are handled here,
	// and tiny pubsub will be used to bubble them to their respective owners.
	var instance;

	function singletonConstructor(options) {

		var self = this;

		self.boardContainer = $('div.board');

		self.adjustBoardWidth = function(options) {
			switch(options.columns) {
				case 9:
					self.boardContainer.removeClass('medium expert').addClass('easy');
					break;
				case 16:
					self.boardContainer.removeClass('easy expert').addClass('medium');
					break;
				case 30:
					self.boardContainer.removeClass('easy medium').addClass('expert');
					break;
				default:
					self.boardContainer.removeClass('medium expert').addClass('easy');
					break;
			}
		};

		self.clearFloat = function() {
			return $('<div>').css('clear', 'both');
		};

		self.onClick = function(event) {
			pubsubService.publish('square.click', event);
		};

		self.onMouseDown = function(event) {
			pubsubService.publish('square.mousedown', event);
		};

		self.onMouseUp = function(event) {
			pubsubService.publish('square.mouseup', event);
		};

		self.onDblClick = function(event) {
			pubsubService.publish('square.dblclick', event);
		};

		self.addUISquares = function(squares) {
			squares.forEach(function(s) {
				self.boardContainer.append( self.newUISquare(s) );
			});

			// Add the clear float div to the end
			self.boardContainer.append( self.clearFloat() );
		};

		self.newUISquare = function(squareViewModel) {
			var newuisquare = $('<button>')
					.attr('type', 'button')
					.addClass("btn3d btn btn-primary cell");

			// attach all the UI events to the square
			newuisquare.on('click', squareViewModel.onClick);
			newuisquare.on('mousedown', squareViewModel.onMouseDown);
			newuisquare.on('mouseup', squareViewModel.onMouseUp);
			newuisquare.on('dblclick', squareViewModel.onDblClick);

			return newuisquare;
		};

	};

	return {
		// Singleton getInstance(defaults)
        getInstance: function (options) {
            if (instance === undefined) {
                instance = new singletonConstructor(options);
            }
            return instance;
        }
	};

});