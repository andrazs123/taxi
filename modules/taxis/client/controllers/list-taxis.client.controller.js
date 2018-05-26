(function () {
  'use strict';

  angular
    .module('taxis')
    .controller('TaxisListController', TaxisListController);

  TaxisListController.$inject = ['TaxisService'];

  function TaxisListController(TaxisService) {
    var vm = this;

    // Get all taxis
    vm.taxis = TaxisService.getTaxis();
  }
}());
