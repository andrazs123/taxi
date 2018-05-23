(function () {
  'use strict';

  angular
    .module('najems')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Najems',
      state: 'najems',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'najems', {
      title: 'List Najems',
      state: 'najems.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'najems', {
      title: 'Create Najem',
      state: 'najems.create',
      roles: ['user']
    });
  }
}());
