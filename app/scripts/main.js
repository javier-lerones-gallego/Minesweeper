
define(['jquery', 'scripts/board', 'scripts/square', 'scripts/ui', 'scripts/scores', 'scripts/pubsub', 'bootstrap'], function($, board, square, ui, scores, pubsub) {
	// On document.ready just in case
	$(function() {
		// Diable the context menu
		document.oncontextmenu = function() { return false; };

		// Create a new game object
		var theBoard = new board();
		theBoard.createTimer();
		theBoard.createSubscriptions();

		// Create the scores object
		var theScores = new scores();

		///
		/// Event Subscriptions
		///
		pubsub.subscribe('game.flag.change', function(args) {
			$('#minesleft').html(args.count);
		});

		pubsub.subscribe('game.won', function() {
			theBoard.getTimer().stop();
			$('#resultsModal').find('#resultsTime').html(theBoard.getTimer().getPrint());
			$('#resultsModal').find('#modalTitle').html('Congratulations');
			$('#resultsModal').modal({ keyboard: false, backdrop: 'static'});
		})

		pubsub.subscribe('game.lost', function() {
			theBoard.getTimer().stop();
			$('#resultsModal').find('#resultsTime').html(theBoard.getTimer().getPrint());
			$('#resultsModal').find('#modalTitle').html('Better luck next time!');
			$('#resultsModal').modal({ keyboard: false, backdrop: 'static'});
		});

		pubsub.subscribe('timer.tick', function(args) {
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
			$('#confirmModal').data('event', 'gohome').find('div.modal-body').html('Your game progress will be lost...').end().modal({ keyboard: false, backdrop: 'static'});
		});
		$('#newgame').on('click', function() {
			$('#confirmModal').data('event', 'newgame').find('div.modal-body').html('Do you want to start a new game? Your game progress will be lost...').end().modal({ keyboard: false, backdrop: 'static'});
		});


		///
		/// The Modal Buttons
		///
		$('#confirmModal').find('button.btn-primary').on('click', function() {
			// YES
			if($('#confirmModal').data('event') === 'gohome') {
				theBoard.reset();
				showHome();
			} else if($('#confirmModal').data('event') === 'newgame') {
				theBoard.reset();
				// New game of each difficulty
				if(theBoard.isEasy()) newEasy();
				if(theBoard.isMedium()) newMedium();
				if(theBoard.isExpert()) newExpert();
			}

			$('#confirmModal').modal('hide');
		});
		$('#confirmModal').find('button.btn-default').on('click', function() {
			// NO
			
			$('#confirmModal').modal('hide');
		});

		$('#resultsModal').find('button.btn-primary').on('click', function() {
			theBoard.reset();
			showHome();
			$('#resultsModal').modal('hide');
		});
		$('#resultsModal').find('button.btn-default').on('click', function() {
			theBoard.reset();
			// New game of each difficulty
			if(theBoard.isEasy()) newEasy();
			if(theBoard.isMedium()) newMedium();
			if(theBoard.isExpert()) newExpert();
			$('#resultsModal').modal('hide');
		});



		///
		/// New Game Functions
		///
		function newEasy() {
			// Generate the board
			theBoard.createEasy();
			$('#gamedifficulty').removeClass('medium expert custom').addClass('easy');
			$('#minesleft').removeClass('medium expert custom').addClass('easy');
			resetTimer();
			showGameBoard();
		}

		function newMedium() {
			// Generate the board
			theBoard.createMedium();
			$('#gamedifficulty').removeClass('easy expert custom').addClass('medium');
			$('#minesleft').removeClass('easy expert custom').addClass('medium');
			resetTimer();
			showGameBoard();
		}

		function newExpert() {
			// Generate the board
			theBoard.createExpert();
			$('#gamedifficulty').removeClass('easy medium custom').addClass('expert');
			$('#minesleft').removeClass('easy medium custom').addClass('expert');
			resetTimer();
			showGameBoard();
		}

		function resetTimer() {
			// Reset the timer
			theBoard.getTimer().reset();
			// Clear the label
			$('#timer').html('00:00');
		}

		function showGameBoard() {
			// Show the difficulty level
			$('#gamedifficulty').html(theBoard.getDifficulty());
			// Show the board panel
			showBoard();
			// Draw the board
			theBoard.show();
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
		window.debug_board = theBoard.debug;
	});
});