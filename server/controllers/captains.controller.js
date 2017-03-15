import mongoose from 'mongoose';
import AccountModel from '../models/account';
import CaptainModel from '../models/captain';
import { getErrorMessage } from '../../errors/error_handler';
import ERROR_CODES from '../../constants/error_codes';
import { redirectIfLoggedOut, hasId, getNumber } from './utils';

// Returns sockets defined in the given request.
function getSocketsFromRequest(req) {
  const sockets = [];
  if (!req.body.socket_types) return sockets;
  if (typeof req.body.socket_types === 'object') {
    for (const index in req.body.socket_types) {
      if (!{}.hasOwnProperty.call(req.body.socket_types, index)) continue;
      const socket = {
        _socket: req.body.socket_types[index],
        socket_level: req.body.socket_levels[index],
      };
      sockets.push(socket);
    }
  } else {
    const socket = {
      _socket: req.body.socket_types,
      socket_level: req.body.socket_levels,
    };
    sockets.push(socket);
  }
  return sockets;
}

// Returns a captain model constructed from data in the given request.
function getCaptainFromRequest(req, account) {
  const id = req.body.captain_id ? mongoose.Types.ObjectId(req.body.captain_id) : mongoose.Types.ObjectId();
  const captain = new CaptainModel({
    _id: id,
    current_level: req.body.current_level,
    current_special_level: req.body.current_special_level,
    _unit: req.body.unit_id,
    _user: req.user._id,
    _account: account._id,
    region: account.region,
    current_hp_ccs: getNumber(req.body.current_hp_ccs),
    current_atk_ccs: getNumber(req.body.current_atk_ccs),
    current_rcv_ccs: getNumber(req.body.current_rcv_ccs),
    current_sockets: getSocketsFromRequest(req),
  });
  return captain;
}

// Validates that the input cotton candies are expected values, otherwise redirects user with an error message.
function validateCCs(captain, req, res, next) {
  const hp_ccs = captain.current_hp_ccs;
  const atk_ccs = captain.current_atk_ccs;
  const rcv_ccs = captain.current_rcv_ccs;
  if ((hp_ccs + atk_ccs + rcv_ccs) > 200) {
    req.flash('error_message', 'You can only have at most 200 cotton candies per unit.');
    res.redirect('/account');
    next();
    return false;
  }
  if (hp_ccs > 100 || atk_ccs > 100 || rcv_ccs > 100) {
    req.flash('error_message', 'You can only have at most 100 cotton candies per stat.');
    res.redirect('/account');
    next();
    return false;
  }
  return true;
}

// Adds (or edits) a captain.
exports.add = function add(req, res, next) {
  if (redirectIfLoggedOut(req, res, next)) return;
  AccountModel.findById(req.body.account_id, (account_err, account) => {
    // In case of any error return
    if (account_err) {
      console.error('Error adding captain, invalid id? Err: ', account_err, ', ID: ', req.body.account_id);
      req.flash('error_message', getErrorMessage(ERROR_CODES.CAPTAINS_ADD_ERROR_1));
      res.redirect('/account');
      next();
      return;
    }
    // Did not find account, e.g. missing account_id in request body...but that should never happen.
    /* istanbul ignore if */
    if (!account) {
      req.flash('error_message', getErrorMessage(ERROR_CODES.CAPTAINS_ADD_ERROR_2));
      res.redirect('/account');
      next();
      return;
    }
    const captain = getCaptainFromRequest(req, account);
    const hp_ccs = captain.current_hp_ccs;
    const atk_ccs = captain.current_atk_ccs;
    const rcv_ccs = captain.current_rcv_ccs;
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

    // Check if the captain already exists.
    const edit = hasId(account._captains, captain._id);
    const callback = (err) => {
      if (err) throw err;
      // We should only allow upsert (create object if it doesn't exist) if we are not editing.
      const options = { upsert: !edit };
      CaptainModel.findByIdAndUpdate(captain._id, captain, options, (captain_err) => {
        if (captain_err) throw captain_err;
        const action = edit ? 'edited' : 'added';
        req.flash('info_message', `Captain ${action}.`);
        res.redirect('/account');
        next();
        return;
      });
    };
    // Add the captain's id to the account if not present.
    if (edit) {
      callback();
    } else {
      account.update({ $push: { _captains: captain._id } }, (push_err) => {
        if (push_err) throw push_err;
        callback();
      });
    }
  });
};

// You can't delete someone else's account.
function redirectIfWrongUser(account_id, req, res, next) {
  if (hasId(req.user._accounts, account_id)) return false;
  req.flash('error_message', getErrorMessage(ERROR_CODES.CAPTAINS_DELETE_ERROR_4));
  res.redirect('/account');
  next();
  return true;
}

// Deletes a captain.
exports.delete = function delete_captain(req, res, next) {
  if (redirectIfLoggedOut(req, res, next)) return;
  const account_id = req.params.account_id;
  if (redirectIfWrongUser(account_id, req, res, next)) return;
  const captain_id = req.params.captain_id;
  AccountModel.findById(account_id, (account_err, account) => {
    // In case of any error return.
    // These errors should never happen (I can't even think of a way to test this),
    // so ignore it in coverage.
    /* istanbul ignore if */
    if (account_err) {
      console.error(`Error deleting captain: ${account_err}`);
      req.flash('error_message', getErrorMessage(ERROR_CODES.CAPTAINS_DELETE_ERROR_1));
      res.redirect('/account');
      next();
      return;
    }
    /* istanbul ignore if */
    if (!account) {
      console.log('Did not find account for id: ', account_id);
      req.flash('error_message', getErrorMessage(ERROR_CODES.CAPTAINS_DELETE_ERROR_2));
      res.redirect('/account');
      next();
      return;
    }
    if (!hasId(account._captains, captain_id)) {
      console.log(`Did not find captain for account. Captain id: ${captain_id}, account_id: ${account_id}`);
      req.flash('error_message', getErrorMessage(ERROR_CODES.CAPTAINS_DELETE_ERROR_3));
      res.redirect('/account');
      next();
      return;
    }
    account.update({ $pull: { _captains: captain_id } }, (pull_err) => {
      if (pull_err) throw pull_err;
      CaptainModel.findByIdAndRemove(captain_id, (captain_err) => {
        if (captain_err) throw captain_err;
        console.log('Successfully deleted captain.');
        req.flash('info_message', 'Captain deleted.');
        res.redirect('/account');
        next();
        return;
      });
    });
  });
};
