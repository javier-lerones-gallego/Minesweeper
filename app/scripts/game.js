
define(['jquery', 'scripts/viewmodels/board', 'scripts/services/ui', 'scripts/services/pubsub', 'bootstrap'], function($, BoardViewModel, uiService, pubsubService) {
	// On document.ready just in case
	$(function() {
		// Diable the context menu
		document.oncontextmenu = function() { return false; };

		// Create a new board object
		var _board = new BoardViewModel();

		///
		/// Event Subscriptions
		///
		pubsubService.subscribe('flag.change', function(args) {
			$('#minesleft').html(args.count);
		});

		pubsubService.subscribe('game.won', function() {
			// Stop the timer
			_board.timer.stop();
			// Show the modal
			$('#resultsModal')
				.find('#resultsTime')
				.html(_board.timer.toString())
				.end()
				.find('#resultsBestTime')
				.html()
				.end()
				.find('#modalTitle')
				.html('Congratulations')
				.end()
				.modal({ keyboard: false, backdrop: 'static'});
		})

		pubsubService.subscribe('game.lost', function() {
			// Stop the timer
			_board.timer.stop();
			// Show the modal
			$('#resultsModal')
				.find('#resultsTime')
				.html(_board.timer.toString())
				.end()
				.find('#resultsBestTime')
				.html()
				.end()
				.find('#modalTitle')
				.html('Better luck next time!')
				.end()
				.modal({ keyboard: false, backdrop: 'static'});
		});

		pubsubService.subscribe('timer.tick', function(args) {
			// Update the time label
			$('#board-page').find('#timer').html(args.time);
		});



		///
		/// New Game Buttons
		///

		// Attach the new board event to the new game buttons
		$('#neweasy').on('click', function() {
			newEasy();
		});

		$('#newmedium').on('click', function() {
			newMedium();
		});

		$('#newexpert').on('click', function() {
			newExpert();
		});


		///
		/// Game Buttons
		///

		// The other buttons
		$('#gohome').on('click', function() {
			$('#confirmModal').data('event', 'gohome')
				.find('div.modal-body')
				.html('Your game progress will be lost...')
				.end()
				.modal({ keyboard: false, backdrop: 'static'});
		});
		$('#newgame').on('click', function() {
			$('#confirmModal').data('event', 'newgame')
				.find('div.modal-body')
				.html('Do you want to start a new game? Your game progress will be lost...')
				.end()
				.modal({ keyboard: false, backdrop: 'static'});
		});


		///
		/// The Modal Buttons
		///
		$('#confirmModal').find('button.btn-primary').on('click', function() {
			// YES
			if($('#confirmModal').data('event') === 'gohome') {
				_board.reset();
				_board.timer.stop();
				showHome();
			} else if($('#confirmModal').data('event') === 'newgame') {
				_board.reset();
				_board.timer.stop();
				// New game of each difficulty
				if(_board.isEasy()) newEasy();
				if(_board.isMedium()) newMedium();
				if(_board.isExpert()) newExpert();
			}

			$('#confirmModal').modal('hide');
		});
		$('#confirmModal').find('button.btn-default').on('click', function() {
			// NO
			
			$('#confirmModal').modal('hide');
		});

		$('#resultsModal').find('button.btn-primary').on('click', function() {
			_board.reset();
			_board.timer.stop();
			showHome();
			$('#resultsModal').modal('hide');
		});
		$('#resultsModal').find('button.btn-default').on('click', function() {
			_board.reset();
			_board.timer.stop();
			// New game of each difficulty
			if(_board.isEasy()) newEasy();
			if(_board.isMedium()) newMedium();
			if(_board.isExpert()) newExpert();
			$('#resultsModal').modal('hide');
		});



		///
		/// New Game Functions
		///
		function newEasy() {
			// Generate the board
			_board.generate({ level: 'easy' });

			$('#gamedifficulty').removeClass('medium expert custom').addClass('easy');
			$('#minesleft').removeClass('medium expert custom').addClass('easy');

			resetTimer();
			showGameBoard();
		}

		function newMedium() {
			// Generate the board
			_board.generate({ level: 'medium' });

			$('#gamedifficulty').removeClass('easy expert custom').addClass('medium');
			$('#minesleft').removeClass('easy expert custom').addClass('medium');

			resetTimer();
			showGameBoard();
		}

		function newExpert() {
			// Generate the board
			_board.generate({ level: 'expert' });

			$('#gamedifficulty').removeClass('easy medium custom').addClass('expert');
			$('#minesleft').removeClass('easy medium custom').addClass('expert');

			resetTimer();
			showGameBoard();
		}

		function resetTimer() {
			// Reset the timer
			_board.timer.reset();
			// Clear the label
			$('#timer').html('00:00');
		}

		function showGameBoard() {
			// Show the difficulty level
			$('#gamedifficulty').html(_board.boardOptions.difficulty);
			// Show the board panel
			showBoard();
			// Draw the board
			uiService.getInstance().adjustBoardWidth(_board.boardOptions);
			uiService.getInstance().addUISquares(_board.squares);
		}


		///
		/// Switch Panels Functions
		///
		function showHome() {
			$('#home-page').show();
			hideBoard();
			hideScores();
		}
		function hideHome() {
			$('#home-page').hide();
		}
		function showBoard() {
			$('#board-page').show();
			hideHome();
			hideScores();
		}
		function hideBoard() {
			$('#board-page').hide();
		}
		function showScores() {
			$('#scores-page').show();
			hideHome();
			hideBoard();
		}
		function hideScores() {
			$('#scores-page').hide();
		}

		///
		/// Expose console.debug_board()
		///
		window.debug_board = _board.debug;
	});
});