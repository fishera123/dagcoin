/* global angular */

(() => {
  'use strict';

  /**
   * @desc Directive for displaying sidebar on the left
   * @example <dag-side-menu></dag-side-menu>
   */
  angular
    .module('copayApp.directives')
    .directive('dagSideMenu', dagSideMenu);

  dagSideMenu.$inject = ['menuLinks'];

  function dagSideMenu(menuLinks) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'directives/dagSideMenu/dagSideMenu.template.html',
      scope: {},
      link: ($scope) => {
        $scope.lists = menuLinks;
      }
    };
  }
})();
