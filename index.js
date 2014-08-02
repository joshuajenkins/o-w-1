var express = require('express'),
    mustache = require('mustache-express'),
    http = require('http'),
    path = require('path'),
    rest = require('restler');

http.createServer(express);
var app = express();

app.engine('mustache', mustache());
app.set('views', __dirname + '/views');
app.set('view engine', 'mustache');
app.use(express.static(__dirname + '/public'));

app.use(express.static(path.resolve(__dirname, '/public')));

app.get('/forecast/:latlng', function(req, res) {
  var requestURL = 'http://api.forecast.io/forecast/' + process.env.FORECAST_KEY + '/' + req.params.latlng;
  rest.get(requestURL).on('complete', function(result) {
    if (result instanceof Error) {
      res.send('Error:', result.message);
    } else {
      res.send(result);
    }
  });
});

app.get('/', function(req, res) {
  res.render('index.mustache');
});

var port = process.env.PORT;
app.listen(port, function() {
  console.log('Listening on port ' + port);
});