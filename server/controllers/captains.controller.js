import CaptainModel from '../models/captain';
import UserModel from '../models/user';
import { getErrorMessage } from '../../errors/error_handler';

function getNumber(num) {
  return num ? Number(num) : 0;
}

// Adds (or edits) a captain.
exports.add = function(req, res, next) {
  if (!req.user) {
    req.flash('error_message', 'Please sign in.');
    res.redirect('/signup');
    next();
    return;
  }
  var account_id = req.body.account_id;

  var hp_ccs = getNumber(req.body.current_hp_ccs);
  var atk_ccs = getNumber(req.body.current_atk_ccs);
  var rcv_ccs = getNumber(req.body.current_rcv_ccs);
  if ((hp_ccs + atk_ccs + rcv_ccs) > 200) {
    req.flash('error_message', 'You can only have at most 200 cotton candies per unit.');
    res.redirect('/account');
    next();
    return;
  }
  if (hp_ccs > 100 || atk_ccs > 100 || rcv_ccs > 100) {
    req.flash('error_message', 'You can only have at most 100 cotton candies per stat.');
    res.redirect('/account');
    next();
    return;
  }

  var captain = new CaptainModel({
    current_level: req.body.current_level,
    current_special_level: req.body.current_special_level,
    _unit: req.body.unit_id,
    _user: req.user._id,
    current_hp_ccs: hp_ccs,
    current_atk_ccs: atk_ccs,
    current_rcv_ccs: rcv_ccs,
    current_sockets: []
  });
  if (req.body.captain_id) {
    captain._id = req.body.captain_id;
  }
  if (req.body.socket_types) {
    if (typeof req.body.socket_types == 'object') {
      for (var index in req.body.socket_types) {
        var socket = {
          _socket: req.body.socket_types[index],
          socket_level: req.body.socket_levels[index]
        };
        captain.current_sockets.push(socket);
      }
    } else {
      var socket = {
        _socket: req.body.socket_types,
        socket_level: req.body.socket_levels
      };
      captain.current_sockets.push(socket);
      console.log("adding captain: ", captain);
    }
  }
  UserModel.findById(req.user._id, function(err, user) {
    // In case of any error return
    if (err){
      console.log('Error adding captain, invalid id? Err: ', err, ', ID: ', req.user._id);
      req.flash('error_message', getErrorMessage(0));
      res.redirect('/account');
      next();
      return;
    }
    // Did not find user, so ask to sign in.
    if (!user) {
      req.flash('error_message', 'Please sign in.');
      res.redirect('/signup');
      next();
      return;
    }
    // Found user.
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
      req.flash('error_message', getErrorMessage(1));
      res.redirect('/account');
      next();
      return;
    }
    // Check if the captain already exists.
    var edit = false;
    for (var index in account._captains) {
      if (captain._id.equals(account._captains[index])) {
        edit = true;
        break;
      }
    }
    if (edit) {
      CaptainModel.findById(captain._id, function(err, captain_to_save) {
        if (err) throw err;
        captain_to_save.current_level = captain.current_level;
        captain_to_save.current_special_level = captain.current_special_level;
        captain_to_save._unit = captain._unit;
        captain_to_save.current_sockets = captain.current_sockets;
        captain_to_save.current_hp_ccs = captain.current_hp_ccs;
        captain_to_save.current_atk_ccs = captain.current_atk_ccs;
        captain_to_save.current_rcv_ccs = captain.current_rcv_ccs;
        captain_to_save.save(function(err) {
          if (err) throw err;
          console.log('Successfully saved captain: ', captain_to_save);
        });
      });
    } else {
      // Save the captain.
      captain.save(function(err) {
        if (err) {
          console.log('Error saving captain: ' + err);
          throw err;
        } else {
          console.log('Successfully saved captain: ', captain);
        }
      });
    }
    // Update the reference in user if its new.
    if (!edit) account._captains.push(captain._id);
    user.save(function(err) {
      if (err) {
        console.log('Error saving user: '+err);  
        throw err;  
      } else {
        console.log('Successfully added/edited captain.');
        var message = edit ? 'Captain edited.' : 'Captain added.';
        req.flash('info_message', message);
        res.redirect('/account');
        next();
        return;
      }
    });
  });
};

// Deletes a captain.
exports.delete = function(req, res) {
  if (typeof req.user == 'undefined') {
    req.flash('error_message', 'Please sign in.');
    res.redirect('/signup');
    return;
  }
  var account_id = req.params.account_id;
  var captain_id = req.params.captain_id;
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
      var account;
      for (var index in user.accounts) {
        if (user.accounts[index].id == account_id) {
          account = user.accounts[index];
          break;
        }
      }
      if (!account) {
        console.log('Could not find account with id: ', account_id);
        return;
      }
      account._captains.splice(account._captains.indexOf(captain_id), 1);
      user.save(function(err) {
        if (err) {
          console.log('Error saving user: '+err);  
          throw err;  
        } else {
          console.log('Successfully deleted captain reference.');
          // Delete the captain.
          var callback = function(err, captain) {
            if (err) throw err;
            console.log('Deleted captain');
            req.flash('info_message', 'Captain deleted.');
            res.redirect('/account');
          };
          CaptainModel.findById(captain_id).remove().exec(callback);
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