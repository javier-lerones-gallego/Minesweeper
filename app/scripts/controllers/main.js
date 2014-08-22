'use strict';

/**
 * @ngdoc function
 * @name MineSweeperApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the MineSweeperApp
 */
angular.module('MineSweeperApp')
    .controller('MainCtrl', function ($scope, $location, $modal, $log) {

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
            }
        ];

        $scope.goTo = function(difficulty) {
            $location.path( "/game/".concat(difficulty.toLowerCase()) );
        };

        $scope.dialogConfig = {
            title: 'Are you sure?',
            body: 'Your progress will be lost.',
            buttons: {
                yes: 'Yes',
                cancel: 'Cancel'
            }
        };

        $scope.showCustomModal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'views/dialog.html',
                controller: 'DialogCtrl',
                size: 'sm',
                resolve: {
                    dialogConfig: function () {
                        return $scope.dialogConfig;
                    }
                }
            });

            modalInstance.result.then(
                function () {
                    // Dialog accepted, clicked on Yes

                },
                function () {
                    $log.info('Dialog dismissed at: ' + new Date());
                });
        };

    });
