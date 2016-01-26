'use strict';

describe('Service: studentData', function () {

  // load the service's module
  beforeEach(module('dh2321InformationVisualizationApp'));

  // instantiate service
  var studentData;
  beforeEach(inject(function (_studentData_) {
    studentData = _studentData_;
  }));

  it('should do something', function () {
    expect(!!studentData).toBe(true);
  });

});
