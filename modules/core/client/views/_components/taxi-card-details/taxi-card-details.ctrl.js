(function () {
  'use strict';

  angular.module('core').component('taxiCardDetails', {
    bindings: {
      taxi: '<'
    },
    controllerAs: 'vm',
    templateUrl: 'modules/core/client/views/_components/taxi-card-details/taxi-card-details.html',
    controller: function (NajemsService, $rootScope) {
      let vm = this;

      vm.prekinitev = prekinitev;

      // Get najem info for current taxi
      vm.najemInfo = getNajem(vm.taxi._id).then(function (result) {
        if(result[0]){
          vm.prekinjen = result[0].prekinjen;
          vm.duration = result[0].trajanje;
          vm.datumNajem = result[0].datum;
        }
        if (vm.datumNajem){
          checkIfNajemIsOver();
        } else {
          vm.prost = true;
        }
      });

      (function init() {
        listenForUpdates();
      })();

      function listenForUpdates() {
        $rootScope.$on('getTaxis', function () {
          if (vm.datumNajem){
            checkIfNajemIsOver();
          } else {
            vm.prost = true;
          }
        });
      }

      /**
       * Koncept za preverjanje časa
       */
      function checkIfNajemIsOver() {
        let date = Date.now();    // timestamp: št sekund od 1.1.1970
        let datumNajemaTs = Math.round(new Date(vm.datumNajem).getTime());
        vm.zaseden = (datumNajemaTs + (vm.duration * 1000)) < date;
        console.log(vm.zaseden);
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
        $rootScope.$emit('prekinitev');
      }

    }
  });
})();
