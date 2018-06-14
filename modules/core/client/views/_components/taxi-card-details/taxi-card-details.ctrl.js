(function () {
  'use strict';

  angular.module('core').component('taxiCardDetails', {
    bindings: {
      taxi: '<'
    },
    controllerAs: 'vm',
    templateUrl: 'modules/core/client/views/_components/taxi-card-details/taxi-card-details.html',
    controller: function (NajemsService, $rootScope, $scope, $state) {
      let vm = this;

      vm.prekinitev = prekinitev;
      let getTaxisWatcher = null;

      (function init() {
        // Get all najems for this taxi
        vm.najemInfo = getNajem(vm.taxi._id).then(function (result) {
          getLastNajem(result);
          checkIfNajemIsOver();
        });
        listenForUpdates();
        onDestroy();
      })();

      /**
       * iz celotnega nabora najemov, dobi samo prvega
       * @param result
       */
      function getLastNajem(result) {
        if (result[0]) {
          vm.lastNajem = result[0];
          vm.duration = result[0].trajanje;
          vm.datumNajem = result[0].datum;
        }
      }

      /**
       * Listen for updates and check if najem is over to display the right button
       */
      function listenForUpdates() {
        getTaxisWatcher = $rootScope.$on('getTaxis', function () {
          if (vm.datumNajem) {
            checkIfNajemIsOver();
          } else {
            vm.zaseden = false;
          }
        });
      }

      /**
       * Koncept za preverjanje časa
       */
      function checkIfNajemIsOver() {
        if (vm.lastNajem && vm.lastNajem.prekinjen) {
          vm.zaseden = false;
        } else {
          let date = Date.now();    // timestamp: št sekund od 1.1.1970
          let datumNajemaTs = Math.round(new Date(vm.datumNajem).getTime());
          vm.zaseden = ((datumNajemaTs + (vm.duration * 1000)) >= date);
        }
      }

      /**
       * Get najem by taxi id
       * @param taxiId
       * @returns {*}
       */
      function getNajem(taxiId) {
        return NajemsService.getNajemById(taxiId).$promise;
      }

      /**
       * Emit da totalIncome ve da mora dodat 500
       */
      function prekinitev() {
        NajemsService.updateNajem(vm.lastNajem).then(function(result) {
          $rootScope.$emit('prekinitev');
          $state.go($state.current, {}, {reload: true});
        });
      }

      /**
       * Cleanup na destroy direktive
       */
      function onDestroy() {
        $scope.$on('$destroy', function () {
          getTaxisWatcher();
        });
      }

    }
  });
})();
