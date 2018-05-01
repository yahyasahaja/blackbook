"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//SQL
// import sql from './connection'
// import moment from 'moment'

/*
drop table DepartmentLocations
drop table DeptManagedByEmployees
drop table EmployeeWorksOnProjects
drop table Projects
drop table Names
drop table Employees
drop table Departments
drop table Dependents

*/

//SEEDS
exports.default = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, undefined);
}));

// function printPrototype(obj, i) {
//   var n = Number(i || 0)
//   var indent = Array(2 + n).join('-')

//   for (var key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       console.log(indent, key, ': ', obj[key])
//     }
//   }

//   if (obj) {
//     if (Object.getPrototypeOf) {
//       printPrototype(Object.getPrototypeOf(obj), n + 1)
//     } else if (obj.__proto__) {
//       printPrototype(obj.__proto__, n + 1)
//     }
//   }
// }