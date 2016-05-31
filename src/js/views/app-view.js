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

      this.markerIcons = {
        NORMAL: 'images/marker-red.png',
        SELECTED: 'images/marker-yellow.png'
      }

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
    },

    initMap: function() {
      // Note: After markers added, map bounds are reset which changes the zoom.
      // Since zoom is required here, setting to a wider view to give sense of
      // overall location before map redraws. And it makes it look intentional
      // versus a glitch if the zoom is close to the final zoom.
      //
      var mapOptions = {
        center: {lat: 37.6640317, lng: -122.445706},
        zoom: 11,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER
        },
        mapTypeControl: true,
        mapTypeControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        },
        streetViewControl: false
      };

      this.map = new google.maps.Map($('#map')[0], mapOptions);

      this.placesService = new google.maps.places.PlacesService(this.map);

      this.mapBounds = new google.maps.LatLngBounds();

      this.refreshMarkers();
    },

    refreshMarkers: function() {
      var self = this;

      var filteredModels = app.places.models.filter(function(place) {
        return place.attributes.filtered;
      });

      filteredModels.forEach(function(place) {
          if (!place.placeId) {
            // Set up the request object for the Places Service.
            var request = {
              location: self.map.getCenter(),
              radius: '500',
              query: place.attributes.name
            };

            // Query the Places API.
            self.placesService.textSearch(request, function(results, status) {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                // Store data in our Places model so we don't have to requery.
                place.placeId = results[0].place_id;
                place.position = results[0].geometry.location;
                place.types = results[0].types;

                // Add a marker to the map.
                self.addMarker(place);
              }
            });

          }
        });
    },

    addMarker: function(place) {
      // Add the marker to the map.
      var marker = new google.maps.Marker({
        map: this.map,
        place: {
          placeId: place.placeId,
          location: place.position
        },
        animation: google.maps.Animation.DROP,
        icon: this.markerIcons.NORMAL
      });

      var self = this;

      // Listen for clicks on the marker.
      marker.addListener('click', function() {
        self.selectPlace(place);
      });

      // Add the marker's LatLng to the extents of the map and re-center.
      this.mapBounds.extend(place.position);
      this.map.fitBounds(this.mapBounds);
      this.map.setCenter(this.mapBounds.getCenter());

      place.marker = marker;
    },

    selectPlace: function(place) {
      console.log('select place');
    }

  });

})();