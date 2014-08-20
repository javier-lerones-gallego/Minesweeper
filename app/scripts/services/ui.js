
define(['jquery', 'scripts/services/pubsub', 'scripts/config/definitions'], function($, pubsubService, definitionsService) {
	// This module generates the UI elements used by the board and square objects,
	// to make those UI-agnostic by creating HTML stuff in here, also the UI events are handled here,
	// and tiny pubsub will be used to bubble them to their respective owners.
	var instance;

	function singletonConstructor(options) {

		var self = this;
		self.squares = {};

		self.boardContainer = $(definitionsService.BOARD_CONTAINER);

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
			var id = squareViewModel.id;

			var newuisquare = $('<button>')
					.data('id', id)
					.attr('type', 'button')
					.addClass("btn3d btn btn-primary cell");

			// attach all the UI events to the square
			newuisquare.on('mousedown', function(event) { pubsubService.publish('ui.square.mousedown', { id: id, event: event }) });
			newuisquare.on('mouseup', function(event) { pubsubService.publish('ui.square.mouseup', { id: id, event: event }) });
			newuisquare.on('dblclick', function(event) { pubsubService.publish('ui.square.dblclick', { id: id, event: event }) });

			// Add it to the map of UI squares
			self.squares[id] = newuisquare;

			return newuisquare;
		};

		self.on_disable = function(args) {
			if(self.squares[args.id])
				self.squares[args.id].addClass('disabled');
		};

		self.on_remove_focus = function(args) {
			if(self.squares[args.id])
				self.squares[args.id].blur();
		};

		self.on_show_mine = function(args) {
			if(self.squares[args.id]) {
				// Remove the <i> inside
				self.squares[args.id].find('i').remove();
				// Show the square as a red bomb
				var mine = $('<i>').addClass('fa fa-bomb');
				self.squares[args.id].removeClass('btn-warning btn-default btn-primary btn-success disabled').append(mine).addClass('btn-danger');
			}
		};

		self.on_square_flagged = function(args) {
			if(self.squares[args.id]) {
				// Add the <i> inside // <i class="fa fa-flag"></i>
				// Change class to btn-warning
				var flag = $('<i>').addClass('fa fa-flag');
				self.squares[args.id].removeClass('btn-danger btn-default btn-primary btn-success disabled').append(flag).addClass('btn-warning');
			}
		};

		self.on_square_questioned = function(args) {
			if(self.squares[args.id]) {
				// Change the <i> inside to be question
				self.squares[args.id].find('i').removeClass('fa-flag').addClass('fa-question-circle');
				// Change class to btn-warning
				self.squares[args.id].removeClass('btn-danger btn-default btn-primary btn-warning disabled').addClass('btn-success');
			}
		};

		self.on_square_activated = function(args) {
			if(self.squares[args.id]) {
				// Remove the <i> inside
				self.squares[args.id].find('i').remove();
				// Change class to btn-primary
				self.squares[args.id].removeClass('btn-danger btn-default btn-warning btn-success disabled').addClass('btn-primary');
			}
		};

		self.on_reveal_empty = function(args) {
			if(self.squares[args.id]) {
				self.squares[args.id].removeClass('btn-primary btn-default btn-warning btn-success btn-danger').addClass('btn-default active');
			}
		};

		self.on_reveal_count = function(args) {
			if(self.squares[args.id]) {
				var $bomb_count_element = $('<span>').addClass('_' + args.count).html(args.count);
				self.squares[args.id].removeClass('btn-primary btn-default btn-warning btn-success btn-danger').addClass('btn-default active').html($bomb_count_element);
			}
		};

		self.on_reveal_mine = function(args) {
			if(self.squares[args.id]) {
				self.squares[args.id].removeClass('btn-primary btn-default btn-warning btn-success btn-danger').addClass('btn-default active');
			}
		};

		self.on_square_highlight = function(args) {
			if(self.squares[args.id]) {
				self.squares[args.id].addClass('active');
			}
		};

		self.on_square_unhighlight = function(args) {
			if(self.squares[args.id]) {
				self.squares[args.id].removeClass('active');
			}
		};

		pubsubService.subscribe('ui.square.disable', self.on_disable);
		pubsubService.subscribe('square.remove.focus', self.on_remove_focus);
		pubsubService.subscribe('ui.square.show.mine', self.on_show_mine);

		pubsubService.subscribe('square.flagged', self.on_square_flagged);
		pubsubService.subscribe('square.questioned', self.on_square_questioned);
		pubsubService.subscribe('square.activated', self.on_square_activated);

		pubsubService.subscribe('ui.square.highlight', self.on_square_highlight);
		pubsubService.subscribe('ui.square.unhighlight', self.on_square_unhighlight);

		pubsubService.subscribe('ui.square.reveal.empty', self.on_reveal_empty);
		pubsubService.subscribe('ui.square.reveal.count', self.on_reveal_count);
		pubsubService.subscribe('ui.square.reveal.mine', self.on_reveal_mine);
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