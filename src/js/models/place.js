var app = app || {};

(function() {
  'use strict';

  /**
   * Creates a place model to hold data for a place.
   */
  app.Place = Backbone.Model.extend({

    defaults: {
      name: '',
      filtered: true,
      selected: false
    }

  });

})();