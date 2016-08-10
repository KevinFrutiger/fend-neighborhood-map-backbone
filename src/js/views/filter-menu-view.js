var app = app || {};

(function() {

  /**
   * Creates a view for the entire filter menu.
   */
  app.FilterMenuView = Backbone.View.extend({
    el: '.js-filter-menu',

    events: {
      'click .js-menu-hide': 'closeButtonClickHandler',
      'input .js-filter-input': 'filterPlaces',
      'keydown .js-filter-input': 'filterInputKeydownHandler'
    },

    initialize: function() {
      // Whether the user opened the menu.
      this.userOpenedMenu = false;
      // Whether Tab key is in Keydown when Input event fires.
      this.inputIsTabKey = false;

      this.$closeButton = this.$('.js-menu-hide');
      this.$list = this.$('.js-list');

      // Clear out the filter input field if there's already a value there.
      // Firefox retains input values when refreshed.
      var input = $('.js-filter-input');
      if (input.val()) input.val('');

      var self = this;

      $(window).resize(function() {
          // Re-sync proper TAB navigation by enabling/disabling this element.
          // The filter menu may be visible if browser selected different CSS
          // per the media query.
          self.$(':input').prop(
              'disabled',
              !(app.widerThanBreakpoint() || self.userOpenedMenu)
            );

        });

      // Listen for any changes to which item is selected
      // (via map marker, this menu, etc)
      this.listenTo(app.eventBus,
                    'selectionChange',
                    this.selectionChangeHandler);

      this.render();
    },

    render: function() {
      //console.log('rendered filter menu');

      // Get the filtered models only.
      var filteredModels = app.places.models.filter(function(place) {
        return place.get('filtered');
      });

      // Deselect any place that may be selected but is no longer in the
      // filtered results.
      app.places.models.forEach(function(place) {
        if (place.get('selected') && filteredModels.indexOf(place) === -1) {
          place.set('selected', false);
          // Notify the rest of the app that item was selected/deslected.
          var reCenter = false;
          app.eventBus.trigger('selectionChange', place, reCenter);
        }
      });

      var listDocFrag = document.createDocumentFragment();

      // Append filtered places to the document fragment.
      filteredModels.forEach(function(place) {
          var listView = new app.FilterItemView({model: place});
          var listViewEl = listView.render().$el[0];

          listDocFrag.appendChild(listViewEl);
        });

      this.$list.empty();
      this.$list.append(listDocFrag);

      this.$(':input').prop(
          'disabled',
          !(app.widerThanBreakpoint() || this.userOpenedMenu)
        );
    },

    /**
     * Shows this menu and requests focus from the app.
     */
    showMenu: function() {
      // Show the menu.
      this.$el.toggleClass('filter-menu--visible');
      this.userOpenedMenu = true;

      // Enable all inputs in the menu. They will now be tabbable.
      this.$(':input').prop('disabled', false);

      app.appView.requestFocus(this.$closeButton);
    },

    /**
     * Hides the menu and notifies the app.
     * @param {boolean} shouldHandBackFocus - Whether the app should return
     *     focus elsewhere.
     */
    hideMenu: function(shouldHandBackFocus) {
      // Hide the menu.
      this.$el.toggleClass('filter-menu--visible');
      // Reset flag.
      this.userOpenedMenu = false;

      // Disable all inputs in the menu. They will no longer be tabbable.
      this.$(':input').prop('disabled', true);

      // Notify the main app that the menu closed.
      app.eventBus.trigger('menuHide', shouldHandBackFocus);

    },

    /**
     * Flags which models should be in filtered list.
     * @param {jQuery.Event} event - Input event for the filter input field.
     */
    filterPlaces: function(event) {
      //console.log('filterPlaces fired', event);

      // Bail early if the input was the Tab key.
      // IE fires input event for Tab key before tabbing to the
      // next control. Need to prevent this so menu doesn't re-render and
      // re-focus input, which prevents user from tabbing anywhere else.
      if (this.inputIsTabKey) {
        this.inputIsTabKey = false;
        return;
      }

      var inputValue = event.target.value;
      var re = new RegExp(inputValue, 'ig');

      // Filter places to those whose names contain the input string.
      app.places.models.forEach(function(model) {
        model.set('filtered', re.test(model.get('name')));
      });

      // Refresh the menu to display the modified list.
      this.render();
    },

    /**
     * Updates which model is selected.
     * @param {Place} place - The model that's been selected/deselected.
     */
    selectionChangeHandler: function(place) {
      // Loop through all models except the selected one and reset the flag.
      app.places.models.forEach(function(currentPlace) {
        if (currentPlace != place) {
          currentPlace.set('selected', false);
        }
      });

      // Hide the menu if it's open (implies user is on mobile layout) and a
      // place was selected (not deselected).
      if (this.userOpenedMenu && place.get('selected')) {
        var handBackFocus = false;
        this.hideMenu(handBackFocus);
      }
    },

    /**
     * Handles clicks on the close button.
     * @param {jQuery.Event} event - Click event.
     */
    closeButtonClickHandler: function(event) {
      var handBackFocus = true;
      this.hideMenu(handBackFocus);
    },

    /**
     * Handles key down on the filter input field, to determine which key
     * was pressed.
     * @param {jQuery.Event} event - Keydown event.
     */
    filterInputKeydownHandler: function(event) {
      this.inputIsTabKey = (event.code === "Tab" || // Firefox
                            event.key === "Tab" || // Chrome, Edge, IE11
                            event.keyCode === app.TAB_KEY); // Safari 8, 9
    }

  });

})();