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

    if (!user) {
      result({
        success: false,
        error: 'User not found'
      });
    }

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

function deleteUser(req, res){
  User.remove({
    _id: req.params.id
  }, function(err){
    if(err){
      return res.status(500).json({
        error: "Error deleting user: " + err
      });
    }
    
    res.json({
      success: true
    });
  })
}

router.delete('/:id', function(req, res){
  deleteUser(req, res);  
});

function updateUser(req, res){
  User.findOne({
    _id: req.params.id
  }, function(err, user){
    if(err){
      return res.status(500).json({
        error: "Error updating user: " + err
      });
    }

    if(!user){
      return res.status(404).end()
    }

    if(req.body != undefined)
      user.name.first = req.body.first_name;
    
    user.save(function(err){
      if(err){
        return res.status(500).json({
          error: "Error updating user: " + err
        });
      }

      res.json({
        success: true
      });
    })
  });
}

router.put('/:id', function(req, res){
  updateUser(req, res);
})

function insertUser(req, res){
  var newUser = new User(req.body);

  newUser.save(function(err, user){
    if(err){
      return res.status(500).json({
        error: "Error inserting user: " + err
      });
    }

    if(!user){
      return res.status(404).end();
    }

    res.json({
      success: true,
      user_id: user._id
    });
  });
}

router.post('/', function(req, res){
  insertUser(req, res);  
});


module.exports = router;
module.exports.getUsers = getUsers;
