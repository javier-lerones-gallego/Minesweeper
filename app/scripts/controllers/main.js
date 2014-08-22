'use strict';

/**
 * @ngdoc function
 * @name MineSweeperApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the MineSweeperApp
 */
angular.module('MineSweeperApp')
    .controller('MainCtrl', function ($scope, $location) {

        $scope.games = [
            {
                difficulty: 'Easy',
                rows: 9,
                columns: 9,
                mines: 10
            },
            {
                difficulty: 'Medium',
                rows: 16,
                columns: 16,
                mines: 40
            },
            {
                difficulty: 'Expert',
                rows: 16,
                columns: 30,
                mines: 99
            },
            {
                difficulty: 'Custom',
                rows: 'Z',
                columns: 'Y',
                mines: 10
            }
        ];

        $scope.goTo = function(difficulty) {
            $location.path( "/game/".concat(difficulty.toLowerCase()) );
        };

    });
