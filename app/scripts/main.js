// jshint unused:false
'use strict';

/* jshint ignore:start */
var minZoomLevel = 11;
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

        //Creating yellow markers for each location
        marker[i] = new google.maps.Marker({
          position: place.geometry.location,
          map: map,
          icon: 'http://labs.google.com/ridefinder/images/mm_20_yellow.png'
        });

        addMarkerInfo(marker[i], place);
      }

      //service.nearbySearch(request, nearbyCB); //replace 20 most prominent pizza place markers
    }
  }

  function addMarkerInfo(marker, place) {
    var infowindow = new google.maps.InfoWindow();
    
    //closure to retain place data
    (function(marker) {
      google.maps.event.addListener(marker, "click", function(e) {
        infoWindow.setContent('');

        service.getDetails(place, function(place, status) {
          //console.log(place);

          if(status == google.maps.places.PlacesServiceStatus.OK) {
            infoWindow.setContent(infoWindowContent(place));
          }
        });

        infoWindow.open(map, marker);
      });
    })(marker);
  }
/*
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

            addMarkerInfo(marker[m], place);

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
*/
}

google.maps.event.addDomListener(window, 'load', initialize);

function infoWindowContent(place) {
  var info = '';

  if(typeof place.name == 'undefined') {
    place.name = "A Pizza Place with No Name";
  }
  info += '<h1>' + place.name + '</h1>';

  if(typeof place.adr_address != 'undefined') {
    info += place.adr_address + '<br />';
  }

  if(typeof place.formatted_phone_number != 'undefined') {
    info += '<span class="phone">' + place.formatted_phone_number + '<span><br />';
  }

  if(typeof place.website != 'undefined') {
    info += '<a href="' + place.website + '" class="website" target="_blank">' + place.website + '</a><br />'  
  }

  if(typeof place.rating != 'undefined') {
    info += '<span class="rating">Google Rating: ' + place.rating + '</span><br />'  
  }

  try {
    info += '<span class="rating" data-bind="text: $data">Foursquare Rating: ' + foursquareRating(place.geometry.location) + '</span><br />'  
    //console.log(foursquareRating(place.geometry.location));
  }
  catch(e) {
    console.log(e);
  }

  return info;
}

 /* jshint ignore:end */

function foursquareRating(location) {
  var lat = location.k,
      lng = location.D,
      rating = '';

  var foursquareBase = 'https://api.foursquare.com/v2/venues/explore?client_id=T2RYZINQTJUYZIICO2MQXG0BMBAUWNI3F5KBGCIJ5QO3IRBT&client_secret=VMUZGLY0ENBSBSM4HXZOTU5CR2430ABKXT5BTVQOQOJ4N4PS&v=20130815&query=pizza&radius=100&limit=1&llAcc=10&ll=',
      foursquareURL = foursquareBase + lat + ',' + lng;

  $.getJSON(foursquareURL, function(data) {
      // Now use this data to update your view models, 
      // and Knockout will update your UI automatically 

      try {
        console.log(data.response.groups[0].items[0].venue.rating);

        (function(data) {
          return data.response.groups[0].items[0].venue.rating;
        })(data);



      }
      catch(e) {
        console.log(e);
      }
  });
}

var Marker = function(name, location) {
  var self = this;

  self.name = name;
  self.location = location;
};

function MapViewModel() {
    var self = this;

    self.Markers = ko.observableArray([
      new Marker('Big Kahuna\'s Pizza', new google.maps.LatLng(21.335522, -157.91654500000004)),
      new Marker('Bravo Restaurant', new google.maps.LatLng(21.383593, -157.94557099999997)),
      new Marker('Rosarina Pizza', new google.maps.LatLng(21.31229, -157.862618)),
      new Marker('Doughlicious', new google.maps.LatLng(21.294302, -157.841133)),
      new Marker('La Pizza Rina', new google.maps.LatLng(21.298095, -157.83961599999998)),
      new Marker('Brick Oven Pizza', new google.maps.LatLng(21.332582, -158.082038)),
      new Marker('Pizza Corner', new google.maps.LatLng(21.342423, -158.124125)),
      new Marker('Boston\'s North End Pizza Restaurant', new google.maps.LatLng(21.380137, -157.93820600000004)),
    ]);
}

function ListViewModel() {
    var self = this;
}

ko.applyBindings(new MapViewModel());
