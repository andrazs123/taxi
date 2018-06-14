(function () {
  'use strict';

  // Taxis controller
  angular
    .module('taxis')
    .controller('TaxisController', TaxisController);

  function TaxisController ($scope, $state, $window, taxiResolve, NajemsService, TaxisService, $rootScope) {
    let vm = this;

    vm.taxi = taxiResolve;
    vm.error = null;

    vm.confirmNewTaxi = confirmNewTaxi;
    vm.najem = getNajems();
    vm.calculateProfit = calculateProfit;

    (function init() {
      watchNajemInput();
    })();

    /**
     * Get all najems
     * @returns {*}
     */
    function getNajems() {
      return NajemsService.getNajems();
    }

    /**
     * Watch najem input to caculate theoretical zasluzek
     */
    function watchNajemInput() {
      $scope.$watch('vm.najem.trajanje', function () {
        vm.zasluzek = calculateProfit(vm.najem.trajanje);
      }, true);
    }

    /**
     * Caculate profit from najem
     * @param trajanje
     * @returns {*}
     */
    function calculateProfit(trajanje) {
      const zasluzek = [];
      zasluzek.amount = trajanje;
      zasluzek.prekinjen = false;
      return TaxisService.getZasluzek(zasluzek);
    }

    /**
     * Create taxi
     * @param najemInfo
     */
    function confirmNewTaxi(najemInfo) {
      const allInfo = {
        ime: najemInfo.ime,
        priimek: najemInfo.priimek,
        podjetje: najemInfo.podjetje,
        trajanje: najemInfo.trajanje,
        id_taxi: vm.taxi._id
      };
      NajemsService.createNajem(allInfo).then(function (result) {
        $state.go('home');
      });
      $rootScope.$emit('najem');
    }
  }
}());
