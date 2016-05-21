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
      this.$appArea = $('.app-area');
      this.lastFocusEl = null;

      this.listenTo(app.eventBus, 'requestHideMenu', this.hideMenu);


      this.getData();

    },

    render: function() {
      console.log('render appView');
    },

    initMap: function() {
      console.log('initMap');
    },

    showMenu: function() {
      this.lastFocusEl = document.activeElement;
      this.filterMenuView.showMenu();
      this.$appArea.attr('aria-hidden', true);

      console.log('show menu');
    },

    hideMenu: function() {
      this.$appArea.attr('aria-hidden', false);
      this.lastFocusEl.focus();

      console.log('hide menu');
    },

    getData:function() {
      var data = [
        {name: 'Trader Joe\s'},
        {name: 'Starbucks'}
      ]

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