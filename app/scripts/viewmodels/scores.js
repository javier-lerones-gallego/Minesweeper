define(['scripts/services/util'], function(utilService) {
	return function() {

		var _scores = {
			easy: {
				best_time: -1
			},
			medium: {
				best_time: -1
			},
			expert: {
				best_time: -1
			}
		};

		/// args: {
		///		difficulty: 'easy', 'medium', 'expert',
		///		time: number (in seconds)
		/// }
		var new_time = function(args) {
			if(_scores[args.difficulty].best_time > args.time) {
				_scores[args.difficulty].best_time = args.time;
			}
		};

		/// args: {
		///		difficulty: 'easy', 'medium', 'expert',
		/// }
		var get_best_time = function(args) {
			return utilService.printTimeFromSeconds(_scores[args.difficulty].best_time);
		};

		return {
			newTime: new_time,

			getBestTime: get_best_time
		}
	}
});