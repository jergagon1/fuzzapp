window.moveBus = function (map, marker, geolocation, updateInputs) {
  map.panTo(new google.maps.LatLng(geolocation.coords.latitude, geolocation.coords.longitude));

  $('#lost_position_lng').val(geolocation.coords.longitude);
  $('#lost_position_lat').val(geolocation.coords.latitude);

  if (marker) {
    marker.setPosition(new google.maps.LatLng(geolocation.coords.latitude, geolocation.coords.longitude));
  }
};


$(function () {
  $('.nav-trigger').click(function () {
    $('.menu-navigation').toggleClass('open');
  });

  $('.menu-navigation .extra-area').click(function () {
    $('.menu-navigation').toggleClass('open');
  });

  $('.custom-date-trigger').click(function (e) {
    e.preventDefault();
    var a = $(this).parents('.Pet-description') //.addClass('custom-date-input');
    console.log(a);
  });

  // SECTIONS AND ANCETE INTERACTIONS

  window.navigationStack = [];

  function getNavigationToggler(target) {
    if (target.indexOf('.lost-pet-') > -1) {
      return 'navigation-orange';
    } else if (target.indexOf('.found-pet-') > -1) {
      return 'navigation-green';
    } else if (target.indexOf('.pet-sightings-') > -1) {
      return 'navigation-blue-light';
    } else if (target.indexOf('.fuzz-chat') > -1) {
      return 'navigation-blue-dark';
    } else {
      return null;
    }
  }

  $('#lost_current_location').click(function () {
    if (window.geolocation) {
      moveBus(lostPetMap, lostPetMarker, window.geolocation);
    }
  });

  $("#lost_address").keypress(function (event) {
    if (event.which == 13) {
      var address = $(this).val();

      // var options = {
      //   address: address,
      //   map: '#lost_map'
      // };

      geolocator.geocode({address: address}, function (err, location) {
        // debugger;
        moveBus(lostPetMap, lostPetMarker, location);
        console.log('callback');
      });

      event.preventDefault();
    }
  });

  function after_router(fragment, target, tClass, state) {
    window.navigationStack.push([target, tClass, fragment]);
    var navigationClass = getNavigationToggler(target);
    if (navigationClass && (tClass === 'show')) {
      if (state) {
        $('.fuzzfinders-app').removeClass('navigation-blue-light');
        $('.fuzzfinders-app .pet-sightings-page-wrapper').addClass('post-shown');
      }
      $('.fuzzfinders-app').addClass(navigationClass);
    }
  }

  Router.root = '/fuzzapp/';

  Router
    .add('local', 'local', function (fragment) {
      document.querySelector('.pet-sightings-page-wrapper').classList.add('show');
      after_router(fragment, '.pet-sightings-page-wrapper', 'show');
    })
    .add('local_found', 'local/found/(.*)', function (fragment, id) {
      $.get("/api/v1/reports/" + id, null, 'script')
        .done(function () {
          document.querySelector('.found-pet-post-wrapper').classList.add('show');
          after_router(fragment, '.found-pet-post-wrapper', 'show', true);
        });
    })
    .add('local_lost', 'local/lost/(.*)', function (fragment, id) {
      $.get("/api/v1/reports/" + id, null, 'script')
        .done(function () {
          document.querySelector('.lost-pet-post-wrapper').classList.add('show');
          after_router(fragment, '.lost-pet-post-wrapper', 'show', true);
        })
    })
    .add('lost', 'lost', function (fragment) {
      document.querySelector('.lost-pet-page-wrapper').classList.add('show');
      after_router(fragment, '.lost-pet-page-wrapper', 'show');
    })
    .add('lost_step2', 'lost/step_2', function (fragment) {
      document.querySelector('.lost-pet-page-wrapper').classList.add('show');
      document.querySelector('.lost-pet-page-wrapper .progress-step').classList.add('step-2');
      document.querySelector('.lost-pet-page-wrapper .ancete-wrapper').classList.add('step-2');
      after_router(fragment, '.lost-pet-page-wrapper .progress-step , .lost-pet-page-wrapper .ancete-wrapper ', 'step-2');
    })
    .add('lost_step3', 'lost/step_3', function (fragment) {
      document.querySelector('.lost-pet-page-wrapper').classList.add('show');
      document.querySelector('.lost-pet-page-wrapper .progress-step').classList.add('step-3');
      document.querySelector('.lost-pet-page-wrapper .ancete-wrapper').classList.add('step-3');
      after_router(fragment, '.lost-pet-page-wrapper .progress-step , .lost-pet-page-wrapper .ancete-wrapper ', 'step-3');
    })
    .add('found', 'found', function (fragment) {
      document.querySelector('.found-pet-page-wrapper').classList.add('show');
      after_router(fragment, '.found-pet-page-wrapper', 'show');
    })
    .add('found_step2', 'found/step_2', function (fragment) {
      document.querySelector('.found-pet-page-wrapper').classList.add('show');
      document.querySelector('.found-pet-page-wrapper .progress-step').classList.add('step-2');
      document.querySelector('.found-pet-page-wrapper .ancete-wrapper').classList.add('step-2');
      after_router(fragment, '.found-pet-page-wrapper .progress-step , .found-pet-page-wrapper .ancete-wrapper ', 'step-2');
    })
    .add('found_step3', 'found/step_3', function (fragment) {
      document.querySelector('.found-pet-page-wrapper').classList.add('show');
      document.querySelector('.found-pet-page-wrapper .progress-step').classList.add('step-3');
      document.querySelector('.found-pet-page-wrapper .ancete-wrapper').classList.add('step-3');
      after_router(fragment, '.found-pet-page-wrapper .progress-step , .found-pet-page-wrapper .ancete-wrapper ', 'step-3');
    })
    .add('chat', 'chat', function (fragment) {
      document.querySelector('.fuzz-chat-wrapper').classList.add('show');
      after_router(fragment, '.fuzz-chat-wrapper', 'show');
    })
    .listen();

  if (window.location.pathname && window.location.pathname) {
    var hash = Router.getFragment();
    if (Router.is(['local', 'local_found', 'local_lost'], hash)) {
      Router.check(hash);
    } else {
      Router.navigate();
    }
  }

  $('[data-route]').on('click', function () {
    var route = $(this).data('route');
    Router.navigate('/' + route);
  });

  $('.btn-toggler, .btn-apply').click(function () {
    var target = $(this).data('target');
    var tClass = $(this).data('toggle');
    $(target).toggleClass(tClass);

    navigationStack.push([target, tClass]);
    $('body').scrollTop(0);
    $(target).parent().scrollTop(0);

    if (tClass === 'step-2') {
      if (window.geolocation) {
      }
    }

    var navigationClass = getNavigationToggler(target);
    if (navigationClass && (tClass === 'show')) {
      if (target.indexOf('post-wrapper') > -1) {
        $('.fuzzfinders-app').removeClass('navigation-blue-light');
        $('.fuzzfinders-app .pet-sightings-page-wrapper').addClass('post-shown');
      }
      $('.fuzzfinders-app').addClass(navigationClass);
    }
  });

  $('body').on('click', '.back-arrow', function () {
    var lastTransition = navigationStack.pop();
    var target = lastTransition[0];
    var tClass = lastTransition[1];

    $(target).toggleClass(tClass);
    $('body').scrollTop(0);

    var navigationClass = getNavigationToggler(target);
    if (navigationClass && (tClass === 'show')) {
      if (target.indexOf('post-wrapper') > -1) {
        $('.fuzzfinders-app').addClass('navigation-blue-light');
        $('.fuzzfinders-app .pet-sightings-page-wrapper').removeClass('post-shown');
      }
      $('.fuzzfinders-app').removeClass(navigationClass);
    }
    if (($(window).width() > 1024) && ($(window).height() > 640)) {
      $('.show .ancete-wrapper').height(300);
    }
    $('.show .ancete-wrapper').height(300);

    var prev = navigationStack.slice(-1)
    if (prev.length) {
      Router.navigate(prev[0][2]);
    } else {
      Router.navigate();
    }

  });

  // SHOW DROPDOWN AREA IN ANCETE AND SIGHTS SCREEN
  $('.btn-subarea').click(function () {
    //event.preventDefault();
    var holder = $(this).parent();
    $(holder).toggleClass('extra-open');
  });


  // FINISH THE ANCETE

  function turnTransition(target, tClass) {
    $(target).toggleClass(tClass);
    if (tClass === 'show') {
      $(target + ' .nav-block').removeClass('fixed-menu');
    }

    var navigationClass = getNavigationToggler(target);
    if (navigationClass && (tClass === 'show')) {
      $('.fuzzfinders-app').removeClass(navigationClass);
    }
  }

  $('.btn-submit').click(function () {
    var backStap = true;
    var targetObject = $(this).data('target');
    var lastTransition,
      target,
      tClass,
      backStack = [];
    $('.mainpage-wrapper').scrollTop(0);
    while (backStap) {
      lastTransition = navigationStack.pop();
      target = lastTransition[0];
      tClass = lastTransition[1];
      if (target === targetObject) {
        backStap = false;
      }
      else {
        backStack.push(lastTransition);
      }
    }

    turnTransition(lastTransition[0], lastTransition[1]);
    setTimeout(function () {
      backStack.forEach(function (item) {
        turnTransition(item[0], item[1]);
      });
    }, 600);

    setTimeout(function () {
      $('.ancete-wrapper').removeAttr('style');
    }, 650);

    $('body').scrollTop(0);
  });


  $(window).load(function () {
    $('*[class^="step-wrapper-"]').on('mresize', function () {
      var ancete = $(this).parent();
      var active;
      if (ancete.hasClass('step-1')) {
        active = ancete.children('step-wrapper-1');
      }
      else if (ancete.hasClass('step-2')) {
        active = ancete.children('step-wrapper-2');
      }
      else if (ancete.hasClass('step-3')) {
        active = ancete.children('step-wrapper-3');
      }

      ancete.height($(this).height() + 32);


    });
  });
  //Dropdown interaction

  $('.dropdown .dropdown-menu li a').click(function () {
    var $a = $(this),
      $aText = $(this).text(),
      counter = 0;
    while ($aText[counter] === String.fromCharCode(160)) {
      counter++;
    }
    $aText = $aText.substring(counter);
    $a.parents('.dropdown').find('.dropdown-toggle').text($aText);
  });

  $('.custom-date-trigger').click(function () {
    $(this).parents('form').addClass('custom-date');
  });


  //Alerts workflow
  //FAQ workflow

  $(document).on('click', '.question-button', function (e) {
    e.preventDefault();
    $(this).parent().toggleClass('show').children('.question-content').collapse('toggle')
  });

  //Social connect buttons
  $('.social-buttons .to-connect, .social-buttons .connected').click(function () {
    $(this).toggleClass('to-connect').toggleClass('connected');
  })
});


window.FuzzAppMapStyles = [
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry",
    "stylers": [{"color": "#f7f1df"}]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [{"color": "#d0e3b4"}]
  },
  {
    "featureType": "landscape.natural.terrain",
    "elementType": "geometry",
    "stylers": [{"visibility": "off"}]
  },
  {
    "featureType": "poi",
    "elementType": "labels",
    "stylers": [{"visibility": "off"}]
  },
  {
    "featureType": "poi.business",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
  },
  {
    "featureType": "poi.medical",
    "elementType": "geometry",
    "stylers": [{"color": "#fbd3da"}]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{"color": "#bde6ab"}]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [{"visibility": "off"}]
  },
  {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [{"visibility": "off"}]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#ffe15f"}]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{"color": "#efd151"}]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#ffffff"}]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry.fill",
    "stylers": [{"color": "black"}]
  },
  {
    "featureType": "transit.station.airport",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#cfb2db"}]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{"color": "#a2daf2"}]
  }];

function showReport(item) {
  Router.navigate('local/' + item.type + '/' + item.id);
}

function getBounds(map) {
  var bounds = map.getBounds();
  var ne = bounds.getNorthEast();
  var sw = bounds.getSouthWest();

  return {
    ne: {
      lat: ne.lat(),
      lng: ne.lng()
    },
    sw: {
      lat: sw.lat(),
      lng: sw.lng()
    }
  };
}

var need_update = false;
var last_bound;
function getReports(map, callback) {
  last_bound = getBounds(map);
  if (!need_update) {
    need_update = setTimeout(function () {
      $.getJSON('/api/v1/reports/mapquery.json?sw=' + last_bound.sw.lat + ',' + last_bound.sw.lng + '&ne=' + last_bound.ne.lat + ',' + last_bound.ne.lng, callback);
      need_update = false;
    }, 100);
  }
}

function updateMap(data) {
  var active = data.reports.map(function (report) {
    return report.id;
  });

  $('.pet-sightings-page-wrapper .small-report-card').each(function (i, card) {
    var id = $(this).data('report-id');
    this.style.display = active.indexOf(id) > -1 ? 'inline-block' : 'none';
  });
}

function initMap2() {
  var lostPetMapDOM = $('.fuzzfinders-app .mainpage-wrapper .lost-pet-page-wrapper .section-wrapper .ancete-wrapper .step-wrapper-2 .map')[0],

    mapOptions = {
      zoom: 14,
      center: new google.maps.LatLng(37.801, -122.28),
      styles: FuzzAppMapStyles,
      mapTypeControl: false,
      streetViewControl: false,
      scrollwheel: false
    };

  window.lostPetMap = new google.maps.Map(lostPetMapDOM, mapOptions);

  window.lostPetMarker = new google.maps.Marker({
    position: {lat: 37.802, lng: -122.28},
    map: lostPetMap,
    icon: '/img/app/map/lost-pin.png',
    draggable: true
  });

  google.maps.event.addListener(lostPetMarker, 'dragend', function (event) {
    $('#lost_position_lat').val(this.position.lat());
    $('#lost_position_lng').val(this.position.lng());
  });

  var foundPetMapDOM = $('.fuzzfinders-app .mainpage-wrapper .found-pet-page-wrapper .section-wrapper .ancete-wrapper .step-wrapper-2 .map')[0];

  window.foundPetMap = new google.maps.Map(foundPetMapDOM, mapOptions);

  window.foundPetMarker = new google.maps.Marker({
    position: {lat: 37.802, lng: -122.28},
    map: foundPetMap,
    icon: '/img/app/map/found-pin.png',
    draggable: true
  });

  google.maps.event.addListener(foundPetMarker, 'dragend', function (event) {
    $('#found_position_lat').val(this.position.lat());
    $('#found_position_lng').val(this.position.lng());
  });


  var sightingsMapDOM = $('.fuzzfinders-app .mainpage-wrapper .pet-sightings-page-wrapper .section-wrapper .map')[0];

  if (window.geolocation) {
    var mapOptions = {
      zoom: 14,
      center: new google.maps.LatLng(geolocation.coords.latitude, geolocation.coords.longitude),
      styles: FuzzAppMapStyles,
      mapTypeControl: false,
      streetViewControl: false,
      scrollwheel: false
    };
  } else {
    var mapOptions = {
      zoom: 14,
      center: new google.maps.LatLng(37.801, -122.28),
      styles: FuzzAppMapStyles,
      mapTypeControl: false,
      streetViewControl: false,
      scrollwheel: false
    };
  }

  window.sightingsMap = new google.maps.Map(sightingsMapDOM, mapOptions);

  var lostPostMapDOM = $('.fuzzfinders-app .mainpage-wrapper .lost-pet-post-wrapper .section-wrapper .map')[0],
    lostPostMap = new google.maps.Map(lostPostMapDOM, mapOptions),
    foundPostMapDOM = $('.fuzzfinders-app .mainpage-wrapper .found-pet-post-wrapper .section-wrapper .map')[0],
    foundPostMap = new google.maps.Map(foundPostMapDOM, mapOptions),
    polyCoordinates = [];


  $(function () {


    google.maps.event.addListenerOnce(sightingsMap, 'idle', function () {
      getReports(sightingsMap, updateMap)

      sightingsMap.addListener('center_changed', function () {
        getReports(sightingsMap, updateMap)
      });

      sightingsMap.addListener('zoom_changed', function () {
        getReports(sightingsMap, updateMap)
      });
    });

    var lost = [], found = [];
    $('[data-type="lost"]').each(function (i, coord) {
      lost.push({
        id: $(coord).data('report-id'),
        type: $(coord).data('type'),
        lat: $(coord).data('lat'),
        lng: $(coord).data('lng')
      });
    });

    $('[data-type="found"]').each(function (i, coord) {
      found.push({
        id: $(coord).data('report-id'),
        type: $(coord).data('type'),
        lat: $(coord).data('lat'),
        lng: $(coord).data('lng')
      })
    })

    lost.forEach(function (item, i) {
      if (item.lat && item.lng) {
        var marker = new google.maps.Marker({
          position: item,
          map: sightingsMap,
          icon: '/img/app/map/lost-pin.png',
          draggable: false,
          opacity: (10 - i) / 10
        });

        marker.addListener('click', showReport.bind(null, item));

        polyCoordinates.push(item);
      }
    });

    found.forEach(function (item, i) {
      if (item.lat && item.lng) {
        var marker = new google.maps.Marker({
          position: item,
          map: sightingsMap,
          icon: '/img/app/map/found-pin.png',
          draggable: false,
          opacity: (10 - i) / 10
        });

        marker.addListener('click', showReport.bind(null, item));
      }
    })
  })

  var lostPostMapPath = new google.maps.Polyline({
      path: polyCoordinates,
      geodesic: true,
      strokeColor: '#E2573B',
      strokeOpacity: 1.0,
      strokeWeight: 3,
      map: lostPostMap
    }),

    foundPostMapPath = new google.maps.Polyline({
      path: polyCoordinates,
      geodesic: true,
      strokeColor: '#1E9F84',
      strokeOpacity: 1.0,
      strokeWeight: 3,
      map: foundPostMap
    });


  var circleSymbol = {
      path: google.maps.SymbolPath.CIRCLE,
      fillOpacity: 1,
      fillColor: '#E2573B',
      scale: 7,
      strokeColor: '#E2573B'
    },
    circleStartSymbol = {
      path: google.maps.SymbolPath.CIRCLE,
      fillOpacity: 1,
      fillColor: '#FFF',
      scale: 9,
      strokeColor: '#E2573B'
    },
    circleSymbolAlt = {
      path: google.maps.SymbolPath.CIRCLE,
      fillOpacity: 1,
      fillColor: '#1E9F84',
      scale: 7,
      strokeColor: '#1E9F84'
    },
    circleStartSymbolAlt = {
      path: google.maps.SymbolPath.CIRCLE,
      fillOpacity: 1,
      fillColor: '#FFF',
      scale: 9,
      strokeColor: '#1E9F84'
    };

  /*
   arrayCoodinates1.forEach(function (item, i) {

   if (i === 0) {
   new MarkerWithLabel({
   position: {lat: item[0], lng: item[1]},
   map: lostPostMap,
   icon: circleStartSymbol,
   draggable: false
   });
   new MarkerWithLabel({
   position: {lat: item[0], lng: item[1]},
   map: foundPostMap,
   icon: circleStartSymbolAlt,
   draggable: false
   });
   } else {
   new google.maps.Marker({
   position: {lat: item[0], lng: item[1]},
   map: lostPostMap,
   icon: circleSymbol,
   draggable: false,

   label: i.toString()
   });
   new google.maps.Marker({
   position: {lat: item[0], lng: item[1]},
   map: foundPostMap,
   icon: circleSymbolAlt,
   draggable: false,

   label: i.toString()
   });
   }

   });
   */
};

google.maps.event.addDomListener(window, 'load', initMap2);


// Edits after march 23

function initMap() {
  autosize($(".fuzzfinders-app .ancete-wrapper .step-wrapper-3 .textarea"));
  autosize($(".fuzzfinders-app .post-comment .textarea"));
  $.mask.definitions['A'] = '[APap]';
  $.mask.definitions['1'] = '[01]';
  $.mask.definitions['3'] = '[0123]';
  $.mask.definitions['5'] = '[012345]';
  $('.fuzzfinders-app .last-seen-custom input').mask(
    "19/39 19:59 AM",
    {
      autoclear: false,
      completed: function () {
        var inputDate = this.val(),
          mm = parseInt(inputDate.substring(0, 2)),
          dd = parseInt(inputDate.substring(3, 5)),
          h = parseInt(inputDate.substring(6, 8)),
          m = parseInt(inputDate.substring(9, 11));
        am = inputDate.substring(12)

        mm = mm <= 12 ? mm : 12;
        dd = dd <= 31 ? mm : 31;
        h = h <= 12 ? h : 12;
        m = m <= 59 ? m : 59;
        am = am.toUpperCase();
        this.val(mm + '/' + dd + ' ' + h + ':' + m + ' ' + am);

      }
    });


  var lostPostMapDOM = $('.fuzzfinders-app .mainpage-wrapper .lost-pet-post-wrapper .location-wrapper .map')[0],
    mapOptions = {
      zoom: 14,
      center: new google.maps.LatLng(37.801, -122.28),
      styles: FuzzAppMapStyles,
      mapTypeControl: false,
      streetViewControl: false,
      scrollwheel: false
    },
    lostPostMap = new google.maps.Map(lostPostMapDOM, mapOptions),
    lostPostMarker = new google.maps.Marker({
      position: {lat: 37.802, lng: -122.28},
      map: lostPostMap,
      icon: '/img/app/map/lost-pin.png',
      draggable: true
    }),

    foundPostMapDOM = $('.fuzzfinders-app .mainpage-wrapper .found-pet-post-wrapper .location-wrapper .map')[0],

    foundPostMap = new google.maps.Map(foundPostMapDOM, mapOptions),

    foundPostMarker = new google.maps.Marker({
      position: {lat: 37.802, lng: -122.28},
      map: foundPostMap,
      icon: '/img/app/map/found-pin.png',
      draggable: true
    });
};

google.maps.event.addDomListener(window, 'load', initMap);