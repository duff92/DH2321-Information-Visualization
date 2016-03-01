'use strict';

describe('Controller: DesignBriefCtrl', function () {

  // load the controller's module
  beforeEach(module('dh2321InformationVisualizationApp'));

  var DesignBriefCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DesignBriefCtrl = $controller('DesignBriefCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
