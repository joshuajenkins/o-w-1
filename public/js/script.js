var geoIP = (function() {
  var lat,
      lng;

  var fetch = function(callback) {
    $.ajax({
      url: 'http://www.telize.com/geoip',
      dataType: 'JSONP',
      success: callback
    });
  }

  var get = function(callback) {
    if (!lat || !lng) {
      fetch(function(data) {
        lat = data.latitude;
        lng = data.longitude;
        return callback([lat, lng]);
      });
    } else {
      return callback([lat, lng]);
    }
  }

  return {
    'get': get
  }

}());

var weatherData = (function() {
  var isCached = false;
      cacheTimeout = 3600000; // 1 hour

  var fetch = function(latlng, callback) {
    var fetchURL = 'forecast/' + latlng[0] + ',' + latlng[1];
    $.get(fetchURL, function(data) {
      success: callback(data)
    });
  }

  var cache = function(data) {
    var timestamp = Date.now();
    localStorage['o-w.lastFetched'] = timestamp;
    localStorage['o-w.weatherData'] = JSON.stringify(data);
    isCached = true;
    console.log('Cached weather data');
  }

  var checkCache = function() {
    var now = Date.now();
    if (localStorage['o-w.lastFetched'] && localStorage['o-w.weatherData']) {
      isCached = (now < (parseInt(localStorage['o-w.lastFetched']) + cacheTimeout)) ? true : false;
    }
  }

  var cachedData = function() {
    return JSON.parse(localStorage['o-w.weatherData']);
  }

  var get = function(latlng, callback) {
    checkCache();
    if (isCached) {
      callback(cachedData());
    } else {
      fetch(latlng, function(freshData) {
        cache(freshData);
        callback(freshData);
      });
    }
  }

  return {
    'get': get
  }
}());

var app = (function() {

  var renderTemp = function(data) {
    $('body').append('<h2>' + data.currently.apparentTemperature + '</h2>');
  }

  var init = function() {
    geoIP.get(function(latlng) {
      weatherData.get(latlng, renderTemp);
    });
  }

  return {
    'init': init
  }

}());

$(document).ready(function() {
  app.init();
});