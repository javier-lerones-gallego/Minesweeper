'use strict';

/**
 * @ngdoc overview
 * @name MineSweeperApp
 * @description
 * # MineSweeperApp
 *
 * Main module of the application.
 */
angular
    .module('MineSweeperApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .when('/game/:difficulty', {
                templateUrl: 'views/game.html',
                controller: 'GameCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
