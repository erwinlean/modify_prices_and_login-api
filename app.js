"use strict";

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require ("./config/db");
const cors = require ("cors");
const corstData = require("./config/corsData.json");
const bodyParser = require('body-parser');
//const { sanitize } = require('express-sanitizer');

// Path routes
var indexRouter = require('./routes/index');
var pricesRouter = require('./routes/prices');
var usersRouter = require('./routes/users');
var profitsRouter = require("./routes/profits");

var app = express();

// Middleware body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middlewares
//app.use(sanitize());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// DB
app.use((req, res, next) => {
  req.db = db;
  console.log("DB working");
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/api/', indexRouter);
app.use('/api/prices', pricesRouter);
app.use('/api/users', usersRouter);
app.use('/api/profits', profitsRouter);

// Cors
const corsOptions = {
  origin: [`${corstData.web}`],
  methods: ['GET', 'POST'],
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  const allowedOrigins = [`${corstData.myIp}`];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
