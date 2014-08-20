define(['scripts/services/util'], function(toolsService) {

	function ScoreViewModel(constructor) {
		var self = this;

		this.date = new Date();
		this.difficulty = constructor.difficulty || 'Easy';
		this.time = constructor.time || 0;
		this.timeBonus = constructor.timeBonus || 0;
		this.boardClearBonus = constructor.boardClearBonus || 0;
		this.minesDisarmedBonus = constructor.minesDisarmedBonus || 0;

	}

	ScoreViewModel.prototype.toString = function() {
		return toolsService.printTimeFromSeconds(this.time, this.time > 3600 ? true : false);
	};

	return ScoreViewModel;
});