(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  function HomeController(TaxisService, $scope, $interval, $rootScope) {
    const vm = this;
    const intervalMs = 5000;
    let initialTaxis = [];

    (function init() {
      vm.taxis = TaxisService.getTaxis();
      initialTaxis = angular.copy(vm.taxis);
      setupRefreshInterval();
    })();

    // Get taxi information
    // vm.taxis = getTaxis();

    // let taxiCopy = angular.copy(vm.taxis);

    function getTaxis() {
      // TODO: da narediš promise ($promise) in potem .then in tam setaš
      let newTaxis = TaxisService.getTaxis();
      $rootScope.$broadcast('getTaxis');
      console.log('update taxis', newTaxis.length);
      console.log('update taxis', initialTaxis.length);
      if (newTaxis.length !== initialTaxis.length) {
        vm.taxis = angular.copy(newTaxis);
      }
      //vm.taxis =  TaxisService.getTaxis();
      // return TaxisService.getTaxis();
      // console.log(vm.taxis);
    }

    // todo ask mare
    // function getTaxisAndSeeIfAnyNew() {
    //   var newTaxiCopy = getTaxis();
    //   if (vm.taxis !== newTaxiCopy) {
    //     vm.taxis = newTaxiCopy;
    //   }
    // }

    /**
     * Refresh interval da se klicejo podatk iz baze vsake 5 sec
     */
    function setupRefreshInterval() {
      // will periodically refresh state data
      let refreshInterval = $interval(getTaxis, intervalMs);
      $scope.$on('$destroy', function () {
        // this can't be handled on state change, because switching between tiles and table doesn't execute controller
        // and refresh doesn't get reinitialized
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
          refreshInterval = null;
        }
      });
    }
  }
}());
