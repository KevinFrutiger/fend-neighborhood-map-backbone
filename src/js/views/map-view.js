var app = app || {};

(function() {

  app.MapView = Backbone.View.extend({

    el: '.js-map',

    initialize: function() {

      this.map = null;
      this.placesService = null;
      this.mapBounds = null;

      this.markerIcons = {
        NORMAL: 'images/marker-red.png',
        SELECTED: 'images/marker-yellow.png'
      };

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

      // Add the map to the page.
      this.map = new google.maps.Map($('.js-map')[0], mapOptions);

      this.placesService = new google.maps.places.PlacesService(this.map);

      this.mapBounds = new google.maps.LatLngBounds();

      // Listen for changes on model so we can check filtered.
      this.listenTo(app.places, 'change:filtered', this.render);

      // Create the markers.
      this.render();

    },

    render: function() {
      console.log('map view render');

      var self = this;

      app.places.models.forEach(function(place) {
          if (!place.get('placeId')) {
            // Set up the request object for the Places Service.
            var request = {
              location: self.map.getCenter(),
              radius: '500',
              query: place.get('name')
            };

            // Query the Places API.
            self.placesService.textSearch(request, function(results, status) {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                // Store data in our Places model so we don't have to requery.
                place.set('placeId', results[0].place_id);
                place.set('location', results[0].geometry.location);
                place.set('types', results[0].types);

                // Add a marker to the map.
                self.addMarker(place);
              }
            });

          } else { // We have a marker for this place already.
            var marker = place.get('marker');

            // Show/hide based on whether place is in the filtered list.
            marker.setVisible(place.get('filtered'));

            // Stop any bouncing markers.
            if (marker.getAnimation() !== null) {
              marker.setAnimation(null);
            }
          }
        });
    },

    addMarker: function(place) {

      // Add the marker to the map. Instantiation automatically shows it.
      var marker = new google.maps.Marker({
        map: this.map,
        place: {
          placeId: place.get('placeId'),
          location: place.get('location')
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
      this.mapBounds.extend(place.get('location'));
      this.map.fitBounds(this.mapBounds);
      this.map.setCenter(this.mapBounds.getCenter());

      place.set('marker', marker);
    },

    selectPlace: function(place) {
      console.log('select place');
    }

  });


})();