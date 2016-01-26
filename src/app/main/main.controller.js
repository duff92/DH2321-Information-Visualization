(function() {
  'use strict';

  angular
    .module('dh2321InformationVisualization', ["chart.js"])
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, studentData, toastr) {
    var vm = this;

    vm.students = [];
    vm.classAnimation = '';
    vm.creationDate = 1453539129321;
    vm.showToastr = showToastr;
    vm.labels =["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"];

    vm.data = [
      [65, 59, 90, 81, 56, 55, 40],
      [28, 48, 40, 19, 96, 27, 100]
    ];


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
