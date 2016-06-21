var app = app || {};

(function() {

  app.MapView = Backbone.View.extend({

    el: '.js-map',

    markerIcons: {
      NORMAL: 'images/marker-red.png',
      SELECTED: 'images/marker-yellow.png'
    },

    markerAnimationTimeoutDuration: 3000,

    initialize: function() {

      this.infoWindow = null;
      this.markerAnimationTimeout = null;
      this.$jqXHR = null;

      // After markers are added, map bounds are reset which changes
      // the zoom. Since we are required to designate a zoom here,
      // we're setting to a wider zoom before map redraws to give sense
      // of overall location and so the change in zoom doesn't look
      // like a glitch.
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
      this.mapBounds = new google.maps.LatLngBounds();

      this.placesService = new google.maps.places.PlacesService(this.map);

      // Backbone events
      this.listenTo(app.places, 'change:filtered', this.render);
      this.listenTo(app.eventBus, 'selectionChange', this.selectionChangeHandler);

      // Other DOM events
      $(window).resize({view: this},
                       this.windowResizeHandler);

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

      // Remove the info window, if open
      if (this.infoWindow) {
        this.removeInfoWindow();
      }
    },

    selectionChangeHandler: function(place, shouldPan) {
      if (place.get('selected')) {
        // Re-center the map to the corresponding place.
        if (shouldPan) {
          this.map.panTo(place.get('location'));
        }

        // Highlight the selected place on the map.
        this.toggleMarkerAnimation(place.get('marker'));
        this.toggleMarkerSelectedState(place.get('marker'));

        // Open the info window.
        this.addInfoWindow(place);

      } else {
        // Remove highlights
        this.toggleMarkerAnimation(null);
        this.toggleMarkerSelectedState(null);

        // Close the info window
        if (this.infoWindow) {
          this.removeInfoWindow();
        }

        // Refit the map to include all the markers.
        this.refitAndCenter();
      }
    },

    windowResizeHandler: function(event) {
      google.maps.event.trigger(event.data.view.map, 'resize');

      // Refit the map to include all the markers.
      event.data.view.refitAndCenter();
    },

    refitAndCenter: function() {
      this.map.fitBounds(this.mapBounds);
      this.map.setCenter(this.mapBounds.getCenter());
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

      // Listen for clicks on the marker.
      marker.addListener('click', function() {
        place.set('selected', true);

        // Notify the app (incl. this view) that a place was selected.
        app.eventBus.trigger('selectionChange', place, false);
      });

      // Add the marker's LatLng to the extents of the map and re-center.
      this.mapBounds.extend(place.get('location'));
      this.refitAndCenter();
      // TODO: Track adding all the markers so we can fit and center once.

      place.set('marker', marker);
    },

    toggleMarkerAnimation: function(markerToAnimate) {

      // Animate the selected marker.
      if (markerToAnimate && !markerToAnimate.getAnimation()) {
        markerToAnimate.setAnimation(google.maps.Animation.BOUNCE);

        var self = this;

        this.markerAnimationTimeout = setTimeout(
            self.createAnimationTimeoutHandler(markerToAnimate),
            self.markerAnimationTimeoutDuration
          );
      }

      // Stop animating any other markers that might be animating.
      app.places.models.forEach(function(place) {
          var currentMarker = place.get('marker');

          if (currentMarker != markerToAnimate) {
            currentMarker.setAnimation(null);
          }

        });

    },

    toggleMarkerSelectedState: function(markerToToggle) {
      // Toggle the selected marker to selected state.
      if (markerToToggle) {
        markerToToggle.setIcon(this.markerIcons.SELECTED);
      }

      var self = this;

      // Toggle all the other markers off.
      app.places.models.forEach(function(place) {
          var marker = place.get('marker');

          if (marker != markerToToggle) {
            marker.setIcon(self.markerIcons.NORMAL);
          }
        });
    },

    addInfoWindow: function(place) {
      // If the info window is already opened, remove it.
      if (this.infoWindow) {
        this.removeInfoWindow();
      }

      // Build nodes for info window content.
      //
      // To keep the width of the info window from fluctuating, we have
      // to wrap the content and set the width in the stylesheet.
      //
      var contentElement = document.createElement('article');
      contentElement.className = 'info-window-content';

      var infoHeaderElement = document.createElement('h3');
      infoHeaderElement.className = 'info-window-content__heading';
      infoHeaderElement.setAttribute('tabindex', '0');
      infoHeaderElement.appendChild(
          document.createTextNode(place.get('name'))
        );

      var statusElement = document.createElement('div');
      statusElement.className = 'info-window-content__status';
      statusElement.appendChild(
          document.createTextNode('Getting more information...')
        );

      contentElement.appendChild(infoHeaderElement);
      contentElement.appendChild(statusElement);


      // Create a new info window.

      var infoWindowOptions = { content: contentElement };
      var marker = place.get('marker');
      var self = this;

      this.infoWindow = new google.maps.InfoWindow(infoWindowOptions);

      this.infoWindow.addListener('closeclick', function() {
          // Stop the marker animation.
          marker.setAnimation(null);

          self.infoWindow = null;
        });

      this.infoWindow.addListener('domready', function() {
          // Event fires every time content is updated, so remove the listener.
          google.maps.event.clearListeners(self.infoWindow, 'domready');

          self.populateInfoWindow(place);
        });

      // Show the info window.
      this.infoWindow.open(this.map, marker);

    },

    removeInfoWindow: function() {
      // Clean up and close the window.
      google.maps.event.clearListeners(this.infoWindow, 'closeclick');
      this.infoWindow.close();
    },

    populateInfoWindow: function(place) {

      // If we already have Wikipedia data...
      if (place.get('wikipediaData')) {
        // ...add data to the info window.
        this.appendInfo(place.get('wikipediaData'));
      } else {
        // If we already have a jqXHR in progress, abort it.
        if (this.$jqXHR) {
          this.$jqXHR.abort();
        }

        // Set up the query.
        var wikiUrl = 'https://en.wikipedia.org/w/api.php';
        var settings = {
          dataType: 'jsonp',
          timeout: 8000,
          data: { // Wikipedia query fields
            action: 'opensearch',
            search: place.get('name'),
            format: 'json',
            formatversion: 2
          }
        };

        var self = this;

        // Get the data.
        this.$jqXHR = $.ajax(wikiUrl, settings)
                .done(function(data, status, jqXHR) {
                  // Build the HTML to add to the info window.
                  var htmlString = '';

                  // If there's a snippet...
                  if (data[2][0]) {
                    // Build the string with the data from the snippet.
                    var snippet = data[2][0];
                    var url = data[3][0];

                    var citation = '<a href="' + url + '" target="_blank"' +
                                   ' aria-label="Wikipedia article for ' +
                                   place.get('name') + '">' +
                                   'Wikipedia</a>';

                    htmlString = '<blockquote ' +
                        'class="info-window-content__snippet">' + snippet +
                        '</blockquote>' +
                        '<cite class="info-window-citation">Source: ' +
                        citation + '</cite>';
                  } else {
                    htmlString = '<blockquote ' +
                                 'class="info-window-content__snippet">' +
                                 'No additional information available.' +
                                 '</blockquote>';
                  }

                  // Add the content to the info window.
                  self.appendInfo(htmlString);
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                  var htmlString = '';

                  if (textStatus == 'timeout') {
                    htmlString = '<p>The request for additional information '+
                                 'took too long.</p>';
                  } else {
                    htmlString = '<p>An error was encountered when trying to ' +
                                 'get addtional information <span>[' +
                                 jqXHR.statusText + ' ' + jqXHR.status +
                                 ']</span>.</p>';
                  }

                  // Add the warning to the info window.
                  self.appendInfo(htmlString);

                  self.$jqXHR = null;
                });


      }
    },

    appendInfo: function(htmlString) {
      // Get the DOM nodes that were used to set the content.
      //
      // The info window UI is too slow to resize if we modify the node
      // directly (text overflows). Thus, we're cloning the node so we can make
      // changes and use use setContent() to update the info window.
      //
      var infoElement = this.infoWindow.getContent().cloneNode(true);

      // Replace the status text and add the new data.
      var infoStr = infoElement.innerHTML;
      infoStr = infoStr.replace('<div class="info-window-content__status">' +
                                'Getting more information...</div>', '');
      infoStr += htmlString;
      infoElement.innerHTML = infoStr;

      // Update the info window with the updated node.
      this.infoWindow.setContent(infoElement);

      // For A11y, move the focus.
      app.appView.requestFocus(
          infoElement.querySelector('.info-window-content__heading'));

    },

    createAnimationTimeoutHandler: function(currentMarker) {
      return function() {
        currentMarker.setAnimation(null);
      };
    }

  });


})();