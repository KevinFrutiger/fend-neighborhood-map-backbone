var app = app || {};

(function() {
  'use strict';

  app.FilterItemView = Backbone.View.extend({
    tagName: 'li',

    className: 'filter-menu__item',

    template: _.template($('.js-filter-item').html()),

    initialize: function() {
      //
    },

    render: function() {
      this.$el.html(this.template(this.model.attributes));

      return this;
    }

  });

})();
