'use strict';

describe('Service: pubsub', function () {

  // load the service's module
  beforeEach(module('mineSweeperApp'));

  // instantiate service
  var pubsub;
  beforeEach(inject(function (_pubsub_) {
    pubsub = _pubsub_;
  }));

  it('should do something', function () {
    expect(!!pubsub).toBe(true);
  });

});
