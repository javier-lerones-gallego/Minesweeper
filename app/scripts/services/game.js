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

        this.getBombCount = function(index, mines, columns) {
            var bombs = 0;

            for(var mineIndex in mines) {
                if(index !== mineIndex && this.isNeighbour(index, mineIndex, columns)) {
                    bombs += 1;
                }
            }

            return bombs;
        };

        this.getSquares = function(options) {
            var mines = this.getRandomMines(options);
            var squares = [];

            for(var i = 0, l = (options.rows * options.columns); i < l; i++) {
                squares.push({
                    id: i,
                    isMine: mines[i] ? true : false,
                    bombs: this.getBombCount(i, mines, options.columns)
                });
            }

            return squares;
        };

        this.isNeighbour = function(index, target, columns) {
            // Calculate the distance between two points with Pythagoras
            var source = this.toCoordinates(index, columns);
            var dest = this.toCoordinates(target, columns);

            var distance = Math.round(Math.sqrt( Math.pow( (dest.x - source.x), 2 ) + Math.pow( (dest.y - source.y) , 2) ));

            return distance === 1;
        };

        this.toCoordinates = function(index, columns) {
            var coordinates = {};

            coordinates.x = Math.floor(index / columns);
            coordinates.y = index % columns;

            return coordinates;
        };

    });
