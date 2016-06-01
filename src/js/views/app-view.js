var app = app || {};

(function() {
  'use strict';

  app.AppView = Backbone.View.extend({
    el: '.js-app',

    events: {
      'click .js-menu-show': 'showMenu'
    },

    initialize: function() {
      console.log('appView initialized');

      this.filterMenuView = new app.FilterMenuView();
      this.mapView = new app.MapView();
      this.$appArea = $('.app-area');
      this.lastFocusEl = null;


      this.listenTo(app.eventBus, 'menuHide', this.menuHideHandler);

      this.getData();

    },

    render: function() {
      console.log('render appView');
    },

    showMenu: function() {
      this.lastFocusEl = document.activeElement;
      this.filterMenuView.showMenu();
      this.$appArea.attr('aria-hidden', true);

      console.log('show menu');
    },

    menuHideHandler: function() {
      this.$appArea.attr('aria-hidden', false);
      this.lastFocusEl.focus();

      console.log('hide menu');
    },

    getData:function() {
      var data = [
        {name: 'Trader Joe\'s'},
        {name: 'Starbucks'},
        {name: 'South San Francisco BART Station'},
        {name: 'See\'s Candies'},
        {name: 'Best Buy'},
        {name: 'Paris Baguette'},
        {name: 'Lidia\'s Deli'},
        {name: 'San Bruno Mountain State Park'}
      ];

      this.buildCollection(data);
    },

    buildCollection: function(data) {
      // Sort places by name.
      app.places.comparator = 'name';

      // Parse all models at once.
      app.places.add(data);
    }

  });

})();