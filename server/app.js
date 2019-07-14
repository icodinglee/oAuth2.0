var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');// 会话
// 这个模块可以把会话数据放在mongo数据库中，这样即使应用服务器重启了，会话也不会丢失
const MongoStore = require('connect-mongo')(session);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var oauthRouter = require('./routes/oauth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'saddguiasidgauyigai',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: 'mongodb://localhost/oauth'
  })
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.user = req.session.user;
  next()
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/oauth2.0', oauthRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
