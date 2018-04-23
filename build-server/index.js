'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _config = require('./config');

var _events = require('./events');

var _api = require('./router/api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//FIRST_CONFIG
var app = (0, _express2.default)();

//EVENTS
// @flow
//MODULES

var port = process.env.PORT || 5000;

//CONFIG
if (process.env.NODE_ENV === 'production') {
  app.use(function (req, res, next) {
    if (req.get('Host') && req.get('Host').indexOf('localhost') !== -1) return next();
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
  });
}

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') res.sendStatus(200);else next();
});
app.use((0, _morgan2.default)(_config.LOG_MODE));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));

//DATABASE
// import db from './db'

//API

app.use('/api', _api2.default);

//COMPRESSION
app.use((0, _compression2.default)());
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  //STATIC
  app.use(_express2.default.static(_path2.default.resolve('./build')));

  //REACT
  app.get('*', function (req, res) {
    res.sendFile(_path2.default.resolve('./build/index.html'));
  });
} else {
  //STATIC
  app.use(_express2.default.static('./public'));

  //REACT
  app.get('*', function (req, res) {
    res.sendFile(_path2.default.resolve('./public/index.html'));
  });
}

//ERROR_HANDLER
app.use(function (err, req, res /*, next*/) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({ error: err.message });
});

//LISTEN TO PORT
_events.events.on(_events.DB_CONNECTED, function () {
  app.listen(port, function () {
    return console.log('Server running at port ' + port);
  });
});
_events.events.emit(_events.DB_CONNECTED);