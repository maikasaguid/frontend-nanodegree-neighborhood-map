// jshint unused:false
'use strict';

/* jshint ignore:start */
var minZoomLevel = 11;
var foursquare = 'https://api.foursquare.com/v2/venues/search?client_id=T2RYZINQTJUYZIICO2MQXG0BMBAUWNI3F5KBGCIJ5QO3IRBT&client_secret=VMUZGLY0ENBSBSM4HXZOTU5CR2430ABKXT5BTVQOQOJ4N4PS&v=20130815&ll=21.48,-158.025&query=pizza';
var lat = 21.48,
    lng = -158.025;
var hnlLat = 21.3,
    hnlLng = -157.858;
var iconBase = 'http://maps.google.com/mapfiles/kml/pal2/';
var icons = {
  bar: {
    icon: iconBase + 'icon27.png'
  },
  cafe: {
    icon: iconBase + 'icon62.png'
  },
  food: {
    icon: iconBase + 'icon47.png'
  },
  meal_delivery: {
    icon: iconBase + 'icon47.png'
  },
  meal_takeaway: {
    icon: iconBase + 'icon47.png'
  },
  restaurant: {
    icon: iconBase + 'icon63.png'
  }
};

function initialize() {
  var mapOptions = {
    center: {lat: lat, lng: lng},
    mapTypeControl: false,
    panControl: false,
    streetViewControl: false,
    zoom: minZoomLevel,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP
    }
  },
  map = new google.maps.Map(document.getElementById('map'), mapOptions),
  infoWindow = new google.maps.InfoWindow(),
  service = new google.maps.places.PlacesService(map),
  oahu = new google.maps.LatLng(lat, lng),
  hnl = new google.maps.LatLng(hnlLat, hnlLng),
  request = {
    location: oahu,
    radius: '50000',
    keyword: 'pizza',
    types: [
      'bar',
      'cafe',
      'food',
      'meal_delivery',
      'meal_takeaway',
      'restaurant'
    ]
  },
  marker = [];

  service.radarSearch(request, radarCB);

  function radarCB(results, status) {
    if(status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];

        marker[i] = new google.maps.Marker({
          position: place.geometry.location,
          map: map,
          icon: 'http://labs.google.com/ridefinder/images/mm_20_yellow.png'
        });

        google.maps.event.addListener(marker[i], 'click', function(e) {
          populateInfo(place, infoWindow, service, map);

          infoWindow.open(map, this);
        });
      }

      service.nearbySearch(request, nearbyCB); //replace 20 most prominent pizza place markers
    }
  }

  function nearbyCB(results, status) {
    if(status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i],
            m, //index of found prominent marker
            pIcon;

        for(var j = 0; j < marker.length; j++) {
          if(marker[j].position.equals(place.geometry.location)) {
            m = j;

            marker[m].setMap(null); //remove existing marker

            //Add some icons for common places
            if(place.name.indexOf('Hut') > -1) {
              pIcon = '/images/logo-pizza-hut.png';
            }
            else if(place.name.indexOf('Caesar') > -1) {
              pIcon = '/images/logo-little-caesars.png';
            }
            else if(place.name.indexOf('California') > -1) {
              pIcon = '/images/logo-cpk.png';
            }
            else if(place.name.indexOf('Papa') > -1) {
              pIcon = '/images/logo-papa-johns.png';
            }
            else if(place.name.indexOf('Round') > -1) {
              pIcon = '/images/logo-round-table.png';
            }
            else if(place.name.indexOf('Domino') > -1) {
              pIcon = '/images/logo-dominos.png';
            }
            else if(place.name.indexOf('Boston') > -1) {
              pIcon = '/images/logo-boston-pizza.png';
            }
            else pIcon = icons[place.types[0]].icon;

            marker[m] = new google.maps.Marker({
              position: place.geometry.location,
              map: map,
              icon: pIcon
            });

            continue;
          }
        }
      }
    }
  }

  // Limit the zoom level
  google.maps.event.addListener(map, 'zoom_changed', function() {
    if(map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
  });
}

google.maps.event.addDomListener(window, 'load', initialize);

function populateInfo(place, iw, svc, map) {
  svc.getDetails(place, function(place, status) {
    if(status == google.maps.places.PlacesServiceStatus.OK) {
      iw.setContent(place.name);
    }
  });
}

 /* jshint ignore:end */

//$.getJSON(foursquare, function(data) { 
    // Now use this data to update your view models, 
    // and Knockout will update your UI automatically 

    //console.log(data);
//});

function MapViewModel() {
    var self = this;
}

function ListViewModel() {
    var self = this;
}
