// Taxis service used to communicate Taxis REST endpoints
(function () {
  'use strict';

  angular
    .module('taxis')
    .factory('TaxisService', TaxisService);

  TaxisService.$inject = ['$resource', '$log'];

  function TaxisService($resource, $log) {

    let trenutenZasluzek = 0;

    /**
     * Caculate totalIncome
     * @param zasluzek
     * @returns {number}
     */
    function getZasluzek(zasluzek) {
      if (!zasluzek.prekinitev){
        const lowT = 5;
        const highT = 7.5;
        if (zasluzek.amount <= 300){
          return zasluzek.amount * lowT;
        } else {
          const ostanek = zasluzek.amount - 300;
          trenutenZasluzek = (ostanek + lowT) + ((zasluzek.amount-ostanek)* highT);
          return trenutenZasluzek;
        }
      } else {
         return trenutenZasluzek += 500;
       }

    }

    const znamke = [
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
    var Taxi = $resource('http://localhost:3000/api/taxis/:carId',
      {carId: '@_id'},
      {
        update: {
          method: 'PUT'
        },
        query: {
          method: 'GET',
          isArray: true
        }
      });

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

    /**
     * Izracunaj hitrost med 120 in 220
     *
     * @returns {number}
     * @private
     */
    function _calculateSpeed() {
      return Math.floor(Math.random() * (220 - 120 + 1)) + 120;
    }

    /**
     * Izracunaj leto med 1995 in 2008
     * @returns {number}
     * @private
     */
    function _calculateYear() {
      return Math.floor(Math.random() * (2018 - 1995 + 1) + 1995);
    }

    /**
     * Stevilo potnikov med 1 in 4
     * @returns {number}
     * @private
     */
    function _getPassengerCount() {
      return Math.floor(Math.random() * 4) + 1;
    }

    /**
     * Private funkcija za dolocanje random znamke
     * @returns {number}
     * @private
     */
    function _getRandomId() {
      return Math.floor(Math.random() * 9) + 1;
    }

    function _getRandomNumber() {
      return Math.floor(Math.random() * 8) + 1;
    }

    /**
     * Random znamka
     * @returns {string}
     * @private
     */
    function _getRandomZnamka() {
      let randomZnamka = znamke.find(randomZnamka => randomZnamka.id === _getRandomId());
      return randomZnamka ? randomZnamka.name : 'Skoda';
    }

    function _createTaxiPhoto() {
      return 'modules/core/client/images/avto-0' + _getRandomNumber() + '.png';
    }

    /**
     * kerira taxi in vrača promise
     */
    function createTaxi() {
      let newTaxi = new Taxi({
        name: _getRandomZnamka(),
        max_hitrost: _calculateSpeed(),
        leto_izdelave: _calculateYear(),
        max_potniki: _getPassengerCount(),
        path_slike: _createTaxiPhoto(),
        datum_nastanka: Date.now()
      });

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
