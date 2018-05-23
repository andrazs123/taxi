(function () {
  'use strict';

  // Najems controller
  angular
    .module('najems')
    .controller('NajemsController', NajemsController);

  NajemsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'najemResolve'];

  function NajemsController ($scope, $state, $window, Authentication, najem) {
    var vm = this;

    vm.authentication = Authentication;
    vm.najem = najem;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Najem
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.najem.$remove($state.go('najems.list'));
      }
    }

    // Save Najem
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.najemForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.najem._id) {
        vm.najem.$update(successCallback, errorCallback);
      } else {
        vm.najem.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('najems.view', {
          najemId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
