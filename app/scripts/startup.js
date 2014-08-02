
define(['jquery', 'scripts/tile', 'scripts/board', 'bootstrap'], function($, tile, board) {
	// On document.ready just in case
	$(function() {
		// Cancel the context menu
		document.oncontextmenu = function() { return false; };

		// Create a new board object
		var theBoard = new board($('div.board'), $('div.debug'));

		// Generate the board
		theBoard.generate({ rows: 9, length: 9, bombs: 10 });

		// draw the debug board?
		theBoard.debug(true); 


		// Attach the new board event to the new game button


		// That's it??
	});
});