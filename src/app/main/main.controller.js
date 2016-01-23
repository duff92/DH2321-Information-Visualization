(function() {
  'use strict';

  angular
    .module('dh2321InformationVisualization')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, studentData, toastr) {
    var vm = this;

    vm.students = [];
    vm.classAnimation = '';
    vm.creationDate = 1453539129321;
    vm.showToastr = showToastr;

    activate();

    function activate() {
      getStudentData();
      $timeout(function() {
        vm.classAnimation = 'rubberBand';
      }, 4000);
    }

    function showToastr() {
      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      vm.classAnimation = '';
    }

    function getStudentData() {
      vm.students = studentData.getStudents();

      angular.forEach(vm.students, function(student) {
        student.rank = Math.random();
      });
    }
  }
})();
