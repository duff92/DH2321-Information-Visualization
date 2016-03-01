'use strict';

describe('Controller: AnalyzeCtrl', function () {

  // load the controller's module
  beforeEach(module('dh2321InformationVisualizationApp'));

  var AnalyzeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AnalyzeCtrl = $controller('AnalyzeCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
