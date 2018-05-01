'use strict';

var _events = require('./events');

var _connection = require('./connection');

var _connection2 = _interopRequireDefault(_connection);

var _seed = require('./seed');

var _seed2 = _interopRequireDefault(_seed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } //MODULES
// import Sequelize from 'sequelize'

//EVENTS


//CONNECTION


//MODELS
// import Employee from './model/Employee'

//MODEL_RELATIONS
// Employee.hasMany(Employee, {foreignKey: 'supervise_id'})

//SEEDS


var force = false;
//CONNECT
_connection2.default.sync({ force: force }).then(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('Database connection has been established successfuly');

          _events.events.emit(_events.DB_CONNECTED);
          if (force) (0, _seed2.default)();

        case 3:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}))).catch(function (err) {
  return console.log('Unable to connect to the database: ' + err);
});