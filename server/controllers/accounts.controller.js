import CaptainModel from '../models/captain';
import UserModel from '../models/user';

// Adds (or edits) an account.
exports.add = function(req, res) {
  if (typeof req.user == 'undefined') {
    req.flash('error_message', 'Please sign in.');
    res.redirect('/signup');
    return;
  }
  var account = req.body;
  console.log("adding account:", account);
  console.log("user", req.user);
  // Validation
  if (account.friend_id < 100000000 || account.friend_id > 999999999) {
    req.flash('error_message', 'Invalid friend ID.');
    res.redirect('/account');
    return;
  }
  if (account.region != 'japan' && account.region != 'global') {
    req.flash('error_message', 'Invalid region.');
    res.redirect('/account');
    return;
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
      if (account.id == -1) {
        var account_id = user.accounts.length;
        account.id = account_id;
      } else {
        // This is an edit, not an add request. Delete the old account and re-add the new one.
        var accounts = [];
        user.accounts.map(function(existing_account) {
          if (existing_account.id != account.id) accounts.push(existing_account);
        });
        user.accounts = accounts;
      }
      user.accounts.push(account);
      user.accounts.sort(function(a, b) { return a.id - b.id });
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
    return;
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
      var account_to_remove;
      user.accounts.map(function(account) {
        if (account.id != account_id) accounts.push(account);
        else account_to_remove = account;
      });
      account_to_remove._captains.map(function(captain_id) {
        // Delete the captain.
        var callback = function(err, captain) {
          if (err) throw err;
        };
        CaptainModel.findById(captain_id).remove().exec(callback);
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