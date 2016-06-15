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
      this.mapView = null;
      this.$appArea = $('.app-area');
      this.lastFocusEl = null;


      this.listenTo(app.eventBus, 'menuHide', this.menuHideHandler);

      this.getData();

    },

    render: function() {
      console.log('render appView');
    },

    initMap: function() {
      this.mapView = new app.MapView();
    },

    showMenu: function() {
      this.filterMenuView.showMenu();
      this.$appArea.attr('aria-hidden', true);

      console.log('show menu');
    },

    menuHideHandler: function(handBackFocus) {
      this.$appArea.attr('aria-hidden', false);
      if (handBackFocus) this.handBackFocus();

      console.log('hide menu');
    },

    getData:function() {
      var data = [
        {name: 'Trader Joe’s'},
        {name: 'Starbucks'},
        {name: 'South San Francisco BART Station'},
        {name: 'See’s Candies'},
        {name: 'Best Buy'},
        {name: 'Paris Baguette'},
        {name: 'Lidia’s Deli'},
        {name: 'San Bruno Mountain State Park'}
      ];

      this.buildCollection(data);
    },

    buildCollection: function(data) {
      // Sort places by name.
      app.places.comparator = 'name';

      // Parse all models at once.
      app.places.add(data);
    },

    requestFocus: function(newTarget) {
      if (newTarget) {
        this.lastFocusEl = document.activeElement;
        newTarget.focus();
      } else {
        console.warn('Focus was requested but no element was given');
      }
    },

    handBackFocus: function() {
      this.lastFocusEl.focus();
    }

  });

})();