(function () {
    'use strict';

    angular
      .module('core')
      .controller('HeaderController', HeaderController);

    function HeaderController($scope, $state, Authentication, menuService, TaxisService, NajemsService, $rootScope) {
      var vm = this;

      vm.accountMenu = menuService.getMenu('account').items[0];
      vm.authentication = Authentication;
      vm.isCollapsed = false;
      vm.menu = menuService.getMenu('topbar');
      vm.totalIncome = 0;

      $scope.$on('$stateChangeSuccess', stateChangeSuccess);

      vm.buyNewTaxi = buyNewTaxi;
      vm.getCurrentTimeToday = getCurrentTimeToday;
      vm.checkTotalIncome = checkTotalIncome;

      (function init() {
        calculateTotalIncome();
        listenForPrekinitev();
      })();

      function listenForPrekinitev() {
        $rootScope.$on('prekinitev', function () {
          vm.totalIncome += 500;
        });

      }

      function getCurrentTimeToday() {
        const today = new Date();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
        return (hours + ':' + checkTime(minutes) + ':' + checkTime(seconds));
        $scope.$applyAsync();   // $scope.$apply vs $scope.applyAsync vs $scope.evalAsync
      }

      function checkTotalIncome() {
        return vm.totalIncome > 100;
      }

      function checkTime(i) {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
      }

      function calculateTotalIncome() {
        NajemsService.getNajems().$promise.then(function(success) {
          success.forEach(function (success) {
            if (success.prekinjen){
              const prekinjen = {
                prekinjen: true,
                amount: success.trajanje
              };
              vm.totalIncome +=TaxisService.getZasluzek(prekinjen);
            } else {
              const neprekinjen = {
                prekinjen: false,
                amount: success.trajanje
              };
              vm.totalIncome +=  TaxisService.getZasluzek(neprekinjen);
            }
          });
          return vm.totalIncome;
        });
      }

      function buyNewTaxi() {
        return TaxisService.createTaxi().then(function (result) {
          vm.totalIncome -= 100;
          $state.reload();
        })
      }

      function stateChangeSuccess() {
        // Collapsing the menu after navigation
        vm.isCollapsed = false;
      }
    }
}());
