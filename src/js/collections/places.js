var app = app || {};

(function() {
  'use strict';

  var PlacesCollection = Backbone.Collection.extend({

    model: app.PlaceModel

  });

  app.placesCollection = new PlacesCollection();

})();