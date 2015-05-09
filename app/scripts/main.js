// jshint unused:false
'use strict';

/* jshint ignore:start */
var minZoomLevel = 11;
var lat = 21.48,
    lng = -158.035;
var hnlLat = 21.3,
    hnlLng = -157.858;
var iconBase = 'http://maps.google.com/mapfiles/kml/pal2/',
    icons = {
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
var map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: lat,
        lng: lng
      },
      mapTypeControl: false,
      panControl: false,
      streetViewControl: false,
      zoom: minZoomLevel,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      }
    }),
    infoWindow = new google.maps.InfoWindow(),
    service = new google.maps.places.PlacesService(map);

// Limit the zoom level
google.maps.event.addListener(map, 'zoom_changed', function() {
  if(map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
});

var mapCenter = map.getCenter();

//Re-center on re-size
google.maps.event.addDomListener(window, 'resize', function() {
  map.setCenter(mapCenter);
});

var ourTopPizza = [
  {
    name: 'Big Kahuna\'s Pizza',
    lat: 21.335522,
    lng: -157.91654500000004
  },
  {
    name: 'J.J. Dolan\'s',
    lat: 21.310943,
    lng: -157.860536
  },
  {
    name: 'Bravo Restaurant',
    lat: 21.383593,
    lng: -157.94557099999997
  },
  {
    name: 'Rosarina Pizza',
    lat: 21.31229,
    lng: -157.862618
  },
  {
    name: 'Doughlicious',
    lat: 21.294302,
    lng: -157.841133
  },
  {
    name: 'La Pizza Rina',
    lat: 21.298095,
    lng: -157.83961599999998
  },
  {
    name: 'Brick Oven Pizza',
    lat: 21.332582,
    lng: -158.082038
  },
  {
    name: 'Pizza Corner',
    lat: 21.342423,
    lng: -158.124125
  },
  {
    name: 'Serino\'s Pizza',
    lat: 21.308459,
    lng: -157.810562
  },
  {
    name: 'Boston\'s North End Pizza Restaurant',
    lat: 21.380137,
    lng: -157.93820600000004
  }
];

var yelpTopPizza = [
  {
    name: 'Hiking Hawaii Cafe',
    lat: 21.285458,
    lng: -157.835197
  },
  {
    name: 'Kaneohe\'s Boston Pizza',
    lat: 21.418950,
    lng: -157.804038
  },
  {
    name: 'Amina Pizzeria',
    lat: 21.292439,
    lng: -157.836421
  },
  {
    name: 'JJ Dolan\'s',
    lat: 21.310943,
    lng: -157.860536
  },
  {
    name: 'The Lovin\' Oven',
    lat: 21.276885,
    lng: -157.823936
  },
  {
    name: 'Uncle Bo\'s Pupu Bar & Grill',
    lat: 21.277740,
    lng: -157.813856
  },
  {
    name: 'Marketplace Cafe',
    lat: 21.292547,
    lng: -157.841960
  },
  {
    name: 'Impossibles Pizza',
    lat: 21.664547,
    lng: -158.050516
  },
  {
    name: 'Arancino on Beachwalk',
    lat: 21.280135,
    lng: -157.830890
  },
  {
    name: 'Fendu Boulangrie',
    lat: 21.307802,
    lng: -157.810460
  }
];

function Location(name, lat, lng, show) {
  var self = this;

  self.name = name;
  self.lat = lat;
  self.lng = lng;
  self.marker = new google.maps.Marker({
    icon: {
      scaledSize: new google.maps.Size(54, 27),
      url: 'images/icon.svg'
    },
    map: map,
    position: new google.maps.LatLng(lat, lng),
    title: name
  });
  self.show = ko.observable(show);

  google.maps.event.addListener(self.marker, 'click', function(e) {
    infoWindow.setContent(this.title);
    infoWindow.open(map, this);
  });
}

function convertToLocations(places) {
  var locs = [];
  
  for(var i=0; i < places.length; i++) {
    locs[i] = new Location(places[i].name, places[i].lat, places[i].lng, true);
  }

  return locs;
}

function AppViewModel() {
  var self = this;

  self.currentList = ourTopPizza;
  self.currentListString = 'our';
  self.filter = ko.observable('');
  self.locations = ko.observableArray(convertToLocations(self.currentList));

  self.choosePizzaList = function(data, event) {
    if(event.target.id != self.currentListString) {
      self.currentListString = event.target.id;

      ko.utils.arrayForEach(self.locations(), function(location) { //remove markers from map
        location.marker.setMap(null);
      });

      self.locations([]); //clear observableArray

      if(event.target.id === 'yelp') {
        self.currentList = yelpTopPizza;
      }
      if(event.target.id === 'our') {
        self.currentList = ourTopPizza;
      }
      if(event.target.id === 'all') {
        //Google Maps radar search
      }

      self.locations(convertToLocations(self.currentList));
      self.filterListMap(); //run through filter
    }
  };

  self.filterListMap = function(data, event) {
    ko.utils.arrayForEach(self.locations(), function(location) {
      location.show(true);
      location.marker.setMap(map);

      if(location.name.toLowerCase().indexOf(self.filter().toLowerCase()) == -1) {
        location.show(false);
        location.marker.setMap(null);
      }
    });
  }
}

ko.applyBindings(new AppViewModel());

$( document ).ready(function() { 
  $('.main .list').hide();

  $('.well label').click(function () { //switch between map and list
    if($(this).attr('for') == 'mapView' || $(this).attr('for') == 'mapView2') {
      $('.main .list').hide();
      $('#map').show();
    }
    if($(this).attr('for') == 'listView' || $(this).attr('for') == 'listView2') {
      $('#map').hide();
      $('.main .list').show();
    }
  });

  $('.nav-sidebar').children('li').click(function() { //handle highlighting of sidebar lists
    $('.nav-sidebar').children('li').removeClass('active');
    $(this).addClass('active');
  });

  $('.nav-list').children('li').click(function() { //handle highlighting of sidebar lists
    $('.nav-list').children('li').removeClass('active');
    $(this).addClass('active');
  });
});

 /* jshint ignore:end */
