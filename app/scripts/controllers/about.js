'use strict';

/**
 * @ngdoc function
 * @name dh2321InformationVisualizationApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the dh2321InformationVisualizationApp
 */
angular.module('dh2321InformationVisualizationApp')
  .controller('AboutCtrl', function ($scope, Lightbox) {
    $scope.imagesWVS = [
      {
        'url': '../images/wvs_img1.png',
        'caption': 'Initial filter for last wave (2010-2014) as a first step of data processing.'
      },
      {
        'url': '../images/wvs_img2.png',
        'caption': 'Choose specific countries for the research question as part of the data processing'
      },
      {
        'url': '../images/wvs_img3.png',
        'caption': 'Searching for the variables to use for the research question (state of health & satisfaction with your life)'
      },
      {
        'url': '../images/wvs_img4.png',
        'caption': 'Data then maps to both tables at first, but with view transformations we also get the visual mappings of pie chart and boxplot. We also have the possibility to cross by different parameters or map other data transformations.'
      },
      {
        'url': '',
        'caption': 'In the final step I need to go back to Step 3 to switch variable and repeat the same procedure to make any comparison between the values. This shows the drawback of this visualization as showing multiple variables at the same time is difficult. But to find the answer to my research question I have to pick data from both variables and compare them.'
      }
    ];

    $scope.imagesOWN = [
      {
        'url': '',
        'caption': 'Initial data processing by downloading data from Gapminder and WVS to Excel, and then convert it to JSON. Also the mean was calculated for some variables from WVS.'
      },
      {
        'url': '../images/own_img1.png',
        'caption': 'The visual mappings in this visualization is instead into parallel coordinates which brings the possibility of comparing multiple variables at the same time.'
      },
      {
        'url': '../images/own_img2.png',
        'caption': 'The possible view transformation is to use brushing to filter the data. By this image we can see the relation of lower state of health shows lower spending on health products. So by this visualization it makes it easier to compare multiple variables at the same time, but with extra functionality and more data interesting correlations between countries could be found.'
      }
    ];

    $scope.openLightboxModal = function (index) {
      Lightbox.openModal($scope.images, index);
    };
  });
