$(function () {
  geolocator.config({
    language: "en",
    google: {
      version: "3",
      key: "AIzaSyDaLeywAepT480tGLGBfoSUyvhClCfD8YE"
    }
  });

  var options = {
    enableHighAccuracy: true,
    timeout: 6000,
    maximumAge: 0,
    desiredAccuracy: 30,
    fallbackToIP: true, // fallback to IP if Geolocation fails or rejected
    addressLookup: true,
    timezone: true,
  };

  geolocator.locate(options, function (err, location) {
    if (err) return console.log(err);
    localStorage.setItem('current_position', JSON.stringify({
      lat: location.coords.latitude,
      lng: location.coords.longitude
    }));

    window.geolocation = location;
  });
});
