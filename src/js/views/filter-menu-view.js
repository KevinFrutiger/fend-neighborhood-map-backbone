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
    }

  });

})();