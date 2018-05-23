(function () {
  'use strict';

  describe('Taxis Route Tests', function () {
    // Initialize global variables
    var $scope,
      TaxisService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TaxisService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TaxisService = _TaxisService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('taxis');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/taxis');
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
          TaxisController,
          mockTaxi;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('taxis.view');
          $templateCache.put('modules/taxis/client/views/view-taxi.client.view.html', '');

          // create mock Taxi
          mockTaxi = new TaxisService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Taxi Name'
          });

          // Initialize Controller
          TaxisController = $controller('TaxisController as vm', {
            $scope: $scope,
            taxiResolve: mockTaxi
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:carId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.taxiResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            carId: 1
          })).toEqual('/taxis/1');
        }));

        it('should attach an Taxi to the controller scope', function () {
          expect($scope.vm.taxi._id).toBe(mockTaxi._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/taxis/client/views/view-taxi.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TaxisController,
          mockTaxi;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('taxis.create');
          $templateCache.put('modules/taxis/client/views/form-taxi.client.view.html', '');

          // create mock Taxi
          mockTaxi = new TaxisService();

          // Initialize Controller
          TaxisController = $controller('TaxisController as vm', {
            $scope: $scope,
            taxiResolve: mockTaxi
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.taxiResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/taxis/create');
        }));

        it('should attach an Taxi to the controller scope', function () {
          expect($scope.vm.taxi._id).toBe(mockTaxi._id);
          expect($scope.vm.taxi._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/taxis/client/views/form-taxi.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TaxisController,
          mockTaxi;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('taxis.edit');
          $templateCache.put('modules/taxis/client/views/form-taxi.client.view.html', '');

          // create mock Taxi
          mockTaxi = new TaxisService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Taxi Name'
          });

          // Initialize Controller
          TaxisController = $controller('TaxisController as vm', {
            $scope: $scope,
            taxiResolve: mockTaxi
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:carId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.taxiResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            carId: 1
          })).toEqual('/taxis/1/edit');
        }));

        it('should attach an Taxi to the controller scope', function () {
          expect($scope.vm.taxi._id).toBe(mockTaxi._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/taxis/client/views/form-taxi.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
