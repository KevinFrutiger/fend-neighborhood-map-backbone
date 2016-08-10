var app = app || {};

(function() {
  'use strict';

  /**
   * Creates a collection of Places.
   */
  var Places = Backbone.Collection.extend({

    model: app.Place,

    comparator: 'name'

  });

  app.places = new Places();

})();