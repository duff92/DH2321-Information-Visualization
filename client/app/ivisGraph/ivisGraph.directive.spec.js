'use strict';

describe('Directive: ivisGraph', function () {

  // load the directive's module
  beforeEach(module('dh2321InformationVisualizationApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ivis-graph></ivis-graph>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ivisGraph directive');
  }));
});
