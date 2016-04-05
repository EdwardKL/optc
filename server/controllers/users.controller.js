import CaptainModel from '../models/captain';
import UserModel from '../models/user';

exports.setUser = function(req, res) {
  console.log("setting user");
  if (typeof req.user == 'undefined') {
    req.flash('error_message', 'Please sign in.');
    res.redirect('/signup');
    return;
  }
  console.log("user defined");
  if (!req.user.username || req.user.username.length <= 1) {
    res.redirect('back');
    req.flash('error_message', 'Usernames must be at least 2 characters long.');
    return;
  }
  console.log("long enough user");
  if (!UserModel.validUsername(req.user.username)) {
    res.redirect('back');
    req.flash('error_message', 'Username contained invalid characters. Only alphanumeric, dash, and underscore characters are allowed.');
    return;
  }
  console.log("valid user");
  UserModel.findByUsername(req.body.username, function(err, user) {
    if (err) throw err;
    if (user) {
      console.log("user already exists");
      req.flash('error_message', 'Username already exists.');
      res.redirect('/auth/oauth-signup');
      return;
    }
    req.user.setUsername(req.body.username);
    console.log("username set");
    req.user.save(function(err) {
      if (err) throw err;
      console.log("Saved user");
      req.flash('info_message', 'Username set.');
      res.redirect('/');
      return;
    });
  });
};

// Edit password.
exports.editPass = function(req, res) {
  if (typeof req.user == 'undefined') {
    req.flash('error_message', 'Please sign in.');
    res.redirect('/signup');
    return;
  }
  // First make sure that the current pass is correct.
  if (!req.user.authenticate(req.body.current_password)) {
    req.flash('error_message', 'Wrong password.');
    res.redirect('/account');
    return;
  }
  if (req.body.password.length <= 3) {
    req.flash('error_message', 'Passwords must be at least 4 characters long.')
    res.redirect('/account');
    return;
  }
  if (req.body.password != req.body.password_confirmation) {
    req.flash('error_message', "New password doesn't match with confirmation.");
    res.redirect('/account');
    return;
  }
  UserModel.findById(req.user._id, function(err, user) {
    if (err) throw err;
    if (!user) throw err;
    user.password = req.body.password;
    user.updateCredentials();
    user.save(function(err) {
      if (err) throw err;
      req.flash('info_message', 'Password updated.');
      res.redirect('/account');
      return;
    });
  });
};

// Deletes a user.
exports.delete = function(req, res) {
  if (typeof req.user == 'undefined') {
    req.flash('error_message', 'Please sign in.');
    res.redirect('/signup');
    return;
  }
  // First delete any captains the user has.
  UserModel.findById(req.user._id, function(err, user) {
    // In case of any error return
    if (err){
      console.log('Error deleting user: ' + err);
      req.flash('error_message', 'There was an error. Please contact the owner.');
      res.redirect('/user');
      return;
    }
    if (!user) {
      console.log('Could not find user to update account for! User: ', req.user);
      req.flash('error_message', 'There was an error. Please contact the owner.');
      res.redirect('/account');
      return;
    }
    user.accounts.map(function(account) {
      account._captains.map(function(captain_id) {
        // Delete the captain.
        var callback = function(err, captain) {
          if (err) throw err;
        };
        CaptainModel.findById(captain_id).remove().exec(callback);
      });
    });
    // Delete the user.
    var callback = function(err, user) {
      if (err) throw err;
      console.log('Deleted user.');
      req.flash('info_message', "I can't believe you've done this.");
      res.redirect('/');
      return;
    };
    UserModel.findById(req.user._id).remove().exec(callback);
  });
};