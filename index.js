var express = require('express'),
    mustache = require('mustache-express'),
    http = require('http'),
    path = require('path'),
    rest = require('restler'),
    mongodb = require('mongodb'),
    bodyParser = require('body-parser');

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
  res.render('survey.mustache');
});

var database = function(callback) {
  var db;
  if (!db) {
    mongodb.MongoClient.connect('mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASS + '@ds061199.mongolab.com:61199/o-w-1', function(err, database) {
      db = database;
      callback(db);
    });
  } else {
    callback(db);
  }
};

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded()); 

app.post('/survey/post', function(req, res) {
  database(function(db) {
    var Colors = db.collection('colors');
    Colors.insert({
      color: req.body.color,
      data: req.body.data
    }, function() {
      res.send('success');
    });
  });
});

var port = process.env.PORT;
app.listen(port, function() {
  console.log('Listening on port ' + port);
});