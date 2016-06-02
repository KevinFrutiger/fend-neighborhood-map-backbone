var app = app || {};

(function() {
  'use strict';

  app.FilterItemView = Backbone.View.extend({
    tagName: 'li',

    className: 'filter-menu__item',

    template: _.template($('.js-filter-item').html()),

    events: {
      'click button': 'buttonClickHandler'
    },

    initialize: function() {
      this.listenTo(this.model, 'change:selected', this.toggleSelectState);
    },

    render: function() {
      this.$el.html(this.template(this.model.attributes));

      if (this.model.get('selected')) {
        this.$el.addClass('filter-menu__item--selected');
      } else {
        this.$el.removeClass('filter-menu__item--selected');
      }

      return this;
    },

    buttonClickHandler: function() {
      // Notify the rest of the app (including this view) that item was selected.
      app.eventBus.trigger('placeSelected', this);
    },

    toggleSelectState: function() {
      if (this.model.get('selected')) {
        this.$el.addClass('filter-menu_item--selected');
      } else {
        this.$el.removeClass('filter-menu_item--selected');
      }
    }

  });

})();
