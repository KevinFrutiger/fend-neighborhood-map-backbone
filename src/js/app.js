var app = app || {};

// The keyCode for the Enter key
app.ENTER_KEY = 13;
// The keyCode for the Tab key
app.TAB_KEY = 9;
// The breakpoint for small screens (px)
app.BREAKPOINT = 800;

$(function() {
  'use strict';

  app.eventBus = _.extend(Backbone.Events);

  /**
   * Returns whether the app layout is wider than breakpoint for small screens.
   */
  app.widerThanBreakpoint = function() {
    return document.documentElement.clientWidth > app.BREAKPOINT;
  };

  // Start the app.
  //console.log('starting the app');
  app.appView = new app.AppView();

});