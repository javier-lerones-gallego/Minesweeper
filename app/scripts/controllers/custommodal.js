'use strict';

/**
 * @ngdoc function
 * @name MineSweeperApp.controller:CustomModalCtrl
 * @description
 * # CustomModalCtrl
 * Controller of the MineSweeperApp
 */
angular.module('MineSweeperApp')
  .controller('CustomModalCtrl', function ($scope, $modalInstance, formOptions) {
        $scope.container = {};

        $scope.container.rows = formOptions.rows;
        $scope.container.columns = formOptions.columns;
        $scope.container.mines = formOptions.mines;

        $scope.ok = function () {
            $modalInstance.close({
                rows: $scope.rows,
                columns: $scope.columns,
                mines: $scope.mines
            }); // Pass arguments to close to send them back to the opener controller
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.validate = function() {

        };
    });
