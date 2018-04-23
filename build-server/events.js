'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DB_CONNECTED = exports.events = undefined;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//INIT
var events = exports.events = new _events2.default();

//EVENT_NAMES
//MODULES
var DB_CONNECTED = exports.DB_CONNECTED = 'dbConnected';

//DEFAULT
exports.default = {
  events: events,
  DB_CONNECTED: DB_CONNECTED
};