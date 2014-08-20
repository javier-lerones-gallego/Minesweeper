define(['scripts/services/util', 'scripts/services/pubsub'], function(toolsService, pubsubService) {
	
	function ScoresViewModel(constructor) {
		var self = this;

		this.scores = {
			easy: {
				best_time: 999999,
				total_score: 0
			},
			medium: {
				best_time: 999999,
				total_score: 0
			},
			expert: {
				best_time: 999999,
				total_score: 0
			}
		};

		/// args: {
		///		difficulty: 'easy', 'medium', 'expert',
		///		time: number (in seconds)
		/// }
		this.scores_on_game_won = function(args) {
			// first the best time
			if(self.scores[args.difficulty.toLowerCase()].best_time > args.seconds) {
				self.scores[args.difficulty.toLowerCase()].best_time = args.seconds;
			}
			// second the scores
			// Time bonus:
			//
			// Board clear bonus:
			//
			// Mines disarmed bonus:
		};

		this.scores_on_game_lost = function(args) {
			// mines disarmed bonus:
			
		};


		pubsubService.subscribe('game.won', this.scores_on_game_won);
		pubsubService.subscribe('game.lost', this.scores_on_game_lost);
	}

	ScoresViewModel.prototype.getBestTime = function(args) {
		if(this.scores[args.difficulty.toLowerCase()].best_time !== 999999)
			return toolsService.printTimeFromSeconds(this.scores[args.difficulty.toLowerCase()].best_time);
		else 
			return "00:00";
	};

	return ScoresViewModel;
});