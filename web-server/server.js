var express      = require('express');
var favicon      = require('serve-favicon');
var mongoose 	   = require('mongoose');
var session      = require('express-session');
var MongoStore   = require('connect-mongo')(session);
var cookieParser = require('cookie-parser')
var uuid         = require('node-uuid');
var bodyParser   = require('body-parser');
var multer 	 	   = require('multer');
var errorHandler = require('errorhandler');
var flash        = require('express-flash');
var path     	   = require('path');
var morgan       = require('morgan');
var methodOverride = require('method-override');
var routes       = require('./routes');
//var passport       = require('passport');
//var Passport = require('./config/passport')(passport);
var app      	   = express();
//var core         = require('./app/modules/core.js');


var uristring =
//process.env.MONGOLAB_URI ||
'mongodb://heroku_x835z903:5ipvud73iqcvpgdavrf3q17l9n@ds053972.mongolab.com:53972/heroku_x835z903';

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

// all environments
app.set('env','dev');
app.set('view engine','ejs');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
console.log('View folder path: ' + path.join(__dirname, 'views'));
app.use(morgan(app.get('env')));
app.use(methodOverride());

var sessionMiddleware = session({
  //store: new MongoStore({mongooseConnection: mongoose.connection}),
  resave: true,
  saveUninitialized: true,
  genid: function(req) {
    return uuid.v1() // use UUIDs for session IDs
  },
  secret: 'asdD3nasdn32eD'
});

app.use(sessionMiddleware);
//app.use(passport.initialize());
//app.use(passport.session());
app.use(cookieParser());
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
console.log('static express path: ' + path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));

//require('./routes.js')(app, passport);
require('./routes.js')(app);
// error handling middleware should be loaded after the loading the routes
if ('dev' == app.get('env')) {
  app.use(errorHandler());
}

// launch ======================================================================
var server =
app.listen(app.get('port'), function(){
  console.log('Its time to pump up the jam! @ ' + app.get('port'));
});

//var io = require('socket.io').listen(server);
//io.use(function(socket, next) {
//    sessionMiddleware(socket.request, socket.request.res, next);
//});
//c = new core(io);
