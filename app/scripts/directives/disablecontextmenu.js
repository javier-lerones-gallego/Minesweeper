'use strict';

/**
 * @ngdoc directive
 * @name mineSweeperApp.directive:disableContextMenu
 * @description
 * # disableContextMenu
 */
angular.module('MineSweeperApp')
    .directive('disableContextMenu', function ($parse) {
        return function(scope, element, attr) {
            element.bind('contextmenu', function(event) {
                event.preventDefault();
                return false;
            });
        }
    });
