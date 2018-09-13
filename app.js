const _ = require('lodash');
const Knex = require('knex');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var compression=require('compression');
var flash = require('express-flash');
const passport = require('passport');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const knexConfig = require('./knexfile');
const { Model } = require('objection');

var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var game = require('./routes/game');
var qotd = require('./routes/qotd');

const knex = Knex(knexConfig.development);

Model.knex(knex);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: "moisecret",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/auth', auth);
app.use('/game', game);
//app.use('/game/ans', game);
app.use('/qotd', qotd);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
