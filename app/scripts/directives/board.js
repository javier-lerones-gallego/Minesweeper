'use strict';

/**
 * @ngdoc directive
 * @name MineSweeperApp.directive:board
 * @description
 * # board
 */
angular.module('MineSweeperApp')
    .directive('board', function ($gameService) {
        return {
            templateUrl: 'views/board.html',
            restrict: 'EA',
            scope: {
                rows: '@rows',
                columns: '@columns',
                mines: '@mines',
                difficulty: '@difficulty'
            },
            controller: function postLink($scope) {
                $scope.firstClick = true;

                $scope.squares = [];

                $scope.mines = $gameService.getRandomMines({ rows: $scope.rows, columns: $scope.columns, mines: $scope.mines });

                for(var i = 0, l = ($scope.rows * $scope.columns); i < l; i++) {
                    $scope.squares.push({ id: i, isMine: $scope.mines[i] ? true : false });
                }

            }
        };
    });
