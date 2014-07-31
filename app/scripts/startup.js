
define(['jquery', 'scripts/tile', 'scripts/board', 'bootstrap'], function($, tile, board) {
	// On document.ready just in case
	$(function() {
		// Cancel the context menu
		document.oncontextmenu = function() { return false; };

		// Create a new board object
		var theBoard = new board($('div.board'));

		// Generate the board
		theBoard.generate({ rows: 9, length: 9 });

		// Attach the new board event to the new game button


		// That's it??
	});
});