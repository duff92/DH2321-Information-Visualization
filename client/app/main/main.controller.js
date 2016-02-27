'use strict';

(function() {

class MainController {

  constructor($http, $scope, socket) {
    this.$http = $http;
    this.awesomeThings = [];
    this.d3Data = [
      {name: "Greg", score:98},
      {name: "Ari", score:96},
      {name: "Loser", score: 48}
    ];
    this.d3OnClick = function(item){
      alert(item.name);
    };

    this.d3Data2 = [
      [//iPhone
        {axis:"Battery Life",value:0.22},
        {axis:"Brand",value:0.28},
        {axis:"Contract Cost",value:0.29},
        {axis:"Design And Quality",value:0.17},
        {axis:"Have Internet Connectivity",value:0.22},
        {axis:"Large Screen",value:0.02},
        {axis:"Price Of Device",value:0.21},
        {axis:"To Be A Smartphone",value:0.50}
      ],[//Samsung
        {axis:"Battery Life",value:0.27},
        {axis:"Brand",value:0.16},
        {axis:"Contract Cost",value:0.35},
        {axis:"Design And Quality",value:0.13},
        {axis:"Have Internet Connectivity",value:0.20},
        {axis:"Large Screen",value:0.13},
        {axis:"Price Of Device",value:0.35},
        {axis:"To Be A Smartphone",value:0.38}
      ],[//Nokia Smartphone
        {axis:"Battery Life",value:0.26},
        {axis:"Brand",value:0.10},
        {axis:"Contract Cost",value:0.30},
        {axis:"Design And Quality",value:0.14},
        {axis:"Have Internet Connectivity",value:0.22},
        {axis:"Large Screen",value:0.04},
        {axis:"Price Of Device",value:0.41},
        {axis:"To Be A Smartphone",value:0.30}
      ]
    ];

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', { name: this.newThing });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete('/api/things/' + thing._id);
  }
}

angular.module('dh2321InformationVisualizationApp')
  .controller('MainController', MainController);

})();
