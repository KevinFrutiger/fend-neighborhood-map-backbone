var app = app || {};

(function() {
  'use strict';

  app.FilterDatalistOptionView = Backbone.View.extend({

    tagName: 'option',

    initialize: function() {
      //
    },

    render: function() {
      console.log(this.$el, this.model.attributes.name);
      this.$el.val(this.model.attributes.name);

      return this;
    }


  });

})();