(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  function HomeController(TaxisService, $scope, $interval, $rootScope) {
    const vm = this;
    const intervalMs = 5000;

    (function init() {
      watchAllTaxiData();
      getTaxiData().then(function (result) {
        vm.taxis = result;
      });
      setupRefreshInterval();
    })();

    /**
     * Compare taxi data with the data from db
     */
    function watchAllTaxiData() {
      $scope.$watch('vm.taxis', function (nVal, oVal) {
        if (!angular.equals(nVal, oVal)){
          vm.initialTaxis = angular.copy(vm.taxis);
        }
      }, true);
    }

    /**
     * Get taxi data
     */
    function getTaxiData() {
      return TaxisService.getTaxis().$promise;
    }

    /**
     * Get all taxis data
     */
    function getTaxis() {
      getTaxiData().then(function (result) {
        vm.newTaxis = result;
        if (vm.newTaxis && vm.initialTaxis && vm.newTaxis.length !== vm.initialTaxis.length) {
          vm.taxis = angular.copy(vm.newTaxis);
        }
        $rootScope.$broadcast('getTaxis');
      });
    }

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
