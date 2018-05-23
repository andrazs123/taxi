(function () {
  'use strict';

  describe('Taxis List Controller Tests', function () {
    // Initialize global variables
    var TaxisListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      TaxisService,
      mockTaxi;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _TaxisService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      TaxisService = _TaxisService_;

      // create mock article
      mockTaxi = new TaxisService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Taxi Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Taxis List controller.
      TaxisListController = $controller('TaxisListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockTaxiList;

      beforeEach(function () {
        mockTaxiList = [mockTaxi, mockTaxi];
      });

      it('should send a GET request and return all Taxis', inject(function (TaxisService) {
        // Set POST response
        $httpBackend.expectGET('api/taxis').respond(mockTaxiList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.taxis.length).toEqual(2);
        expect($scope.vm.taxis[0]).toEqual(mockTaxi);
        expect($scope.vm.taxis[1]).toEqual(mockTaxi);

      }));
    });
  });
}());
