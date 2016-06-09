var app = app || {};

(function() {

  app.FilterMenuView = Backbone.View.extend({
    el: '.js-filter-menu',

    events: {
      'click .js-menu-hide': 'hideMenu',
      'input .js-filter-input': 'filterPlaces'
    },

    initialize: function() {
      this.userOpenedMenu = false;

      this.$closeButton = this.$('.js-menu-hide');
      this.$datalist = this.$('.js-datalist');
      this.$list = this.$('.js-list');

      var self = this;

      $(window).resize(function() {
          // Re-sync proper TAB navigation. Filter may be showing
          // if media query selected different CSS.
          self.$(':input').prop(
              'disabled',
              !(app.widerThanBreakpoint() || self.userOpenedMenu)
            );

        });

      // Update the UI when the collection is done updating
      // since we're sorting the collection.
      this.listenTo(app.places, 'update', this.render);

      this.listenTo(app.eventBus, 'selectionChange', this.selectionChangeHandler);
    },

    render: function() {
      console.log('rendered filter menu');

      var filteredModels = app.places.models.filter(function(place) {
        return place.get('filtered');
      });

      // Deselect any place that may be selected but is no longer in the
      // filtered results.
      app.places.models.forEach(function(place) {
        if (place.get('selected') && filteredModels.indexOf(place) === -1) {
          place.set('selected', false);
          // Notify the rest of the app that item was selected/deslected.
          app.eventBus.trigger('selectionChange', place, false);
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

    showMenu: function() {
      // Show the menu.
      this.$el.toggleClass('filter-menu--visible');
      this.userOpenedMenu = true;

      // Enable all inputs in the menu. They will now be tabbable.
      this.$(':input').prop('disabled', false);

      this.$closeButton.focus();
    },

    hideMenu: function() {
      // Hide the menu.
      this.$el.toggleClass('filter-menu--visible');
      this.userOpenedMenu = false;

      // Disable all inputs in the menu. They will no longer be tabbable.
      this.$(':input').prop('disabled', true);

      // Notify the main app that the menu closed.
      app.eventBus.trigger('menuHide', this);
    },

    filterPlaces: function(event) {

      var inputValue = event.target.value;

      var re = new RegExp(inputValue, 'ig');

      app.places.models.forEach(function(model) {
        model.set('filtered', re.test(model.get('name')));
      });

      this.render();
    },

    selectionChangeHandler: function(place) {
      // Loop through all models except the selected one (we don't want to
      // fire its change event again) and reset the flag.
      app.places.models.forEach(function(currentPlace) {
        if (currentPlace != place) {
          currentPlace.set('selected', false);
        }
      })

      if (this.userOpenedMenu && place.get('selected')) {
        this.hideMenu();
      }
    }

  });

})();