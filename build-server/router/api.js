'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//INIT
//import Department from '../controller/Department'

var app = _express2.default.Router(); //MODULES

app.use(function (req, res, next) {
  res.header('Content-Type', 'application/json');
  next();
});

//ROUTER
//app.use('/departments', Department)

exports.default = app;