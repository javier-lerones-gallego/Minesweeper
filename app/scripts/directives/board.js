'use strict';

/**
 * @ngdoc directive
 * @name MineSweeperApp.directive:board
 * @description
 * # board
 */
angular.module('MineSweeperApp')
    .directive('board', function ($gameService, $pubsubService, $log) {
        return {
            templateUrl: 'views/board.html',
            restrict: 'EA',
            transclude: true,
            scope: {
                rows: '@rows',
                columns: '@columns',
                mines: '@mines',
                difficulty: '@difficulty',
                control: '=control'
            },
            controller: function postLink($scope) {
                $scope.firstClick = true;
                $scope.squares = $gameService.getSquares({ rows: $scope.rows, columns: $scope.columns, mines: $scope.mines });

                // Expose rows and columns for the squares
                this.rows = $scope.rows;
                this.columns = $scope.columns;
                this.squares = $scope.squares;

                $scope.parentController = $scope.control || {};
                $scope.parentController.newGame = function() {
                    // Reset everything
                    $scope.firstClick = true;
                    $scope.squares = $gameService.getSquares({ rows: $scope.rows, columns: $scope.columns, mines: $scope.mines });
                };
            }
        };
    });
