var app = app || {};

(function() {
  'use strict';

  app.PlaceModel = Backbone.Model.extend({

    defaults: {
      name: '',
      filtered: true
    }

  });

})();