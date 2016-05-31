var app = app || {};

app.ENTER_KEY = 13;
app.BREAKPOINT = 800;

$(function() {
  'use strict';

  app.eventBus = _.extend(Backbone.Events);

  app.widerThanBreakpoint = function() {
    return document.documentElement.clientWidth > app.BREAKPOINT;
  }

  console.log('starting the app');
  app.appView = new app.AppView();

});