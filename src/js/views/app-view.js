var app = app || {};

(function() {
  'use strict';

  /**
   * View for the app.
   */
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
      //console.log('render appView');
    },

    /**
     * Initializes the Google map.
     */
    initMap: function() {
      this.mapView = new app.MapView();
    },

    /**
     * Shows the filter menu and handles proper ARIA changes.
     */
    showMenu: function() {
      // Show the menu.
      this.filterMenuView.showMenu();

      // Hide app area from assistive tech.
      this.$appArea.attr('aria-hidden', true);

      //console.log('show menu');
    },

    /**
     * Hides the filter menu and changes focus, if required.
     * @param {Boolean} shouldHandBackFocus - Whether app should return focus
     *     to the previously-focused element.
     */
    menuHideHandler: function(shouldHandBackFocus) {
      // Make app area visible to assitive tech.
      this.$appArea.attr('aria-hidden', false);

      // Return focus to previous element, if needed.
      if (shouldHandBackFocus) this.handBackFocus();

      //console.log('hide menu');
    },

    /**
     * Retrieves the places data.
     */
    getData:function() {
      // For purposes of this demo app, hard-coding data.
      // TODO: Load and process this data in the collection.
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

    /**
     * Adds data to the Places collection.
     * @param {Array.<Object>} data - Array of objects to parse into collection.
     */
    buildCollection: function(data) {
      // Sort places by name.
      app.places.comparator = 'name';

      // Parse all models at once.
      app.places.add(data);
    },

    /**
     * Handles changing of focus for the app. All elements in the app
     * should change focus via this method.
     * @param {HTMLElement} newTarget - The element that should receive focus.
     */
    requestFocus: function(newTarget) {
      if (newTarget) {
        this.lastFocusEl = document.activeElement;
        newTarget.focus();
      } else {
        console.warn('Focus was requested but no element was given');
      }
    },

    /**
     * Returns focus to the previously-focused element in the app.
     */
    handBackFocus: function() {
      this.lastFocusEl.focus();
    }

  });

})();