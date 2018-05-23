(function () {
  'use strict';

  angular.module('core').component('taxiCardDetails', {
    bindings: {
      taxi: '<'
    },
    controllerAs: 'vm',
    templateUrl: 'modules/core/client/views/_components/taxi-card-details/taxi-card-details.html',
    controller: function (NajemsService) {
      let vm = this;

      vm.prekinitev = prekinitev;
      vm.najemInfo = getNajem(vm.taxi._id);
// console.log(vm.najemInfo);  TODO tukaj foreach pa findById;
      function getNajem(taxiId) {
        return NajemsService.getNajemById({
          id_taxi: taxiId
        }).$promise;
      }

      function prekinitev() {
      //  emit parentu, ki broadcasta na rootScope, poslusam v header.client.ctrl.js in zasluzku dodam $500
      }

    }
  });
})();
