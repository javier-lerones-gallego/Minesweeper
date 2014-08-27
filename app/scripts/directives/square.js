'use strict';

/**
 * @ngdoc directive
 * @name MineSweeperApp.directive:square
 * @description
 * # Square
 */
angular.module('MineSweeperApp')
    .directive('square', function ($pubsubService, $gameService, $log) {
        return {
            templateUrl: 'views/square.html',
            restrict: 'EA',
            transclude: true,
            require: '^board',
            scope: {
                id: '@id',
                mine: '@isMine',
                bombs: '@neighbourMines'
            },
            link: function postLink(scope, element, attrs, boardController) {
                // Variables
                scope.state = 'active';
                scope.bombCount = parseInt(scope.bombs, 10);
                scope.showCount = false;

                // Class names for the UI
                scope.iconCss = '';
                scope.buttonCss = 'btn-primary';
                scope.spanCss = '_'.concat(scope.bombCount);

                // Getters
                scope.isRevealed = function() {
                    return scope.state === 'revealed';
                };
                scope.isQuestion = function() {
                    return scope.state === 'question';
                };
                scope.isFlag = function() {
                    return scope.state === 'flag';
                };
                scope.isActive = function() {
                    return scope.state === 'active';
                };
                scope.hasMineAround = function() {
                    return scope.bombCount > 0;
                };
                scope.isEmpty = function() {
                    return scope.bombCount === 0;
                };
                scope.isMine = function() {
                    return scope.mine === 'true';
                };

                scope.setActive = function() {
                    scope.state = 'active';
                    scope.iconCss = '';
                    scope.buttonCss = 'btn-primary';
                };
                scope.setFlag = function() {
                    scope.state = 'flag';
                    scope.iconCss = 'fa fa-flag';
                    scope.buttonCss = 'btn-warning';
                };
                scope.setQuestion = function() {
                    scope.state = 'question';
                    scope.iconCss = 'fa fa-question-circle';
                    scope.buttonCss = 'btn-success';
                };
                scope.setRevealed = function() {
                    scope.state = 'revealed';
                    scope.iconCss = '';
                    scope.buttonCss = 'btn-default active'
                };
                scope.setExploded = function() {
                    scope.iconCss = 'fa fa-bomb';
                    scope.buttonCss = 'btn-danger';
                };

                // Listen to square.reveal event triggered by other squares
                $pubsubService.on('square.reveal', function(event, data) {
                    // If data.id is not my id check if data.id is a neighbour or not
                    if(data.id !== scope.id) {
                        if($gameService.isNeighbour(scope.id, data.id, boardController.columns)) {
                            scope.reveal();
                        }
                    }
                }, scope);


                scope.reveal = function() {
                    if(!scope.isRevealed() && !scope.isFlag() && !scope.isQuestion()) {
                        if(scope.isEmpty()) {
                            // Mark it as revealed BEFORE invoking the neighbours so the neighbours events don't come back here
                            scope.setRevealed();
                            // Trigger the neighbouring squares reveal event
                            $pubsubService.send('square.reveal', { id: scope.id });
                        } else if(scope.hasMineAround()) {
                            // Mark it as revealed so the neighbours events don't come back here
                            scope.showCount = true;
                            scope.setRevealed();
                        }
                    }
                };

                // Event Handlers
                element.on('mousedown', function (event) {
                    // Prevent default dragging of selected content
                    event.preventDefault();

                    if (event.button === 1) {
                        // Cancel the scrolling for the middle button
                        return false;
                    } else if (event.button === 2 && scope.isRevealed() && scope.hasMineAround()) {
                        // TODO: highlight the neighbours on mousedown
                    }
                });

                element.on('mouseup', function (event) {
                    if(event.button === 0) {
                        if(scope.isActive() && !scope.isMine()) {                          // if not a bomb, reveal it and trigger the neighbour reveal
                            scope.$apply(scope.reveal);
                        } else if(scope.isActive() && scope.isMine()) {
//                          // Game Over, notify the board
                            // TODO: game over notification
                            scope.$apply(scope.setExploded);
                        }
                    } else if(event.button === 2) {
                        if(!scope.isRevealed()) {

                            // if active, switch to flag
                            if(scope.isActive())
                                scope.$apply(scope.setFlag);
                            // if flag, switch to question
                            else if(scope.isFlag())
                                scope.$apply(scope.setQuestion);
                            // if question, switch to active
                            else if(scope.isQuestion())
                                scope.$apply(scope.setActive);

                        } else if(scope.hasMineAround()) {
                            // TODO: highlight the neighbours
                        }
                    }
                });

                element.on('dblclick', function (event) {

                    $log.log('Dblclick detected');
                });


            }
        };
    });
