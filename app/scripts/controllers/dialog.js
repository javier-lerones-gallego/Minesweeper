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
        $scope.dialogConfig = dialogConfig;

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });
