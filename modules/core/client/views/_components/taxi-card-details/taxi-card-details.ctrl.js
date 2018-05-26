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
        }
      });

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
