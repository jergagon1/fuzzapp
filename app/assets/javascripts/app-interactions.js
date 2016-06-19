  alert('hui');


$('.nav-trigger').click(function(){
  $('.menu-navigation').toggleClass('open');
});

$('.menu-navigation .extra-area').click(function(){
  $('.menu-navigation').toggleClass('open');
});

$('.custom-date-trigger').click(function(e){
  e.preventDefault();
  var a = $(this).parents('.Pet-description') //.addClass('custom-date-input');
  console.log(a);
});

// SECTIONS AND ANCETE INTERACTIONS

var navigationStack = [];

function getNavigationToggler(target) {
  if (target.indexOf('.lost-pet-')> -1) {
    return 'navigation-orange';
  } else if (target.indexOf('.found-pet-')> -1) {
    return 'navigation-green';
  } else if (target.indexOf('.pet-sightings-')> -1) {
    return 'navigation-blue-light';
  } else if (target.indexOf('.fuzz-chat')> -1) {
    return 'navigation-blue-dark';
  } else {return null;}
}

$('.btn-toggler, .btn-apply').click( function() {
  var target = $(this).data('target');
  var tClass = $(this).data('toggle');
  $(target).toggleClass(tClass);

  navigationStack.push([target, tClass]);
  $('body').scrollTop(0);
  $(target).parent().scrollTop(0);

  var navigationClass = getNavigationToggler(target);
  if (navigationClass && (tClass === 'show')) {
    if(target.indexOf('post-wrapper')>-1) {
      $('.fuzzfinders-app').removeClass('navigation-blue-light');
      $('.fuzzfinders-app .pet-sightings-page-wrapper').addClass('post-shown');
    }
    $('.fuzzfinders-app').addClass(navigationClass);
  }
});

$('.back-arrow').click(function() {
  var lastTransition = navigationStack.pop();
  var target = lastTransition[0];
  var tClass = lastTransition[1];

  $(target).toggleClass(tClass);
  $('body').scrollTop(0);

  var navigationClass = getNavigationToggler(target);
  if (navigationClass && (tClass === 'show')) {
    if(target.indexOf('post-wrapper')>-1) {
      $('.fuzzfinders-app').addClass('navigation-blue-light');
      $('.fuzzfinders-app .pet-sightings-page-wrapper').removeClass('post-shown');
    }
    $('.fuzzfinders-app').removeClass(navigationClass);
  }
  if ( ($( window ).width()>1024)&&($( window ).height()>640) ) { $('.show .ancete-wrapper').height(300); }
  $('.show .ancete-wrapper').height(300);
});

// SHOW DROPDOWN AREA IN ANCETE AND SIGHTS SCREEN
$('.btn-subarea').click( function (){
  //event.preventDefault();
  var holder = $(this).parent();
  $(holder).toggleClass('extra-open');
});


// FINISH THE ANCETE

function turnTransition(target, tClass) {
  $(target).toggleClass(tClass);
  if (tClass==='show'){ $(target+' .nav-block').removeClass('fixed-menu');}

  var navigationClass = getNavigationToggler(target);
  if (navigationClass && (tClass === 'show')) {
    $('.fuzzfinders-app').removeClass(navigationClass);
  }
}

$('.btn-submit').click(function(){
  var backStap = true;
  var targetObject = $(this).data('target');
  var lastTransition,
    target,
    tClass,
    backStack = [];
  $('.mainpage-wrapper').scrollTop(0);
  while (backStap)
  {
    lastTransition = navigationStack.pop();
    target = lastTransition[0];
    tClass = lastTransition[1];
    if (target === targetObject) { backStap = false; }
    else { backStack.push(lastTransition);}
  }

  turnTransition(lastTransition[0],lastTransition[1]);
  setTimeout(function(){
      backStack.forEach(function(item){turnTransition(item[0],item[1]);});
    }, 600);

  setTimeout(function(){ $('.ancete-wrapper').removeAttr('style');
    }, 650);

  $('body').scrollTop(0);
});


$(window).load(function(){
  $('*[class^="step-wrapper-"]').on('mresize', function(){
    var ancete = $(this).parent();
    var active;
    if (ancete.hasClass('step-1')) { active = ancete.children('step-wrapper-1'); }
    else if (ancete.hasClass('step-2')) { active = ancete.children('step-wrapper-2'); }
    else if (ancete.hasClass('step-3')) { active = ancete.children('step-wrapper-3'); }

    ancete.height($(this).height()+32);


  });
});


//********************************************************************************************************************************
//********************************************************************************************************************************
//********************************************************************************************************************************
// Ниже я в основном занимаюсь настройкой карты. Если хочешь — можешь посмотреть что тут и как, нет — просто я тебе расскажу что нужно
// на каждом из этапов работы приложения сгенерировать
//********************************************************************************************************************************
//********************************************************************************************************************************
//********************************************************************************************************************************


var FuzzAppMapStyles = [
  {"featureType":"landscape.man_made",
   "elementType":"geometry",
   "stylers":[{"color":"#f7f1df"}]},
    {
      "featureType":"landscape.natural",
      "elementType":"geometry",
      "stylers":[{"color":"#d0e3b4"}]
    },
    {
      "featureType":"landscape.natural.terrain",
      "elementType":"geometry",
      "stylers":[{"visibility":"off"}]
    },
    {
      "featureType":"poi",
      "elementType":"labels",
      "stylers":[{"visibility":"off"}]
    },
    {
      "featureType":"poi.business",
      "elementType":"all",
      "stylers":[{"visibility":"off"}]
    },
    {
      "featureType":"poi.medical",
      "elementType":"geometry",
      "stylers":[{"color":"#fbd3da"}]
    },
    {
      "featureType":"poi.park",
      "elementType":"geometry",
      "stylers":[{"color":"#bde6ab"}]
    },
    {
      "featureType":"road",
      "elementType":"geometry.stroke",
      "stylers":[{"visibility":"off"}]
    },
    {
      "featureType":"road",
      "elementType":"labels",
      "stylers":[{"visibility":"off"}]
    },
    {
      "featureType":"road.highway",
      "elementType":"geometry.fill",
      "stylers":[{"color":"#ffe15f"}]
    },
    {
      "featureType":"road.highway",
      "elementType":"geometry.stroke",
      "stylers":[{"color":"#efd151"}]
    },
    {
      "featureType":"road.arterial",
      "elementType":"geometry.fill",
      "stylers":[{"color":"#ffffff"}]
    },
    {
      "featureType":"road.local",
      "elementType":"geometry.fill",
      "stylers":[{"color":"black"}]
    },
    {
      "featureType":"transit.station.airport",
      "elementType":"geometry.fill",
      "stylers":[{"color":"#cfb2db"}]
    },
    {
      "featureType":"water",
      "elementType":"geometry",
      "stylers":[{"color":"#a2daf2"}]
    }];


$(document).ready(function(){

  var lostPetMapDOM = $('.fuzzfinders-app .mainpage-wrapper .lost-pet-page-wrapper .section-wrapper .ancete-wrapper .step-wrapper-2 .map')[0],

    mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(37.801, -122.28),
        styles: FuzzAppMapStyles,
        mapTypeControl: false,
        streetViewControl: false,
        scrollwheel: false
    },

    lostPetMap = new google.maps.Map(lostPetMapDOM, mapOptions),

    lostPetMarker = new google.maps.Marker({
      position: {lat: 37.802, lng: -122.28},
      map: lostPetMap,
      icon: '/img/app/map/lost-pin.png',
      draggable: true
    }),

    foundPetMapDOM = $('.fuzzfinders-app .mainpage-wrapper .found-pet-page-wrapper .section-wrapper .ancete-wrapper .step-wrapper-2 .map')[0],

    foundPetMap = new google.maps.Map(foundPetMapDOM, mapOptions),

    foundPetMarker = new google.maps.Marker({
      position: {lat: 37.802, lng: -122.28},
      map: foundPetMap,
      icon: '/img/app/map/found-pin.png',
      draggable: true
    }),


    sightingsMapDOM = $('.fuzzfinders-app .mainpage-wrapper .pet-sightings-page-wrapper .section-wrapper .map')[0],

    sightingsMap = new google.maps.Map(sightingsMapDOM, mapOptions),

    arrayCoodinates1 = [
    [37.807560843059925, -122.27261856079099],
    [37.80762865563491,  -122.28343322753904],
    [37.803627607163115, -122.28180244445798],
    [37.796438738238166, -122.28506401062009],
    [37.79589615369872,  -122.298196105957]
    ],

    arrayCoodinates2 = [
    [37.80810334191614, -122.29553535461423],
    [37.80444139729422,  -122.28617980957029],
    [37.79569268346904, -122.27133110046384]
    ];

    arrayCoodinates1.forEach( function (item, i) {
      new google.maps.Marker({
                position: {lat: item[0], lng: item[1]},
                map: sightingsMap,
                icon: '/img/app/map/lost-pin.png',
                draggable: false,
                opacity: (10-i)/10
            });
    });

    arrayCoodinates2.forEach( function (item, i) {
      new google.maps.Marker({
                position: {lat: item[0], lng: item[1]},
                map: sightingsMap,
                icon: '/img/app/map/found-pin.png',
                draggable: false,
                opacity: (10-i)/10
            });
    });


    var lostPostMapDOM = $('.fuzzfinders-app .mainpage-wrapper .lost-pet-post-wrapper .section-wrapper .map')[0],

      lostPostMap = new google.maps.Map(lostPostMapDOM, mapOptions),

      foundPostMapDOM = $('.fuzzfinders-app .mainpage-wrapper .found-pet-post-wrapper .section-wrapper .map')[0],

      foundPostMap = new google.maps.Map(foundPostMapDOM, mapOptions),

      polyCoordinates = [];

    arrayCoodinates1.forEach( function (item) {
      polyCoordinates.push({lat: item[0], lng: item[1]});
    });

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



    arrayCoodinates1.forEach( function (item, i) {

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






});




// Edits after march 23

$(document).ready(function(){
  autosize($(".fuzzfinders-app .ancete-wrapper .step-wrapper-3 .textarea"));
  autosize($(".fuzzfinders-app .post-comment .textarea"));
  $.mask.definitions['A']='[APap]';
  $.mask.definitions['1']='[01]';
  $.mask.definitions['3']='[0123]';
  $.mask.definitions['5']='[012345]';
  $('.fuzzfinders-app .last-seen-custom input').mask(
    "19/39 19:59 AM",
    {
      autoclear: false,
      completed: function(){
        var inputDate = this.val(),
          mm = parseInt(inputDate.substring(0,2)),
          dd = parseInt(inputDate.substring(3,5)),
          h = parseInt(inputDate.substring(6,8)),
          m = parseInt(inputDate.substring(9,11));
          am = inputDate.substring(12)

        mm = mm<=12 ? mm : 12;
        dd = dd<=31 ? mm : 31;
        h = h<=12 ? h : 12;
        m = m<=59 ? m : 59;
        am = am.toUpperCase();
        this.val(mm+'/'+dd+' '+h+':'+m+' '+am);

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
});








//Dropdown interaction

$('.dropdown .dropdown-menu li a').click(function(){
  var $a = $(this),
    $aText = $(this).text(),
    counter = 0;
  while ($aText[counter] === String.fromCharCode(160)) { counter++;}
  $aText = $aText.substring(counter);
  $a.parents('.dropdown').find('.dropdown-toggle').text($aText);
});

$('.custom-date-trigger').click(function(){
  $(this).parents('form').addClass('custom-date');
});


//Alerts workflow

$( document ).ready(function(){

  function showAlert(type) {
    $('.alert-wrapper'+type).addClass('show');
    setTimeout(function(){
      $('.alert-wrapper'+type).removeClass('show');
    }, 15000);
  }
  var lostPetTiker = setTimeout(function lostshow() {
    showAlert('.lost-pet')
    lostPetTiker = setTimeout(lostshow, 120000);
  }, 5000);

  var foundPetTiker = setTimeout(function foundshow() {
    showAlert('.found-pet')
    foundPetTiker = setTimeout(foundshow, 120000);
  }, 60000);

});

$( '.fuzz-alert .close' ).click(function(){
  $(this).parents('.alert-wrapper').removeClass('show');
})


$(window).resize(function(){
  var boffset = $('.mainpage-wrapper .content-wrapper .btn-toggler:first').offset().left,
    dwidth = $(window).width();
  if (dwidth < 1025) {
    $('.alert-wrapper').width( $(window).width()-boffset+3);
  }

})

//FAQ workflow

$(document).on('click', '.question-button', function (e) {
  e.preventDefault();
        $(this).parent().toggleClass('show').children('.question-content').collapse('toggle')
});

//Social connect buttons
$('.social-buttons .to-connect, .social-buttons .connected').click(function(){
  $(this).toggleClass('to-connect').toggleClass('connected');
})