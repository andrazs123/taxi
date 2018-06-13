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
        console.log('getLastNajem', result[0]);
        if (result[0]) {
          vm.lastNajem = result[0];
          // vm.prekinjen = result[0].prekinjen;
          vm.duration = result[0].trajanje;
          vm.datumNajem = result[0].datum;
        }
      }

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
        console.log('checkIfNajemIsOver', JSON.stringify(vm.lastNajem));
        if (vm.lastNajem && vm.lastNajem.prekinjen) {
          vm.zaseden = false;
        } else {
          let date = Date.now();    // timestamp: št sekund od 1.1.1970
          let datumNajemaTs = Math.round(new Date(vm.datumNajem).getTime());
          // console.log('checkIfNajemIsOver', (datumNajemaTs + (vm.duration * 1000)) - date);
          // console.log('checkIfNajemIsOver check', ((datumNajemaTs + (vm.duration * 1000)) >= date));
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
        // vm.lastNajem.prekinjen = true;
        NajemsService.updateNajem(vm.lastNajem).then(function(result) {
          console.log('updateNajem.then', result);
          $rootScope.$emit('prekinitev');
          // vm.zaseden = false;
          $state.go($state.current, {}, {reload: true});
          //
        });
      }

      /**
       * cleanup na destroy direktive
       */
      function onDestroy() {
        $scope.$on('$destroy', function () {
          console.log('taxiCardDetails.onDestroy')
          getTaxisWatcher();
        });
      }

    }
  });
})();
