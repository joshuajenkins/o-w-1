var COLORS = [
  'ECECEC', 'F7E7D9', 'A7A7A7', 'E0BD9E',
  '000000', 'CBE1FB', '8FC2FD', '3592FF',
  'E5CBFB', 'A38FFD', '9A35FF', '340290',
  '2A0055', 'FFFCCD', 'FCF690', 'FC9B93',
  'F55C6E', 'F5A623'
];

var renderColors = function() {
  var container = $('<ul/>');
  _.each(COLORS, function(color) {
    $('<li data-color="' + color + '" style="background-color: #' + color + '">' + '&nbsp;' + '</li>').appendTo(container);
  });
  return container;
};

var sending = function() {
  $('ul').remove();
  $('body').append('<h2>One sec...</h2>');
}

var thanks = function() {
  $('h2').text('Thanks, good lookin&rsquo;. Have a nice day.');
}

var bindEvents = function() {
  $('li').on('click', function() {
    sending();
    var color = $(this).data('color');
    var data = localStorage['o-w.weatherData'];
    $.ajax({
      url: '/survey/post',
      data: {
        color: color,
        data: data
      },
      method: 'POST',
      success: thanks
    });
  });
}

$(document).ready(function() {
  var colorList = renderColors();
  $('body').append(colorList);
  bindEvents();
});