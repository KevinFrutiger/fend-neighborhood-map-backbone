var app = app || {};

(function() {
  'use strict';

  app.Place = Backbone.Model.extend({

    defaults: {
      name: '',
      filtered: true
    }

  });

})();