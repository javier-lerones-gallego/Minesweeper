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

        switch($scope.difficulty) {
            case 'easy':
                $scope.rows = 9;
                $scope.columns = 9;
                $scope.mines = 10;
                break;
            case 'medium':
                $scope.rows = 16;
                $scope.columns = 16;
                $scope.mines = 40;
                break;
            case 'expert':
                $scope.rows = 16;
                $scope.columns = 30;
                $scope.mines = 99;
                break;
            case 'custom':
                $scope.rows = 9;
                $scope.columns = 9;
                $scope.mines = 10;
                break;
        }

        $scope.flags = $scope.mines;

        // The board directive will populate this bi-directional parameter, it just needs to exist here
        $scope.boardController = {};

        $scope.goHome = function() {
            $location.path( "/" );
        };


    });
