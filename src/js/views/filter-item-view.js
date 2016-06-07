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
      this.$button = null;

      this.listenTo(this.model, 'change:selected', this.toggleSelectState);
    },

    render: function() {
      this.$el.html(this.template(this.model.attributes));
      this.$button = this.$el.find('button');

      this.toggleSelectState();

      return this;
    },

    buttonClickHandler: function(event) {
      // Set the flag.
      this.model.set('selected', !this.model.get('selected'));

      // Notify the rest of the app that item was selected/deslected.
      // Re-center the map.
      app.eventBus.trigger('selectionChange', this.model, true);
    },

    toggleSelectState: function() {
      if (this.model.get('selected')) {
        this.$el.addClass('filter-menu_item--selected');
        console.log(this.$button);
        // aria-pressed is true/false as a string, not a boolean.
        this.$button.attr('aria-pressed', 'true');
      } else {
        console.log(this.$button);
        this.$el.removeClass('filter-menu_item--selected');
        this.$button.attr('aria-pressed', 'false');
      }
    }

  });

})();
