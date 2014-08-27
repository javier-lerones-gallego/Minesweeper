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

        $scope.showCustomModal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'views/custom.modal.html',
                controller: 'CustomModalCtrl',
                size: 'md',
                resolve: {
                    formOptions: function () {
                        return { rows: 9, columns: 9, mines: 10 };
                    }
                }
            });

            modalInstance.result.then(
                function (gameOptions) {
                    // Dialog accepted, clicked on Yes
                    $log.log(gameOptions);
                },
                function () {
                    // Cancelled the modal
                });
        };

    });
