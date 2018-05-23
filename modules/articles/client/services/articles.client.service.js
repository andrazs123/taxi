(function () {
  'use strict';

  angular
    .module('articles.services')
    .factory('ArticlesService', ArticlesService);

  ArticlesService.$inject = ['$resource', '$log'];

  function ArticlesService($resource, $log) {
    var Article = $resource('/api/articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Article.prototype, {
      createOrUpdate: function () {
        var article = this;     // vstop podatkov
        return createOrUpdate(article);
      }
    });

    return Article;

    /**
     * public funkcija, vidna na zunaj: taka bo tudi Taxi.najem
     * @param article
     * @returns {*}
     */
    function createOrUpdate(article) {
      if (article._id) {
        return article.$update(onSuccess, onError);
      } else {
        return article.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(article) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
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
