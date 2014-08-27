'use strict';

/**
 * @ngdoc service
 * @name MineSweeperApp.pubsub
 * @description
 * # pubsub
 * Factory in the MineSweeperApp.
 */
angular.module('MineSweeperApp')
    .factory('$pubsubService', function ($rootScope) {
        var pubsub = {};
        pubsub.send = function(msg, data) {
            data = data || {};
            $rootScope.$emit(msg, data);
        };
        pubsub.on = function(msg, func, scope) {
            var unbind = $rootScope.$on(msg, func);
            if (scope) {
                scope.$on('$destroy', unbind);
            }
        };
        return pubsub;
    });
