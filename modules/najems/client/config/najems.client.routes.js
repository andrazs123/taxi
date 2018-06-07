(function () {
  'use strict';

  angular
    .module('najems')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('najems', {
        abstract: true,
        url: '/najems',
        template: '<ui-view/>'
      })
      .state('najems.list', {
        url: '',
        templateUrl: 'modules/najems/client/views/list-najems.client.view.html',
        controller: 'NajemsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Najems List'
        }
      })
      // .state('najems.create', {
      //   url: '/create',
      //   templateUrl: 'modules/najems/client/views/form-najem.client.view.html',
      //   controller: 'NajemsController',
      //   controllerAs: 'vm',
      //   resolve: {
      //     najemResolve: newNajem
      //   },
      //   data: {
      //     roles: ['user', 'admin'],
      //     pageTitle: 'Najems Create'
      //   }
      // })
      .state('najems.edit', {
        url: '/:najemId/edit',
        templateUrl: 'modules/najems/client/views/form-najem.client.view.html',
        controller: 'NajemsController',
        controllerAs: 'vm',
        resolve: {
          najemResolve: getNajem
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Najem {{ najemResolve.name }}'
        }
      })
      .state('najems.view', {
        url: '/:najemId',
        templateUrl: 'modules/najems/client/views/view-najem.client.view.html',
        controller: 'NajemsController',
        controllerAs: 'vm',
        resolve: {
          najemResolve: getNajem
        },
        data: {
          pageTitle: 'Najem {{ najemResolve.name }}'
        }
      });
  }

  getNajem.$inject = ['$stateParams', 'NajemsService'];

  function getNajem($stateParams, NajemsService) {
    return NajemsService.get({
      najemId: $stateParams.najemId
    }).$promise;
  }

  // newNajem.$inject = ['NajemsService'];
  //
  // function newNajem(NajemsService) {
  //   return new NajemsService();
  // }
}());
