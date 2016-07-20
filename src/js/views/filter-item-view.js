var app = app || {};

(function() {
  'use strict';

  /**
   * Creates a view for a list item in the filter menu.
   */
  app.FilterItemView = Backbone.View.extend({
    tagName: 'li',

    className: 'filter-menu__item',

    template: _.template($('.js-filter-item').html()),

    events: {
      // Event for the main button of list item.
      'click button': 'buttonClickHandler'
    },

    initialize: function() {
      this.$button = null;

      // Listen for changes to the selection that may come from elsewhere
      // (eg a map marker).
      this.listenTo(this.model, 'change:selected', this.toggleSelectState);
    },

    render: function() {
      // Render the template
      this.$el.html(this.template(this.model.attributes));
      this.$button = this.$el.find('button');

      // Toggle the selected state to catch if selected prop has changed.
      this.toggleSelectState();

      return this;
    },

    /**
     * Handles button clicks on the main button for the list item.
     * @param {jQuery.Event} event - Click event
     */
    buttonClickHandler: function(event) {
      // Set the flag.
      this.model.set('selected', !this.model.get('selected'));

      // Notify the rest of the app (and this view) that this item
      // was selected/deslected.
      app.eventBus.trigger('selectionChange', this.model, true);
    },

    /**
     * Toggles the visual and ARIA feedback on whether this list item is
     * selected.
     */
    toggleSelectState: function() {
      if (this.model.get('selected')) {
        this.$el.addClass('filter-menu_item--selected');
        // Note: aria-pressed is true/false as a string, not a boolean.
        this.$button.attr('aria-pressed', 'true');
      } else {
        this.$el.removeClass('filter-menu_item--selected');
        this.$button.attr('aria-pressed', 'false');
      }
    }

  });

})();
