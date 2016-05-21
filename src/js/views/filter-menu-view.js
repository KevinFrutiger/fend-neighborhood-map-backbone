var app = app || {};

(function() {

  app.FilterMenuView = Backbone.View.extend({
    el: '.js-filter-menu',

    events: {
      'click .js-menu-hide': 'hideMenu'
    },

    initialize: function() {
      console.log('initialized filter menu', this.el);

      this.$closeButton = this.$('.js-menu-hide');
      this.$datalist = this.$('.js-datalist');
      this.$list = this.$('.js-list');

      // Update the UI when collection updates. We're adding
      // items all at once, so we'll get one update when everything
      // is added. We need to wait until everything is added
      // because we're sorting the collection.
      this.listenTo(app.places, 'update', this.addItems);

      this.render();
    },

    render: function() {
      console.log('rendered filter menu');
    },

    showMenu: function() {
      this.$el.toggleClass('filter-menu--visible');

      this.$(':input').prop('disabled', false);

      this.$closeButton.focus();
    },

    hideMenu: function() {
      this.$el.toggleClass('filter-menu--visible');

      this.$(':input').prop('disabled', true);

      app.eventBus.trigger('requestHideMenu', this);
    },

    addItems: function() {
      // Add a view for each model
      _.each(app.places.models, this.addItemView, this);
    },

    addItemView: function(place) {
      // Add DATALIST options
      var optionView = new app.FilterDatalistOptionView({model: place});
      this.$datalist.append(optionView.render().$el);

      // Add UL list items
      var listView = new app.FilterItemView({model: place});
      this.$list.append(listView.render().$el);
    }

  });

})();