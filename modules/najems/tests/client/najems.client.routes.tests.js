(function () {
  'use strict';

  describe('Najems Route Tests', function () {
    // Initialize global variables
    var $scope,
      NajemsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _NajemsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      NajemsService = _NajemsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('najems');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/najems');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          NajemsController,
          mockNajem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('najems.view');
          $templateCache.put('modules/najems/client/views/view-najem.client.view.html', '');

          // create mock Najem
          mockNajem = new NajemsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Najem Name'
          });

          // Initialize Controller
          NajemsController = $controller('NajemsController as vm', {
            $scope: $scope,
            najemResolve: mockNajem
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:najemId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.najemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            najemId: 1
          })).toEqual('/najems/1');
        }));

        it('should attach an Najem to the controller scope', function () {
          expect($scope.vm.najem._id).toBe(mockNajem._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/najems/client/views/view-najem.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          NajemsController,
          mockNajem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('najems.create');
          $templateCache.put('modules/najems/client/views/form-najem.client.view.html', '');

          // create mock Najem
          mockNajem = new NajemsService();

          // Initialize Controller
          NajemsController = $controller('NajemsController as vm', {
            $scope: $scope,
            najemResolve: mockNajem
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.najemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/najems/create');
        }));

        it('should attach an Najem to the controller scope', function () {
          expect($scope.vm.najem._id).toBe(mockNajem._id);
          expect($scope.vm.najem._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/najems/client/views/form-najem.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          NajemsController,
          mockNajem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('najems.edit');
          $templateCache.put('modules/najems/client/views/form-najem.client.view.html', '');

          // create mock Najem
          mockNajem = new NajemsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Najem Name'
          });

          // Initialize Controller
          NajemsController = $controller('NajemsController as vm', {
            $scope: $scope,
            najemResolve: mockNajem
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:najemId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.najemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            najemId: 1
          })).toEqual('/najems/1/edit');
        }));

        it('should attach an Najem to the controller scope', function () {
          expect($scope.vm.najem._id).toBe(mockNajem._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/najems/client/views/form-najem.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
