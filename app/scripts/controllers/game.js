'use strict';

/**
 * @ngdoc function
 * @name MineSweeperApp.controller:GameCtrl
 * @description
 * # GameCtrl
 * Controller of the MineSweeperApp
 */
angular.module('MineSweeperApp')
    .controller('GameCtrl', function ($scope, $location, $routeParams, $log) {

        $scope.difficulty = $routeParams.difficulty;

        $scope.squares = [];

        if($routeParams.difficulty === 'easy') {
            for(var i = 0, l = 81; i < l; i++) {
                $scope.squares.push(i);
            }
        }
        else if($routeParams.difficulty === 'medium') {
            for(var i = 0, l = 256; i < l; i++) {
                $scope.squares.push(i);
            }
        }


    });
