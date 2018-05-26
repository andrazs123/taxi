// Najems service used to communicate Najems REST endpoints
(function () {
  'use strict';

  angular
    .module('najems')
    .factory('NajemsService', NajemsService);

  NajemsService.$inject = ['$resource', '$log'];

  function NajemsService($resource, $log) {

    /**
     * definiraš resource
     */

      // TODO: tole pot preberi iz factory
    var Najem = $resource('http://localhost:3000/api/najems/:najemId',         //
      //{najemId: '@_id'},
      {najemId: '@id_taxi'},
      {
        update: {
          method: 'PUT'
        },
        query: {
          method: 'GET',
          isArray: true
        },
        save: {
          method: 'POST',
          isArray: true
        }
      });

    return {
      getNajem: getNajem,
      getNajems: getNajems,
      createNajem: createNajem,
      getNajemById: getNajemById
    };

    function getNajemById(taxiId) {
      // console.log('getNajemById', taxiId);
      return Najem.query({}, {
        id_taxi: taxiId
      });
    }

    function getNajem(arg) {
      return Najem.get(arg);
    }

    function getNajems() {
      return Najem.query();
    }

    function createNajem(najemInfo) {
      let newNajem = new Najem({
        ime: najemInfo.ime,
        priimek: najemInfo.priimek,
        podjetje: najemInfo.podjetje,
        datum: Date.now(),
        trajanje: najemInfo.trajanje,
        id_taxi: najemInfo.id_taxi,
        prekinjen: false
      });

      return newNajem.$save(onSuccess, onError);

      // Handle successful response
      function onSuccess(article) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        let error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    /**
     * private funkcija, ko se samo notr uporablja: na tak način narediš tiste randomizacije
     * @param error
     */
    function handleError(error) {
      // Log error
      $log.error(error);
    }

    // return $resource('api/najems/:najemId', {
    //   najemId: '@_id'
    // }, {
    //   update: {
    //     method: 'PUT'
    //   }
    // });
  }
}());
