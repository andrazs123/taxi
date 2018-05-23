(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', 'menuService', 'TaxisService', '$location', '$timeout'];

  function HeaderController($scope, $state, Authentication, menuService, TaxisService, $location, $timeout) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    vm.calculateTotalIncome = calculateTotalIncome;
    vm.buyNewTaxi = buyNewTaxi;
    vm.getCurrentTimeToday = getCurrentTimeToday;
    vm.checkTotalIncome = checkTotalIncome;


    function getCurrentTimeToday() {
      const today = new Date();
      const hours = today.getHours();
      const minutes = today.getMinutes();
      const seconds = today.getSeconds();
      return (hours + ':' + checkTime(minutes) + ':' + checkTime(seconds));
      $scope.$applyAsync();   // $scope.$apply vs $scope.applyAsync vs $scope.evalAsync
    }

    function checkTotalIncome() {
      return calculateTotalIncome() > 100;
    }

    function checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    }

    function calculateTotalIncome() {
      // return TaxisService.getZasluzek();
      return 150;
    }

    function buyNewTaxi() {
      return TaxisService.createTaxi().then(function (result) {
        $state.reload();
      })
    }

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }
  }
}());
