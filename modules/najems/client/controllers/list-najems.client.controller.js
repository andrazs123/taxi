(function () {
  'use strict';

  angular
    .module('najems')
    .controller('NajemsListController', NajemsListController);

  NajemsListController.$inject = ['NajemsService'];

  function NajemsListController(NajemsService) {
    var vm = this;

    vm.najems = NajemsService.query();
  }
}());
