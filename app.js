var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var morgan = require('morgan');
var path = require('path');
var marked = require('marked');
var fs = require('fs');
var logger = require('winston');
var userController = require('./controllers/users');
var bodyParser = require('body-parser');

var app = express();

// Add middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/documentation', function(req, res, err) { // eslint-disable-line no-unused-vars
  var md = function(filename) {
    var path = __dirname + "/" + filename;
    var include = fs.readFileSync(path, 'utf8');
    var html = marked(include);

    return html;
  };

  return res.render('index.ejs', {
    "md": md
  });
});

app.get('/', function(req, res){
  return res.render('users/index.ejs', {

  });
});

app.get('/users_list', function(req, res){
  userController.getUsers(function(result){
    res.render('users/user_list.ejs', {
      users: result.users
    });
  }); 
});

app.get('/user_add', function(req, res){
  res.render('users/user_add.ejs', {
    method: 'POST',
    form_method: 'POST',
    action: '/insert',
    user: ''
  });
});

app.get('/update/:id', function(req, res){
  userController.getUserById(req, function(result){
    res.render('users/user_form.ejs', {
      method: 'post',
      form_method: 'post',
      action: '/update',
      user: result.user
    });
  });
});

app.post('/update', function(req, res){
  userController.updateUser(req, function(result){
    res.render('users/user_form.ejs', {
      method: 'post',
      form_method: 'post',
      action: '/update',
      user: result.user
    });
  });
});

app.post('/insert', function(req, res){
  userController.insertUser(req, function(result){
    res.redirect('/users_list');
  });
});

app.get('/delete/:id', function(req, res){
  userController.deleteUser(req, function(result){
    res.redirect('/users_list');
  });
});

// See the User Controller for `/users` routes
app.use('/api/users', userController);


// Some switches for acceptance tests
if (require.main === module) {
  // Only connect to MongoDB if app.js is run
  // If require'd (e.g. in tests), let these tests establish a DB connection themselves
  mongoose.connect('mongodb://localhost/users');

  // Only listen when app.js is run - acceptance tests will listen on another port
  app.listen(8000, function() {
    logger.info('Listening at http://localhost:8000 - see here for API docs');
  });
}

module.exports = app;
