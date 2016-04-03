import CaptainModel from '../models/captain';
import UserModel from '../models/user';

// Edit password.
exports.editpass = function(req, res) {
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
  if (req.body.password.length <= 4) {
    req.flash('error_message', 'Passwords must be at least 5 characters long.')
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
    });
  });
};
/*
// Deletes a user.
exports.delete = function(req, res) {
  if (typeof req.user == 'undefined') {
    req.flash('error_message', 'Please sign in.');
    res.redirect('/signup');
  }
  var account_id = req.params.id;
  UserModel.findById(req.user._id, function(err, user) {
    // In case of any error return
    if (err){
      console.log('Error deleting account: ' + err);
      req.flash('error_message', 'There was an error. Please contact the owner.');
      res.redirect('/account');
      return;
    }
    // Found user
    if (user) {
      var accounts = [];
      user.accounts.map(function(account) {
        if (account.id != account_id) accounts.push(account);
      });
      user.accounts = accounts;
      user.save(function(err) {
        if (err) {
          console.log('Error saving user: '+err);  
          throw err;  
        } else {
          console.log('Successfully deleted account.');    
          req.flash('info_message', 'Account deleted.');
          res.redirect('/account');
          return;
        }
      });
    } else {
      console.log('Could not find user to update account for! User: ', req.user);
      res.redirect('/account');
      return;
    }
  });
};*/