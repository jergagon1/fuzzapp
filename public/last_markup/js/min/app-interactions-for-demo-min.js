$(".nav-trigger").click(function(){$(".menu-navigation").toggleClass("open")}),$(".menu-navigation .extra-area").click(function(){$(".menu-navigation").toggleClass("open")}),$(".custom-date-trigger").click(function(e){e.preventDefault();var t=$(this).parents(".Pet-description");console.log(t)});var FuzzAppMapStyles=[{featureType:"landscape.man_made",elementType:"geometry",stylers:[{color:"#f7f1df"}]},{featureType:"landscape.natural",elementType:"geometry",stylers:[{color:"#d0e3b4"}]},{featureType:"landscape.natural.terrain",elementType:"geometry",stylers:[{visibility:"off"}]},{featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi.business",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"poi.medical",elementType:"geometry",stylers:[{color:"#fbd3da"}]},{featureType:"poi.park",elementType:"geometry",stylers:[{color:"#bde6ab"}]},{featureType:"road",elementType:"geometry.stroke",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#ffe15f"}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#efd151"}]},{featureType:"road.arterial",elementType:"geometry.fill",stylers:[{color:"#ffffff"}]},{featureType:"road.local",elementType:"geometry.fill",stylers:[{color:"black"}]},{featureType:"transit.station.airport",elementType:"geometry.fill",stylers:[{color:"#cfb2db"}]},{featureType:"water",elementType:"geometry",stylers:[{color:"#a2daf2"}]}];$(document).ready(function(){var e={zoom:14,center:new google.maps.LatLng(37.801,-122.28),styles:FuzzAppMapStyles,mapTypeControl:!1,streetViewControl:!1,scrollwheel:!1},t=[[37.807560843059925,-122.27261856079099],[37.80762865563491,-122.28343322753904],[37.803627607163115,-122.28180244445798],[37.796438738238166,-122.28506401062009],[37.79589615369872,-122.298196105957]],o=[[37.80810334191614,-122.29553535461423],[37.80444139729422,-122.28617980957029],[37.79569268346904,-122.27133110046384]],a=$(".fuzzfinders-app .mainpage-wrapper .lost-pet-post-wrapper .section-wrapper .map")[0],r=new google.maps.Map(a,e),l=[];t.forEach(function(e){l.push({lat:e[0],lng:e[1]})});var p=new google.maps.Polyline({path:l,geodesic:!0,strokeColor:"#E2573B",strokeOpacity:1,strokeWeight:3,map:r}),s={path:google.maps.SymbolPath.CIRCLE,fillOpacity:1,fillColor:"#E2573B",scale:7,strokeColor:"#E2573B"},n={path:google.maps.SymbolPath.CIRCLE,fillOpacity:1,fillColor:"#FFF",scale:9,strokeColor:"#E2573B"},i={path:google.maps.SymbolPath.CIRCLE,fillOpacity:1,fillColor:"#1E9F84",scale:7,strokeColor:"#1E9F84"},f={path:google.maps.SymbolPath.CIRCLE,fillOpacity:1,fillColor:"#FFF",scale:9,strokeColor:"#1E9F84"};t.forEach(function(e,t){0===t?new MarkerWithLabel({position:{lat:e[0],lng:e[1]},map:r,icon:n,draggable:!1}):new google.maps.Marker({position:{lat:e[0],lng:e[1]},map:r,icon:s,draggable:!1,label:t.toString()})})}),$(document).ready(function(){autosize($(".fuzzfinders-app .ancete-wrapper .step-wrapper-3 .textarea")),autosize($(".fuzzfinders-app .post-comment .textarea")),$.mask.definitions.A="[APap]",$.mask.definitions[1]="[01]",$.mask.definitions[3]="[0123]",$.mask.definitions[5]="[012345]",$(".fuzzfinders-app .last-seen-custom input").mask("19/39 19:59 AM",{autoclear:!1,completed:function(){var e=this.val(),t=parseInt(e.substring(0,2)),o=parseInt(e.substring(3,5)),a=parseInt(e.substring(6,8)),r=parseInt(e.substring(9,11));am=e.substring(12),t=12>=t?t:12,o=31>=o?t:31,a=12>=a?a:12,r=59>=r?r:59,am=am.toUpperCase(),this.val(t+"/"+o+" "+a+":"+r+" "+am)}});var e=$(".fuzzfinders-app .mainpage-wrapper .lost-pet-post-wrapper .location-wrapper .map")[0],t={zoom:14,center:new google.maps.LatLng(37.801,-122.28),styles:FuzzAppMapStyles,mapTypeControl:!1,streetViewControl:!1,scrollwheel:!1},o=new google.maps.Map(e,t),a=new google.maps.Marker({position:{lat:37.802,lng:-122.28},map:o,icon:"/img/app/map/lost-pin.png",draggable:!0}),r=$(".fuzzfinders-app .mainpage-wrapper .found-pet-post-wrapper .location-wrapper .map")[0],l=new google.maps.Map(r,t),p=new google.maps.Marker({position:{lat:37.802,lng:-122.28},map:l,icon:"/img/app/map/found-pin.png",draggable:!0})}),$(".dropdown .dropdown-menu li a").click(function(){for(var e=$(this),t=$(this).text(),o=0;t[o]===String.fromCharCode(160);)o++;t=t.substring(o),e.parents(".dropdown").find(".dropdown-toggle").text(t)}),$(".custom-date-trigger").click(function(){$(this).parents("form").addClass("custom-date")}),$(document).ready(function(){function e(e){$(".alert-wrapper"+e).addClass("show"),setTimeout(function(){$(".alert-wrapper"+e).removeClass("show")},15e3)}var t=setTimeout(function a(){e(".lost-pet"),t=setTimeout(a,12e4)},5e3),o=setTimeout(function r(){e(".found-pet"),o=setTimeout(r,12e4)},6e4)}),$(".fuzz-alert .close").click(function(){$(this).parents(".alert-wrapper").removeClass("show")}),$(window).resize(function(){var e=$(".mainpage-wrapper .content-wrapper .btn-toggler:first").offset().left,t=$(window).width();1025>t&&$(".alert-wrapper").width($(window).width()-e+3)}),$(document).on("click",".question-button",function(e){e.preventDefault(),$(this).parent().toggleClass("show").children(".question-content").collapse("toggle")});