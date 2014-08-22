'use strict';

/**
 * @ngdoc service
 * @name MineSweeperApp.Game
 * @description
 * # Game
 * Service in the MineSweeperApp.
 */
angular.module('MineSweeperApp')
    .service('$gameService', function GameService() {
        // AngularJS will instantiate a singleton by calling "new" on this function

        this.randomNumber = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        };

        this.getRandomMines = function(options) {
            // The object to stored the indexes
            var mines = {};
            // Current number of mines added
            var added = 0;
            // Do until we randomize the total number of mines
            while(added < options.mines) {
                // Get a random index
                var newIndex = this.randomNumber(0, (options.rows * options.columns) - 1);
                // If it doesn't exist, add it to the indexes
                if(!mines[newIndex]) {
                    mines[newIndex] = true;
                    added += 1;
                }
            }
            // Return the indexes
            return mines;
        };

        this.generate = function(options) {

        }
    });
