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

      this.toggleSelectState();

      return this;
    },

    buttonClickHandler: function() {
      // Set the flag.
      this.model.set('selected', !this.model.get('selected'));

      // Notify the rest of the app that item was selected.
      app.eventBus.trigger('placeSelected', this.model);
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
