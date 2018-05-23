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
      const allInfo = {};
      allInfo.ime = najemInfo.ime;
      allInfo.priimek = najemInfo.priimek;
      allInfo.podjetje = najemInfo.podjetje;
      allInfo.trajanje = najemInfo.trajanje;
      allInfo.id_taxi = vm.taxi._id;
      var x = NajemsService.createNajem(allInfo).then(function (result) {
        $state.go('taxis.view');
      });

    }
  }
}());
