
define(['jquery', 'scripts/game', 'scripts/square', 'scripts/ui', 'bootstrap'], function($, game, square, ui) {
	// On document.ready just in case
	$(function() {
		// Cancel the context menu
		document.oncontextmenu = function() { return false; };

		// Create a new game object
		var theBoard = new game($('div.board'), $('div.debug'));

		// Attach the new board event to the new game buttons
		$('#neweasy').on('click', function() {
			// Generate the board
			theBoard.createEasy();
			// Show the board, the timer, and the option buttons
			$('#gameboard').show();
			// Hide the New Game Buttons
			$('#newgamebuttons').hide();
			// Draw the board
			theBoard.show();
		});

		$('#newmedium').on('click', function() {

		});

		$('#newexpert').on('click', function() {
		});

		// Attach the debug method to the checkbox
		$('#debug').on('click', function(event) {
			theBoard.showDebug();
		});

		// That's it??
	});
});