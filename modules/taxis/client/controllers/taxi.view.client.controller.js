(function () {
  'use strict';

  // Taxis controller
  angular
    .module('taxis')
    .controller('TaxisViewController', TaxisViewController);

  function TaxisViewController ($scope, $state, $window, taxiResolve, NajemsService, TaxisService) {
    var vm = this;

    vm.taxi = taxiResolve;
    vm.error = null;
    vm.zasluzek = 0;

    vm.calculateProfit = calculateProfit;
    vm.getZasluzek = getZasluzek;

    // Get najem info by taxi id
    vm.najemInfo = getNajem(vm.taxi._id).then(function (result) {
      if (result){
        vm.najems = result;
        getTotalIncome();
      }
    });

    /**
     * Get total income from all najems
     */
    function getTotalIncome() {
      vm.najems.forEach(function (element) {
        vm.zasluzek += getZasluzek(element.trajanje)
      });
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
     * Get zasluzek za posamezen najem
     * @param zasluzek
     * @returns {*}
     */
    function getZasluzek(zasluzek) {
      const allInfo = {};
      allInfo.amount = zasluzek;
      allInfo.prekinjen = false;
      return TaxisService.getZasluzek(allInfo);
    }

    /**
     *
     * @param trajanje
     * @returns {*}
     */
    function calculateProfit(trajanje) {
      const zasluzek = [];
      zasluzek.amount = trajanje;
      zasluzek.prekinitev = false;
      return TaxisService.getZasluzek(zasluzek);
    }

  }
}());
