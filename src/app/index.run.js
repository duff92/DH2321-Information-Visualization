(function() {
  'use strict';

  angular
    .module('dh2321InformationVisualization')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
