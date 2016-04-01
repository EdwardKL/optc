import CaptainModel from '../models/captain';
import UserModel from '../models/user';

// Adds an account.
exports.add = function(req, res) {
  if (typeof req.user == 'undefined') {
    req.flash('error_message', 'Please sign in.');
    res.redirect('/signup');
  }
  var account = req.body;
  console.log("adding account:", account);
  console.log("user", req.user);
  // Validation
  if (account.friend_id < 100000000 || account.friend_id > 999999999) {
    req.flash('error_message', 'Invalid friend ID.');
    res.redirect('/account');
  }
  if (account.region != 'japan' && account.region != 'global') {
    req.flash('error_message', 'Invalid region.');
    res.redirect('/account');
  }
  UserModel.findById(req.user._id, function(err, user) {
    // In case of any error return
    if (err){
      console.log('Error adding account: ' + err);
      req.flash('error_message', 'There was an error. Please contact the owner.');
      res.redirect('/account');
      return;
    }
    // Found user
    if (user) {
      var account_id = user.accounts.length;
      account.id = account_id;
      user.accounts.push(account);
      user.save(function(err) {
        if (err) {
          console.log('Error saving user: '+err);  
          throw err;  
        } else {
          console.log('Successfully added account: ', account);    
          req.flash('info_message', 'Account added.');
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
};

// Deletes an account.
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
};