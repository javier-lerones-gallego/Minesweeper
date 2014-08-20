
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

		self.addUISquares = function(squareViewModels) {
			squareViewModels.forEach(function(s) {
				var newSquare = self.createUISquare(s.id);
				self.squares[s.id] = newSquare;
				self.boardContainer.append( self.squares[s.id] );
			});

			// Add the clear float div to the end
			self.boardContainer.append( self.clearFloat() );
		};

		self.createUISquare = function(id) {
			return $('<button/>')
					.data('id', id)
					.attr('type', 'button')
					.addClass("btn3d btn btn-primary cell")
					.off('mousedown')
					.off('mouseup')
					.off('dblclick')
					.on('mousedown', function(event) { pubsubService.publish('ui.square.mousedown', { id: id, event: event }) })
					.on('mouseup', function(event) { pubsubService.publish('ui.square.mouseup', { id: id, event: event }) })
					.on('dblclick', function(event) { pubsubService.publish('ui.square.dblclick', { id: id, event: event }) });
		};

		self.ui_on_disable = function(args) {
			if(self.squares[args.id])
				self.squares[args.id].addClass('disabled');
		};

		self.ui_on_remove_focus = function(args) {
			if(self.squares[args.id])
				self.squares[args.id].blur();
		};

		self.ui_on_show_mine = function(args) {
			if(self.squares[args.id]) {
				// Remove the <i> inside
				self.squares[args.id].find('i').remove();
				// Show the square as a red bomb
				var mine = $('<i>').addClass('fa fa-bomb');
				self.squares[args.id].removeClass('btn-warning btn-default btn-primary btn-success disabled').append(mine).addClass('btn-danger');
			}
		};

		self.ui_on_square_flagged = function(args) {
			if(self.squares[args.id]) {
				// Add the <i> inside // <i class="fa fa-flag"></i>
				// Change class to btn-warning
				var flag = $('<i>').addClass('fa fa-flag');
				self.squares[args.id].removeClass('btn-danger btn-default btn-primary btn-success disabled').append(flag).addClass('btn-warning');
			}
		};

		self.ui_on_square_questioned = function(args) {
			if(self.squares[args.id]) {
				// Change the <i> inside to be question
				self.squares[args.id].find('i').removeClass('fa-flag').addClass('fa-question-circle');
				// Change class to btn-warning
				self.squares[args.id].removeClass('btn-danger btn-default btn-primary btn-warning disabled').addClass('btn-success');
			}
		};

		self.ui_on_square_activated = function(args) {
			if(self.squares[args.id]) {
				// Remove the <i> inside
				self.squares[args.id].find('i').remove();
				// Change class to btn-primary
				self.squares[args.id].removeClass('btn-danger btn-default btn-warning btn-success disabled').addClass('btn-primary');
			}
		};

		self.ui_on_reveal_empty = function(args) {
			if(self.squares[args.id]) {
				self.squares[args.id].removeClass('btn-primary btn-default btn-warning btn-success btn-danger').addClass('btn-default active');
			}
		};

		self.ui_on_reveal_count = function(args) {
			if(self.squares[args.id]) {
				var $bomb_count_element = $('<span>').addClass('_' + args.count).html(args.count);
				self.squares[args.id].removeClass('btn-primary btn-default btn-warning btn-success btn-danger').addClass('btn-default active').html($bomb_count_element);
			}
		};

		self.ui_on_reveal_mine = function(args) {
			if(self.squares[args.id]) {
				self.squares[args.id].removeClass('btn-primary btn-default btn-warning btn-success btn-danger').addClass('btn-default active');
			}
		};

		self.ui_on_square_highlight = function(args) {
			if(self.squares[args.id]) {
				self.squares[args.id].addClass('active');
			}
		};

		self.ui_on_square_unhighlight = function(args) {
			if(self.squares[args.id]) {
				self.squares[args.id].removeClass('active');
			}
		};

		self.ui_on_board_reset = function() {
			// Dispose all the squares before clearing up the object
			for(var square in self.squares) {
				self.squares[square].off('mousedown').off('mouseup').off('dblclick').remove();
				delete self.squares[square];
			}
		};

		pubsubService.subscribe('ui.square.disable', self.ui_on_disable);
		pubsubService.subscribe('square.remove.focus', self.ui_on_remove_focus);
		pubsubService.subscribe('ui.square.show.mine', self.ui_on_show_mine);

		pubsubService.subscribe('board.reset', self.ui_on_board_reset);

		pubsubService.subscribe('square.flagged', self.ui_on_square_flagged);
		pubsubService.subscribe('square.questioned', self.ui_on_square_questioned);
		pubsubService.subscribe('square.activated', self.ui_on_square_activated);

		pubsubService.subscribe('ui.square.highlight', self.ui_on_square_highlight);
		pubsubService.subscribe('ui.square.unhighlight', self.ui_on_square_unhighlight);

		pubsubService.subscribe('ui.square.reveal.empty', self.ui_on_reveal_empty);
		pubsubService.subscribe('ui.square.reveal.count', self.ui_on_reveal_count);
		pubsubService.subscribe('ui.square.reveal.mine', self.ui_on_reveal_mine);
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