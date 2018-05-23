(function () {
  'use strict';

  angular
    .module('taxis')
    .controller('TaxisListController', TaxisListController);

  TaxisListController.$inject = ['TaxisService'];

  function TaxisListController(TaxisService) {
    var vm = this;

    vm.taxis = TaxisService.getTaxis();
  }
}());
