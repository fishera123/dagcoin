(() => {
  'use strict';

  /**
   * @desc Carousel to display Wallets
   * @example <dag-wallets-carousel></dag-wallets-carousel>
   */
  angular
    .module('copayApp.directives')
    .directive('dagWalletsCarousel', dagWalletsCarousel);

  dagWalletsCarousel.$inject = ['profileService'];

  function dagWalletsCarousel(profileService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'directives/dagWalletsCarousel/dagWalletsCarousel.template.html',
      scope: {},
      link: ($scope) => {
        $scope.swiper = {};
        $scope.wallets = profileService.getWallets();

        console.group('Wallets');
        console.log($scope.wallets);
        console.groupEnd('Wallets');

        console.log(profileService.focusedClient);

        $scope.onReadySwiper = (swiper) => {
          swiper.on('slideChangeStart', () => {
            profileService.setAndStoreFocus($scope.wallets[swiper.activeIndex].id, () => {
              console.log('wallet changed');
            });
          });

          swiper.on('slideChangeEnd', () => {
            console.log('slideChangeEnd');
          });
        };
      }
    };
  }
})();
