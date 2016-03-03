'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Overview',
    'state': 'main'
  },
    {
      'title': 'Analyze data',
      'state': 'analyze'
    },
    {
      'title': 'Design brief',
      'state': 'design-brief'
    },
    {
      'title': 'User study',
      'state': 'user-study'
    }];

  isCollapsed = true;
  //end-non-standard

  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }
}

angular.module('dh2321InformationVisualizationApp')
  .controller('NavbarController', NavbarController);
