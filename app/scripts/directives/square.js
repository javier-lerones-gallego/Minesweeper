'use strict';

/**
 * @ngdoc directive
 * @name MineSweeperApp.directive:square
 * @description
 * # Square
 */
angular.module('MineSweeperApp')
    .directive('square', function ($log) {
        return {
            templateUrl: 'views/square.html',
            restrict: 'E',
            scope: {
                
            },
            link: function postLink(scope, element, attrs) {

                element.on('mousedown', function(event) {
                    // Prevent default dragging of selected content
                    event.preventDefault();

                    $log.log('Mousedown detected');
                });

                element.on('mouseup', function(event) {

                    $log.log('Mouseup detected');
                });

                element.on('dblclick', function(event) {

                    $log.log('Dblclick detected');
                });


            }
        };
    });
