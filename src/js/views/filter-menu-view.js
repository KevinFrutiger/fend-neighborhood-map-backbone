var app = app || {};

(function() {

  app.FilterMenuView = Backbone.View.extend({
    el: '.js-filter-menu',

    events: {
      'click .js-menu-hide': 'hideMenu',
      'input .js-filter-input': 'filterPlaces'
    },

    initialize: function() {
      console.log('initialized filter menu', this.el);

      this.menuIsOpen = false;

      this.$closeButton = this.$('.js-menu-hide');
      this.$datalist = this.$('.js-datalist');
      this.$list = this.$('.js-list');

      // Update the UI when the collection is done updating
      // since we're sorting the collection.
      this.listenTo(app.places, 'update', this.render);
    },

    render: function() {
      console.log('rendered filter menu');

      var filteredModels = app.places.models.filter(function(place) {
        return place.attributes.filtered;
      });

      var listDocFrag = document.createDocumentFragment();

      // Append filtered places to the document fragment.
      filteredModels.forEach(function(place) {
          var listView = new app.FilterItemView({model: place});
          listDocFrag.appendChild(listView.render().el);
        });

      // Clear out the UL list and add the filtered items.
      this.$list.empty();
      this.$list.append(listDocFrag);

      // Enable the inputs, if the menu is open.
      if (this.menuIsOpen) {
        this.$(':input').prop('disabled', false);
      }
    },

    showMenu: function() {
      // Show the menu.
      this.$el.toggleClass('filter-menu--visible');
      this.menuIsOpen = true;

      // Enable all inputs in the menu. They will now be tabbable.
      this.$(':input').prop('disabled', false);

      this.$closeButton.focus();
    },

    hideMenu: function() {
      // Hide the menu.
      this.$el.toggleClass('filter-menu--visible');
      this.menuIsOpen = false;

      // Disable all inputs in the menu. They will no longer be tabbable.
      this.$(':input').prop('disabled', true);

      // Notify the main app that the menu closed.
      app.eventBus.trigger('menuHide', this);
    },

    filterPlaces: function(event) {

      var inputValue = event.target.value;

      var re = new RegExp(inputValue, 'ig');

      app.places.models.forEach(function(model) {
        model.attributes.filtered = re.test(model.attributes.name);
      });

      this.render();

      console.log('inputing text', event.target.value);
    }

  });

})();