// Taxis service used to communicate Taxis REST endpoints
(function () {
  'use strict';

  angular
    .module('taxis')
    .factory('TaxisService', TaxisService);

  TaxisService.$inject = ['$resource', '$log'];

  function TaxisService($resource, $log) {

    // TODO: razlika med let, var, const ES6 !!!
    // TODO: lodash ne rabiš, maš map, filter, reduce, find
    // TODO: arrow funkcije

    function getZasluzek(zasluzek) {
      // if (!zasluzek.prekinitev && trenutenZasluzek > 0){
        const lowT = 5;
        const highT = 7.5;
        if (zasluzek.amount <= 300){
          return zasluzek.amount * lowT;
        } else {
          const ostanek = zasluzek.amount - 300;
          const trenutenZasluzek = (ostanek + lowT) + ((zasluzek.amount-ostanek)* highT);
          return (ostanek + lowT) + ((zasluzek.amount-ostanek)* highT);
        }
      // } else {
      //   vm.trenutenZasluzek -= zasluzek.amount;
      // }

    }

    var znamke = [
      {id: 1, name: 'Volvo'},
      {id: 2, name: 'Skoda'},
      {id: 3, name: 'Audi'},
      {id: 4, name: 'Mercedes'},
      {id: 5, name: 'Fiat'},
      {id: 6, name: 'Ford'},
      {id: 7, name: 'VW'},
      {id: 8, name: 'Lamborghini'},
      {id: 9, name: 'BWM'},
    ];

    /**
     * definiraš resource
     */
    var Taxi = $resource('api/taxis/:carId',
      {carId: '@_id'},
      {
        update: {
          method: 'PUT'
        }
      });

    // return Taxi;

    return {
      getTaxi: getTaxi,
      getTaxis: getTaxis,
      createTaxi: createTaxi,
      getZasluzek: getZasluzek
    };

    function getTaxi(arg) {
      return Taxi.get(arg);
    }

    /**
     * dobi vse taxije
     * @returns {*}
     */
    function getTaxis() {
      return Taxi.query();
    }

    // TODO: f. za dobit vse najeme za določen Taxi (to boš klical na DETAILS)

    /**
     * dodaj komentarje za funkcije
     *
     * @returns {number}
     * @private
     */
    function _calculateSpeed() {
      return Math.floor(Math.random() * (220 - 120 + 1)) + 120;
    }

    function _calculateYear() {
      return Math.floor(Math.random() * (2018 - 1995 + 1) + 1995);
    }

    function _getPassengerCount() {
      return Math.floor(Math.random() * 4) + 1;
    }

    function _getRandomId() {
      return Math.floor(Math.random() * 9) + 1;
    }

    //
    // fruit => fruit.name === 'cherries'
    //   * js isto kot
    // * function(fruit) {
    // *  return fruit.name === 'cherries'
    //     * }

    function _getRandomZnamka() {
      let randomZnamka = znamke.find(randomZnamka => randomZnamka.id === _getRandomId());
      return randomZnamka ? randomZnamka.name : 'no znamka found';
    }

    /**
     * kerira taxi in vrača promise
     */
    function createTaxi() {
      let newTaxi = new Taxi({
        name: _getRandomZnamka(),
        max_hitrost: _calculateSpeed(),
        leto_izdelave: _calculateYear(),
        max_potniki: _getPassengerCount()
      });
      // let newTaxi = new Taxi({name: 'Lamborghini', max_hitrost: _calculateSpeed(), leto_izdelave: _calculateYear(), max_potniki: _getPassengerCount()});

      return newTaxi.$save(onSuccess, onError);

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
  }
}());
