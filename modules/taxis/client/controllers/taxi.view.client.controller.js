(function () {
  'use strict';

  // Taxis controller
  angular
    .module('taxis')
    .controller('TaxisViewController', TaxisViewController);

  // TaxisController.$inject = ['$scope', '$state', '$window', 'Authentication', 'taxiResolve'];

  function TaxisViewController ($scope, $state, $window, Authentication, taxiResolve, NajemsService, TaxisService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.taxi = taxiResolve;
    vm.error = null;
    vm.zasluzek = 0;

    // vm.najems = getNajems();
    vm.calculateProfit = calculateProfit;
    vm.getZasluzek = getZasluzek;

    vm.najemInfo = getNajem(vm.taxi._id).then(function (result) {
      if (result){
        vm.najems = result;
        getTotalIncome();
      }
    });

    function getTotalIncome() {
      vm.najems.forEach(function (element) {
        vm.zasluzek += getZasluzek(element.trajanje)
      });
    }



    function getNajem(taxiId) {
      return NajemsService.getNajemById(taxiId).$promise;
    }

    function getZasluzek(zasluzek) {
      const allInfo = {};
      allInfo.amount = zasluzek;
      allInfo.prekinjen = false;
      return TaxisService.getZasluzek(allInfo);
    }

    function getNajems() {
      return NajemsService.getNajems();
    }

    function calculateProfit(trajanje) {
      const zasluzek = [];
      zasluzek.amount = trajanje;
      zasluzek.prekinitev = false;
      return TaxisService.getZasluzek(zasluzek);
    }

  }
}());
