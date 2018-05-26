(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  function HomeController(TaxisService, $scope, $interval) {
    const vm = this;
    const intervalMs = 5000;

    (function init() {
      setupRefreshInterval();
    })();

    // Get taxi information
    vm.taxis = getTaxis();

    function getTaxis() {
      return TaxisService.getTaxis();
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
