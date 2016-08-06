
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

	var mapOptions = {
		    zoom: 14,
		    center: new google.maps.LatLng(37.801, -122.28),
		    styles: FuzzAppMapStyles,
		    mapTypeControl: false,
		    streetViewControl: false,
		    scrollwheel: false
		},


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
		


		var lostPostMapDOM = $('.fuzzfinders-app .mainpage-wrapper .lost-pet-post-wrapper .section-wrapper .map')[0],
			lostPostMap = new google.maps.Map(lostPostMapDOM, mapOptions),
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
			} else {
				new google.maps.Marker({
	                position: {lat: item[0], lng: item[1]},
	                map: lostPostMap,
	                icon: circleSymbol,
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