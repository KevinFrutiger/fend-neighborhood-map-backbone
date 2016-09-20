var app=app||{};(function(){app.MapView=Backbone.View.extend({el:".js-map",markerIcons:{NORMAL:"images/marker-red.png",SELECTED:"images/marker-yellow.png"},markerAnimationTimeoutDuration:3e3,initialize:function(){this.infoWindow=null,this.markerAnimationTimeout=null,this.$jqXHR=null;var mapOptions={center:{lat:37.6640317,lng:-122.445706},zoom:11,zoomControl:!0,zoomControlOptions:{position:google.maps.ControlPosition.RIGHT_CENTER},mapTypeControl:!0,mapTypeControlOptions:{position:google.maps.ControlPosition.RIGHT_TOP},streetViewControl:!1};this.map=new google.maps.Map($(".js-map")[0],mapOptions),this.mapBounds=new google.maps.LatLngBounds,this.placesService=new google.maps.places.PlacesService(this.map),this.listenTo(app.places,"change:filtered",this.render),this.listenTo(app.eventBus,"selectionChange",this.selectionChangeHandler),$(window).resize({view:this},this.windowResizeHandler),this.render()},render:function(){var self=this;app.places.models.forEach(function(place){if(place.get("placeId")){var marker=place.get("marker");marker.setVisible(place.get("filtered")),null!==marker.getAnimation()&&marker.setAnimation(null)}else{var request={location:self.map.getCenter(),radius:"500",query:place.get("name")};self.placesService.textSearch(request,function(results,status){status==google.maps.places.PlacesServiceStatus.OK&&(place.set("placeId",results[0].place_id),place.set("location",results[0].geometry.location),place.set("types",results[0].types),self.addMarker(place))})}}),this.infoWindow&&this.removeInfoWindow()},selectionChangeHandler:function(place,shouldPan){place.get("selected")?(shouldPan&&this.map.panTo(place.get("location")),this.toggleMarkerAnimation(place.get("marker")),this.toggleMarkerSelectedState(place.get("marker")),this.addInfoWindow(place)):(this.toggleMarkerAnimation(null),this.toggleMarkerSelectedState(null),this.infoWindow&&this.removeInfoWindow(),this.refitAndCenter())},windowResizeHandler:function(event){google.maps.event.trigger(event.data.view.map,"resize"),event.data.view.refitAndCenter()},refitAndCenter:function(){this.map.fitBounds(this.mapBounds),this.map.setCenter(this.mapBounds.getCenter())},addMarker:function(place){var marker=new google.maps.Marker({map:this.map,place:{placeId:place.get("placeId"),location:place.get("location")},animation:google.maps.Animation.DROP,icon:this.markerIcons.NORMAL});marker.addListener("click",function(){place.set("selected",!0),app.eventBus.trigger("selectionChange",place,!1)}),this.mapBounds.extend(place.get("location")),this.refitAndCenter(),place.set("marker",marker)},toggleMarkerAnimation:function(markerToAnimate){if(markerToAnimate&&!markerToAnimate.getAnimation()){markerToAnimate.setAnimation(google.maps.Animation.BOUNCE);var self=this;this.markerAnimationTimeout=setTimeout(self.createAnimationTimeoutHandler(markerToAnimate),self.markerAnimationTimeoutDuration)}app.places.models.forEach(function(place){var currentMarker=place.get("marker");currentMarker!=markerToAnimate&&currentMarker.setAnimation(null)})},toggleMarkerSelectedState:function(markerToToggle){markerToToggle&&markerToToggle.setIcon(this.markerIcons.SELECTED);var self=this;app.places.models.forEach(function(place){var marker=place.get("marker");marker!=markerToToggle&&marker.setIcon(self.markerIcons.NORMAL)})},addInfoWindow:function(place){this.infoWindow&&this.removeInfoWindow();var contentElement=document.createElement("article");contentElement.className="info-window-content";var infoHeaderElement=document.createElement("h3");infoHeaderElement.className="info-window-content__heading",infoHeaderElement.setAttribute("tabindex","0"),infoHeaderElement.appendChild(document.createTextNode(place.get("name")));var statusElement=document.createElement("div");statusElement.className="info-window-content__status",statusElement.appendChild(document.createTextNode("Getting more information...")),contentElement.appendChild(infoHeaderElement),contentElement.appendChild(statusElement);var infoWindowOptions={content:contentElement},marker=place.get("marker"),self=this;this.infoWindow=new google.maps.InfoWindow(infoWindowOptions),this.infoWindow.addListener("closeclick",function(){marker.setAnimation(null),self.infoWindow=null}),this.infoWindow.addListener("domready",function(){google.maps.event.clearListeners(self.infoWindow,"domready"),self.populateInfoWindow(place)}),this.infoWindow.open(this.map,marker)},removeInfoWindow:function(){google.maps.event.clearListeners(this.infoWindow,"closeclick"),this.infoWindow.close()},populateInfoWindow:function(place){if(place.get("wikipediaData"))this.appendInfo(place.get("wikipediaData"));else{this.$jqXHR&&this.$jqXHR.abort();var wikiUrl="https://en.wikipedia.org/w/api.php",settings={dataType:"jsonp",timeout:8e3,data:{action:"opensearch",search:place.get("name"),format:"json",formatversion:2}},self=this;this.$jqXHR=$.ajax(wikiUrl,settings).done(function(data,status,jqXHR){var htmlString="";if(data[2][0]){var snippet=data[2][0],url=data[3][0],citation='<a href="'+url+'" target="_blank" aria-label="Wikipedia article for '+place.get("name")+'">Wikipedia</a>';htmlString='<blockquote class="info-window-content__snippet">'+snippet+'</blockquote><cite class="info-window-citation">Source: '+citation+"</cite>"}else htmlString='<blockquote class="info-window-content__snippet">No additional information available.</blockquote>';self.appendInfo(htmlString)}).fail(function(jqXHR,textStatus,errorThrown){var htmlString="";htmlString="timeout"==textStatus?"<p>The request for additional information took too long.</p>":"<p>An error was encountered when trying to get addtional information <span>["+jqXHR.statusText+" "+jqXHR.status+"]</span>.</p>",self.appendInfo(htmlString),self.$jqXHR=null})}},appendInfo:function(htmlString){var infoElement=this.infoWindow.getContent().cloneNode(!0),infoStr=infoElement.innerHTML;infoStr=infoStr.replace('<div class="info-window-content__status">Getting more information...</div>',""),infoStr+=htmlString,infoElement.innerHTML=infoStr,this.infoWindow.setContent(infoElement),app.appView.requestFocus(infoElement.querySelector(".info-window-content__heading"))},createAnimationTimeoutHandler:function(currentMarker){return function(){currentMarker.setAnimation(null)}}})})();