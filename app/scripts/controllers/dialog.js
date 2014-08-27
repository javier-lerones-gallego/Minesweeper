'use strict';

/**
 * @ngdoc function
 * @name MineSweeperApp.controller:DialogCtrl
 * @description
 * # DialogCtrl
 * Controller of the MineSweeperApp
 */
angular.module('MineSweeperApp')
    .controller('DialogCtrl', function ($scope, $modalInstance, dialogConfig) {
        $scope.config = dialogConfig;

        $scope.ok = function () {
            $modalInstance.close(); // Pass arguments to close to send them back to the opener controller
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });
