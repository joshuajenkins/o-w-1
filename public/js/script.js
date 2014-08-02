var LAT = 37.7548095;
var LNG = -122.4279599;

var weatherData = (function() {
  var fetchURL = 'forecast/' + LAT + ',' + LNG,
      isCached = false;
      cacheTimeout = 3600000; // 1 hour

  var fetch = function(callback) {
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

  var get = function() {
    var promise = new Promise(function(resolve, reject) {
      checkCache();
      if (isCached) {
        resolve(cachedData());
      } else {
        fetch(function(freshData) {
          cache(freshData);
          resolve(freshData);
        });
      }
    });
    return promise;
  }

  return {
    'get': get
  }
}());

$(document).ready(function() {
  weatherData.get().then(function(weather) {
    $('body').append('<h2>' + weather.currently.apparentTemperature + '</h2>');
  });
});