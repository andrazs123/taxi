(function () {
  'use strict';

  angular
    .module('taxis')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('taxis', {
        abstract: true,
        url: '/taxis',
        // url: '/:carId', TODO isci taxis.edit kako je narejen link
        template: '<ui-view/>'
      })
      .state('taxis.list', {
        url: '',
        templateUrl: 'modules/taxis/client/views/list-taxis.client.view.html',
        controller: 'TaxisListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Taxis List'
        }
      })
      .state('taxis.edit', {
        url: '/:carId/najem',
        templateUrl: 'modules/taxis/client/views/form-taxi.client.view.html',
        controller: 'TaxisController',
        controllerAs: 'vm',
        resolve: {
          taxiResolve: getTaxi
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Taxi {{ taxiResolve.name }}'
        }
      })
      .state('taxis.view', {
        url: '/:carId',
        templateUrl: 'modules/taxis/client/views/view-taxi.client.view.html',
        controller: 'TaxisController',
        controllerAs: 'vm',
        resolve: {
          taxiResolve: getTaxi
        },
        data: {
          pageTitle: 'Taxi '
        }
      });
  }

  getTaxi.$inject = ['$stateParams', 'TaxisService'];

  function getTaxi($stateParams, TaxisService) {
    return TaxisService.getTaxi({
      carId: $stateParams.carId
    }).$promise;
  }

  // newTaxi.$inject = ['TaxisService'];
  //
  // function newTaxi(TaxisService) {
  //   return new TaxisService();
  // }
}());
