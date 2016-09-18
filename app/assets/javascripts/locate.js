if (typeof geolocator !== 'undefined') {

  var Locate = (function () {
    return new Promise(function (resolve, reject) {
      geolocator.config({
        language: "en",
        google: {
          version: "3",
          key: "AIzaSyDaLeywAepT480tGLGBfoSUyvhClCfD8YE"
        }
      });

      geolocator.setGeoIPSource({
        provider: 'freegeoip',
        url: 'https://freegeoip.net/json',
        callbackParam: 'callback',
        schema: {
          ip: 'ip',
          coords: {
            latitude: 'latitude',
            longitude: 'longitude'
          },
          address: {
            city: 'city',
            state: 'region_name',
            stateCode: 'region_code',
            postalCode: 'zip_code',
            countryCode: 'country_code',
            country: 'country_name',
            region: 'region_name'
          },
          timezone: {
            id: 'time_zone'
          }
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
        if (err) {
          return reject(err);
        }

        resolve({
          lat: location.coords.latitude,
          lng: location.coords.longitude
        });
      });
    })
  })()
};