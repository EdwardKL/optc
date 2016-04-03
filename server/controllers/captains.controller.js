import CaptainModel from '../models/captain';
import UserModel from '../models/user';

// Adds (or edits) a captain.
exports.add = function(req, res) {
  if (typeof req.user == 'undefined') {
    req.flash('error_message', 'Please sign in.');
    res.redirect('/signup');
  }
  var account_id = req.body.account_id;
  var captain = new CaptainModel({
    current_level: req.body.current_level,
    current_special_level: req.body.current_special_level,
    _unit: req.body.unit_id,
    _user: req.user._id,
    current_sockets: []
  });
  for (var index in req.body.socket_types) {
    var socket = {
      _socket: req.body.socket_types[index],
      socket_level: req.body.socket_levels[index]
    }
    captain.current_sockets.push(socket);
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
      // Find the account.
      var account;
      for (var account_index in user.accounts) {
        if (user.accounts[account_index].id == account_id) {
          account = user.accounts[account_index];
          break;
        }
      }
      if (!account) {
        console.log("Could not find account for user: ", user);
        req.flash('error_message', 'There was an error. Please contact the owner.');
        res.redirect('/account');
        return;
      }
      // First save the captain.
      captain.save(function(err) {
        if (err) {
          console.log('Error saving captain: ' + err);
          throw err;
        } else {
          console.log('Successfully saved captain: ', captain);
        }
      });
      // Next update the reference in user.
      account._captains.push(captain._id);
      user.save(function(err) {
        if (err) {
          console.log('Error saving user: '+err);  
          throw err;  
        } else {
          console.log('Successfully added captain.');
          req.flash('info_message', 'Captain added.');
          res.redirect('/account');
          return;
        }
      });
    } else {
      req.flash('error_message', 'Please sign in.');
      res.redirect('/signup');
      return;
    }
  });
};
/*
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
};*/