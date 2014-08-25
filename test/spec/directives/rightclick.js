'use strict';

describe('Directive: rightClick', function () {

  // load the directive's module
  beforeEach(module('mineSweeperApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<right-click></right-click>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the rightClick directive');
  }));
});
