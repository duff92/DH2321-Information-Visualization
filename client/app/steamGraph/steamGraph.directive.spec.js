'use strict';

describe('Directive: steamGraph', function () {

  // load the directive's module
  beforeEach(module('dh2321InformationVisualizationApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<steam-graph></steam-graph>');
    element = $compile(element)(scope);
  }));
});
