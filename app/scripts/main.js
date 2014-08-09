
define(['jquery', 'scripts/game', 'scripts/square', 'scripts/ui', 'bootstrap'], function($, game, square, ui) {
	// On document.ready just in case
	$(function() {
		// Diable the context menu
		document.oncontextmenu = function() { return false; };

		// Create a new game object
		var theGame = new game();
		theGame.setBoard($('div.board'));
		theGame.createTimer();

		///
		/// Board Event Handlers
		///

		// Attach the mine count listener to the game object event
		theGame.onFlagCountChange(function(event, args) {
			$('#minesleft').html(args.count);
		});

		theGame.onGameWon(function(event, args) {
			theGame.stopTimer();
			$('#resultsModal').find('#modalTitle').html('Congratulations');
			$('#resultsModal').modal({ keyboard: false, backdrop: 'static'});
		});

		theGame.onGameLost(function(event, args) {
			theGame.stopTimer();
			$('#resultsModal').find('#modalTitle').html('Better luck next time!');
			$('#resultsModal').modal({ keyboard: false, backdrop: 'static'});
		});

		theGame.onTimerTick(function(event, args) {
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
				theGame.reset();
				showHome();
			} else if($('#confirmModal').data('event') === 'newgame') {
				theGame.reset();
				// New game of each difficulty
				if(theGame.isEasy()) newEasy();
				if(theGame.isMedium()) newMedium();
				if(theGame.isExpert()) newExpert();
			}

			$('#confirmModal').modal('hide');
		});
		$('#confirmModal').find('button.btn-default').on('click', function() {
			// NO

			$('#confirmModal').modal('hide');
		});

		$('#resultsModal').find('button.btn-primary').on('click', function() {
			theGame.reset();
			showHome();
			$('#resultsModal').modal('hide');
		});
		$('#resultsModal').find('button.btn-default').on('click', function() {
			theGame.reset();
			// New game of each difficulty
			if(theGame.isEasy()) newEasy();
			if(theGame.isMedium()) newMedium();
			if(theGame.isExpert()) newExpert();
			$('#resultsModal').modal('hide');
		});



		///
		/// New Game Functions
		///
		function newEasy() {
			// Generate the board
			theGame.createEasy();
			$('#gamedifficulty').removeClass('medium expert custom').addClass('easy');
			$('#minesleft').removeClass('medium expert custom').addClass('easy');
			resetTimer();
			showGameBoard();
		}

		function newMedium() {
			// Generate the board
			theGame.createMedium();
			$('#gamedifficulty').removeClass('easy expert custom').addClass('medium');
			$('#minesleft').removeClass('easy expert custom').addClass('medium');
			resetTimer();
			showGameBoard();
		}

		function newExpert() {
			// Generate the board
			theGame.createExpert();
			$('#gamedifficulty').removeClass('easy medium custom').addClass('expert');
			$('#minesleft').removeClass('easy medium custom').addClass('expert');
			resetTimer();
			showGameBoard();
		}

		function resetTimer() {
			// Reset the timer
			theGame.resetTimer();
			// Clear the label
			$('#timer').html('00:00:00');
		}

		function showGameBoard() {
			// Show the difficulty level
			$('#gamedifficulty').html(theGame.getDifficulty());
			// Show the board panel
			showBoard();
			// Draw the board
			theGame.show();
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
		window.debug_board = theGame.debug;
	});
});