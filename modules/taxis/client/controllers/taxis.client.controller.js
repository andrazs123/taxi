(function () {
  'use strict';

  // Taxis controller
  angular
    .module('taxis')
    .controller('TaxisController', TaxisController);

  // TaxisController.$inject = ['$scope', '$state', '$window', 'Authentication', 'taxiResolve'];

  function TaxisController ($scope, $state, $window, Authentication, taxiResolve, NajemsService, TaxisService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.taxi = taxiResolve;
    vm.error = null;
    vm.form = {};

    vm.confirmNewTaxi = confirmNewTaxi;
    vm.najem = getNajems();
    vm.calculateProfit = calculateProfit;

    (function init() {
      watchNajemInput();
    })();

    function getNajems() {
      return NajemsService.getNajems();
    }

    function watchNajemInput() {
      $scope.$watch('vm.najem.trajanje', function () {
        vm.zasluzek = calculateProfit(vm.najem.trajanje);
      }, true);
    }

    function calculateProfit(trajanje) {
      const zasluzek = [];
      zasluzek.amount = trajanje;
      zasluzek.prekinitev = false;
      return TaxisService.getZasluzek(zasluzek);
    }

    function confirmNewTaxi(najemInfo) {
      const allInfo = {
        // TODO: daj rajši kot objekt
        ime: najemInfo.ime,
        priimek: najemInfo.priimek,
        podjetje: najemInfo.podjetje,
        trajanje: najemInfo.trajanje,
        id_taxi: vm.taxi._id
      };
      NajemsService.createNajem(allInfo);
      $state.go('home');
    }
  }
}());
