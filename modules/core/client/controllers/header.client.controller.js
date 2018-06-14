(function () {
    'use strict';

    angular
      .module('core')
      .controller('HeaderController', HeaderController);

    function HeaderController($scope, $state, menuService, TaxisService, NajemsService, $rootScope) {
      let vm = this;

      vm.accountMenu = menuService.getMenu('account').items[0];
      vm.isCollapsed = false;
      vm.menu = menuService.getMenu('topbar');

      let getNajemWatcher = null;
      let getPrekinitevWatcher = null;
      let getTaxisWatcher = null;

      // Tukaj se nastavi začetni znesek
      vm.zacetniZnesek = 123;

      $scope.$on('$stateChangeSuccess', stateChangeSuccess);

      vm.buyNewTaxi = buyNewTaxi;
      vm.getCurrentTimeToday = getCurrentTimeToday;
      vm.checkTotalIncome = checkTotalIncome;

      (function init() {
        calculateTotalIncome();
        listenForPrekinitev();
        listenForNajem();
        listenForUpdates();
        onDestroy();
      })();

      /**
       * Listen for updates from database and recaculate totalIncome
       */
      function listenForUpdates() {
        getTaxisWatcher = $rootScope.$on('getTaxis', function () {
          calculateTotalIncome();
        });
      }

      /**
       * Poslusa ko uporabnik prekine najem da se ponovno izracuna totalIncome
       */
      function listenForPrekinitev() {
        getPrekinitevWatcher =  $rootScope.$on('prekinitev', function () {
          //vm.totalIncome += 500;
          calculateTotalIncome();
        });
      }

      /**
       * Poslusa kdaj se naredi najem da se ponovno zracuna totalIncome
       */
      function listenForNajem() {
        getNajemWatcher = $rootScope.$on('najem', function () {
          calculateTotalIncome();
          });
      }

      /**
       * cleanup na destroy direktive
       */
      function onDestroy() {
        $scope.$on('$destroy', function () {
          console.log('taxiCardDetails.onDestroy');
          getNajemWatcher();
          getPrekinitevWatcher();
          getTaxisWatcher();
        });
      }

      /**
       * Za izpis trenutnega casa
       * @returns {string}
       */
      function getCurrentTimeToday() {
        const today = new Date();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
        return (hours + ':' + checkTime(minutes) + ':' + checkTime(seconds));
        $scope.$applyAsync();   // da se refresha
      }

      /**
       * Enable/disable buy new taxi gumb
       * @returns {boolean}
       */
      function checkTotalIncome() {
        return vm.totalIncome > 100;
      }

      /**
       * Doda nule ce je stevilo manjse od 10
       * @param i
       * @returns {*}
       */
      function checkTime(i) {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
      }

      /**
       * Sprehodi se cez najems tabelo in izracuna dobicek
       */
      function calculateTotalIncome() {
        vm.totalIncome = 0;
        NajemsService.getNajems().$promise.then(function(success) {
          success.forEach(function (success) {
            if (success.prekinjen){
              const prekinjen = {
                prekinjen: true,
                amount: success.trajanje
              };
              vm.totalIncome += TaxisService.getZasluzek(prekinjen);
            } else {
              const neprekinjen = {
                prekinjen: false,
                amount: success.trajanje
              };
              vm.totalIncome += TaxisService.getZasluzek(neprekinjen);
            }
          });
          if(vm.totalIncome === 0){
            vm.totalIncome += vm.zacetniZnesek;
          }
          // return vm.totalIncome;
        });
      }

      /**
       * Kreira nov taxi z random lasnosti, vzame 100$ iz totalIncoma in reloada state, nov taxi se zapise v bazo
       * @returns {*}
       */
      function buyNewTaxi() {
        return TaxisService.createTaxi().then(function (result) {
          vm.totalIncome -= 100;
          $state.go($state.current, {}, {reload: true});
        })
      }

      function stateChangeSuccess() {
        // Collapsing the menu after navigation
        vm.isCollapsed = false;
      }
    }
}());
