var http = require('http');
var debug = require('debug')('authapp:server');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var MongoClient = require('mongodb').MongoClient
global.crypto = require('crypto');
global.mongoose = require("mongoose");
global.config = require('./config/config')
global.commonModule = require('./common/common');
global.uuid = require('uuid');
global.adminString = require("./common/adminString");
global.domain = require('./common/domain');
global.userObject = {};
var webRouter = require('./routes/web-router');


var app = express();
console.log(config.database)
// MongoClient.connect(config.database, { uri_decode_auth: true, useNewUrlParser: true }, function (err, db) {
//   if (err) {
//     console.log(err)
//   } else {
//     global.dbHandler = db
//     console.log("connect successfully to mongodb");
//   }
// })
mongoose.connect('mongodb://ds245210.mlab.com:45210/techifyapp',
  { user: 'pkm', pass: 'prashant@123' },
  function (err, db) {
    if (err) {
      console.log(err)
    } else {
      global.dbHandler = db
      console.log("connect successfully to mongodb");
    }
  });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/web', webRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(config.port);
server.on('error', onError);
server.on('listening', onListening);


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}



module.exports = app;
