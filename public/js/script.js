var LAT = 37.7548095;
var LNG = -122.4279599;

$(document).ready(function() {
  $.ajax({
    url: 'forecast/' + LAT + ',' + LNG,
    success: function(result) {
      $('body').append('<h2>' + result.currently.apparentTemperature + '</h2>');
    }
  });
});