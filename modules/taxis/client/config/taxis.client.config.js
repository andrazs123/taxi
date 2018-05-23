(function () {
  'use strict';

  angular
    .module('taxis')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Taxis',
      state: 'taxis',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'taxis', {
      title: 'List Taxis',
      state: 'taxis.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'taxis', {
      title: 'Create Taxi',
      state: 'taxis.create',
      roles: ['user']
    });
  }
}());
