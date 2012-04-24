/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , Job = require("./job").Job
  , JobTracker = require("./jobTracker").JobTracker
  , Console = require("./console").Console
  , cradle = require('cradle');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.cookieParser());
  app.use(express.session({ secret: 'foobar' }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.set('view options', {layout: false});
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});




// couch db connnections
var conn = new(cradle.Connection)();
var db = conn.database('users');




// Index route
app.get('/', function(req, res){
  if (req.session && req.session.auth == true) {
    res.render('welcome', { name: req.session.uname });
  } else {
    res.render('index');
  }
});


// New user register route
app.post('/register', function(req, res){
  var data = req.body;

  // Check if username is in use
  db.get(data.username, function(err, doc) {
    if(doc) {
      res.render('index', {flash: 'Username is in use'});

    // Check if confirm password does not match
    } else if(data.password != data.confirm_password) {
      res.render('index', {flash: 'Password does not match'});

    // Create user in database
    } else {
      delete data.confirm_password;
      db.save(data.username, data,
        function(db_err, db_res) {
          res.render('index', {flash: 'User created, Please login'});
        });
    }
  });
});


// user login route
app.post('/login', function(req, res){
  var data = req.body;

  // Check if there is a corresponding user in db
  db.get(data.username,
    function(err, doc){
      if(!doc) {
        res.render('index', {flash: 'No user found'});

      // Check if passwords match
      } else if(doc.password != data.password) {
        res.render('index', {flash: 'Wrong password'});

      // User is logged in
      } else { 
        //res.render('index', {flash: 'Logged in!'}); 
        res.render('welcome', { name: data.username });
        req.session.auth = true;
        req.session.uname = data.username;
        res.render('welcome', { name: req.session.uname });
      }
  });
});


// user logout route
app.get('/logout', function(req, res){
  req.session.destroy();
  res.render('index');
});

// server log
app.get('/console', function(req, res){
  res.sendfile(__dirname + '/public/server_console.html');
});


// vcf modules
var job = new Job("./job/job", "./job/data");
var jobTracker = new JobTracker(job); 



app.listen(3000);
console.log("Vapour Computing server listening on port %d in %s mode", app.address().port, app.settings.env);
