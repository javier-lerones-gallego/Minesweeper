
define(['jquery', 'scripts/game', 'scripts/square', 'scripts/ui', 'bootstrap'], function($, game, square, ui) {
	// On document.ready just in case
	$(function() {
		// Diable the context menu
		document.oncontextmenu = function() { return false; };

		// Create a new game object
		var theGame = new game();

		theGame.setBoard($('div.board'));

		// Attach the mine count listener to the game object event
		theGame.onFlagCountChange(function(event, args) {
			$('#minesleft').html(args.count);
		});

		theGame.onGameWon(function(event, args) {

		});

		theGame.onGameLost(function(event, args) {
			console.log('Game Over');
		});

		// Attach the new board event to the new game buttons
		$('#neweasy').on('click', function() {
			// Generate the board
			theGame.createEasy();
			// Show the difficulty level
			$('#gamedifficulty').html(theGame.getDifficulty())
			// Show the board, the timer, and the option buttons
			$('#gameboard').show();
			// Hide the New Game Buttons
			$('#newgamebuttons').hide();
			// Draw the board
			theGame.show();
		});

		$('#newmedium').on('click', function() {
		});

		$('#newexpert').on('click', function() {
		});

		// Do the unthinkable!
		window.debug_board = theGame.debug;
	});
});