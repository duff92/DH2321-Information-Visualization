'use strict';

describe('Directive: radarChart', function () {

  // load the directive's module
  beforeEach(module('dh2321InformationVisualizationApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<radar-chart></radar-chart>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the radarChart directive');
  }));
});
