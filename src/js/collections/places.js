var app = app || {};

(function() {
  'use strict';

  var Places = Backbone.Collection.extend({

    model: app.Place

  });

  app.places = new Places();

})();