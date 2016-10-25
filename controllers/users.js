var User = require('../models/user');
var express = require('express');
var router = express.Router();

// GET /users
// Get a list of users

function getUsers(result){
  User.find({}, function(err, users) {
    if(err){
      result({
        err,
        success: false
      });
    }

    result({
      success: true,
      users
    });
  });
}

router.get('/', function(req, res) {
  getUsers(function(result){
    res.json(result);
  })
});

// GET /users/:id
// Get a user by ID
function getUserById(req, result){
  User.findOne({
    _id: req.params.id
  }, function(err, user) {
    if (err) {
      result({
        error: "Error reading user: " + err,
        success: false
      });
    }

    /*
    if (!user) {
      result({
        success: false,
        error: 'User not found'
      });
    }
    */

    result({
      success: true,
      user
    });
  });
}

router.get('/:id', function(req, res) {
  getUserById(req, function(result){
    res.json(result);
  });
});

function deleteUser(req, result){
  User.remove({
    _id: req.params.id
  }, function(err){
    if(err){
      result({
        error: "Error deleting user: " + err,
        success: false
      });
    }
    
    result({
      success: true
    });
  })
}

router.delete('/:id', function(req, res){
  deleteUser(req, function(result){
    res.json(result);
  });  
});

function updateUser(req, result){
  console.log(req.body);
  User.findOne({
    _id: req.params.id != undefined ? req.params.id : req.body.id
  }, function(err, user){
    if(err){
      result({
        error: "Error updating user: " + err,
        success: false,
      });
    }

    if(!user){
      result({
        error: "User not found",
        success: false
      });
    }

    user.name = {
      first: req.body.first_name,
      last: req.body.last_name,
      title: req.body.title
    };

    user.location = {
      zip: req.body.zip,
      state: req.body.state,
      city: req.body.city,
      street: req.body.street
    }
    
    Object.assign(user, req.body).save(function(err){
      if(err){
        result({
          error: "Error updating user: " + err,
          success: false
        });
      }

      result({
        success: true,
        user
      });
    });
  });
}

router.put('/:id', function(req, res){
  updateUser(req, function(result){
    res.json(result);
  });
})

function insertUser(req, result){
  var newUser = new User(req.body);

  newUser.save(function(err, user){
    if(err){
      result({
        error: "Error inserting user: " + err,
        success: false
      });
    }

    result({
      success: true,
      user_id: user._id
    });
  });
}

router.post('/', function(req, res){
  insertUser(req, function(result){
    res.json(result);
  });  
});


module.exports = router;
module.exports.getUsers = getUsers;
module.exports.getUserById = getUserById;
module.exports.updateUser = updateUser;
module.exports.insertUser = insertUser;
module.exports.deleteUser = deleteUser;