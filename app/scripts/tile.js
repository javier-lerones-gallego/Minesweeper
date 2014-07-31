
define(['jquery'], function($) {
	return function(element) {
		// Private module vars and methods
		var $element = element; // this will point to the HTML button element

		var click = function(e) {
			if(button === 0) { // Make sure is left click
				console.log('Clicked on a tile', e);
			}
		};

		var right_click = function(e) {
			if(e.button === 2) { // Make sure is right click
				console.log('Right clicked on a tile', e);
			}
		};

		var getElement = function() {
			return $element;
		};

		var isBomb = function() {

		};

		var isFlag = function() {

		};

		var isQuestion = function() {

		};


		// Attach the left and center click event to the handler
		$element.on('click', click);

		// Attach the right click event to the handler
		$element.on('mouseup', right_click);


		// Return the module
		return {
			getElement: getElement,

			isBomb: isBomb,
			isFlag: isFlag,
			isQuestion: isQuestion
		}
	}
});