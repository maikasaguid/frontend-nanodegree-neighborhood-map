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
});

// Limit the zoom level
google.maps.event.addListener(map, 'zoom_changed', function() {
  if(map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
});

function convertToMarkers(places) {
  var i = 0,
  marks = [];

  while(i < places.length) {
    marks[i] = new google.maps.Marker({
      position: new google.maps.LatLng(places[i].lat, places[i].lng),
      title: places[i].name,
      map: map
    });

    i++;
  }

  return marks;
}

var ourTopPizza = [
  {
    name: 'Big Kahuna\'s Pizza',
    lat: 21.335522,
    lng: -157.91654500000004,
    show: true
  },
  {
    name: 'J.J. Dolans',
    lat: 21.310943,
    lng: -157.860536,
    show: true
  },
  {
    name: 'Bravo Restaurant',
    lat: 21.383593,
    lng: -157.94557099999997,
    show: true
  },
  {
    name: 'Rosarina Pizza',
    lat: 21.31229,
    lng: -157.862618,
    show: true
  },
  {
    name: 'Doughlicious',
    lat: 21.294302,
    lng: -157.841133,
    show: true
  },
  {
    name: 'La Pizza Rina',
    lat: 21.298095,
    lng: -157.83961599999998,
    show: true
  },
  {
    name: 'Brick Oven Pizza',
    lat: 21.332582,
    lng: -158.082038,
    show: true
  },
  {
    name: 'Pizza Corner',
    lat: 21.342423,
    lng: -158.124125,
    show: true
  },
  {
    name: 'Serino\'s Pizza',
    lat: 21.308459,
    lng: -157.810562,
    show: true
  },
  {
    name: 'Boston\'s North End Pizza Restaurant',
    lat: 21.380137,
    lng: -157.93820600000004,
    show: true
  }
];

var yelpTopPizza = [
  {
    name: 'Hiking Hawaii Cafe',
    lat: 21.285458,
    lng: -157.835197,
    show: true
  },
  {
    name: 'Kaneohe\'s Boston Pizza',
    lat: 21.418950,
    lng: -157.804038,
    show: true
  },
  {
    name: 'Amina Pizzeria',
    lat: 21.292439,
    lng: -157.836421,
    show: true
  },
  {
    name: 'JJ Dolan\'s',
    lat: 21.310943,
    lng: -157.860536,
    show: true
  },
  {
    name: 'The Lovin\' Oven',
    lat: 21.276885,
    lng: -157.823936,
    show: true
  },
  {
    name: 'Uncle Bo\'s Pupu Bar & Grill',
    lat: 21.277740,
    lng: -157.813856,
    show: true
  },
  {
    name: 'Marketplace Cafe',
    lat: 21.292547,
    lng: -157.841960,
    show: true
  },
  {
    name: 'Impossibles Pizza',
    lat: 21.664547,
    lng: -158.050516,
    show: true
  },
  {
    name: 'Arancino on Beachwalk',
    lat: 21.280135,
    lng: -157.830890,
    show: true
  },
  {
    name: 'Fendu Boulangrie',
    lat: 21.307802,
    lng: -157.810460,
    show: true
  }
];

function AppViewModel() {
  var self = this;

  self.markers = ko.observableArray(convertToMarkers(ourTopPizza));
  self.places = ko.observableArray(ourTopPizza);
  self.filter = ko.observable('');
  self.currentList = ourTopPizza;

  self.choosePizzaList = function(data, event) {
    ko.utils.arrayForEach(self.markers(), function(marker) {
      marker.setMap(null);
    });

    self.places([]);

    if(event.target.id === 'yelp') {
      self.currentList = yelpTopPizza;
    }
    if(event.target.id === 'our') {
      self.currentList = ourTopPizza;
    }
    if(event.target.id === 'all') {
      
    }

    self.markers(convertToMarkers(self.currentList));
    self.places(self.currentList);
  };

  self.filteredPlaces = ko.computed(function() {
    if(!self.filter()) {
      return self.places();
    }
    else {
      return ko.utils.arrayFilter(self.places(), function(place) { 
        return place.name.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1;
      });
    }
  }, self);

  self.filterListMap = function(data, event) {
    self.markers(convertToMarkers(self.filteredPlaces()));
    self.places(self.filteredPlaces());
  }
}

ko.applyBindings(new AppViewModel());

$('.main .list').hide();

$('.well label').click(function () {
  if($('#map').is(':visible')) {
    $('#map').hide();
    $('.main .list').show();
  }
  else {
    $('.main .list').hide();
    $('#map').show();
  }
});

$('.nav-sidebar').children('li').click(function() {
  $('.nav-sidebar').children('li').removeClass('active');
  $(this).addClass('active');
});

 /* jshint ignore:end */
