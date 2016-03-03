'use strict';

describe('Controller: UserStudyCtrl', function () {

  // load the controller's module
  beforeEach(module('dh2321InformationVisualizationApp'));

  var UserStudyCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserStudyCtrl = $controller('UserStudyCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
