import mongoose from 'mongoose';
import AccountModel from '../models/account';
import CaptainModel from '../models/captain';
import UserModel from '../models/user';
import { redirectIfLoggedOut, hasId } from './utils';
import { getErrorMessage } from '../../errors/error_handler';
import ERROR_CODES from '../../constants/error_codes';

// Makes sure that the request's body represents a valid account.
function validateRequest(req, res, next) {
  if (!req.body.friend_id || !req.body.region || !req.body.pirate_level) {
    req.flash('error_message', 'Empty fields are not allowed.');
    res.redirect('/account');
    next();
    return false;
  }
  if (req.body.friend_id < 100000000 || req.body.friend_id > 999999999) {
    req.flash('error_message', 'Invalid friend ID.');
    res.redirect('/account');
    next();
    return false;
  }
  if (req.body.region !== 'japan' && req.body.region !== 'global') {
    req.flash('error_message', 'Invalid region.');
    res.redirect('/account');
    next();
    return false;
  }
  if (req.body.pirate_level <= 0) {
    req.flash('error_message', 'Pirate level must be > 0.');
    res.redirect('/account');
    next();
    return false;
  }
  return true;
}

// Returns an update request object for update ops on accounts.
function getUpdateRequest(account) {
  return {
    pirate_level: account.pirate_level,
    friend_id: account.friend_id,
    region: account.region,
    crew_name: account.crew_name,
  };
}

exports.redirect = function redirect(req, res, next) {
  if (redirectIfLoggedOut(req, res, next)) return;
  res.redirect(`/account/${req.user.username}`);
  next();
  return;
};

exports.get = function get(req, res, next) {
  const username = UserModel.convertToUsername(req.params.username);
  UserModel
    .findOne({ username })
    .populate({ path: '_accounts',
                populate: {
                  path: '_captains',
                  model: 'Captain' } })
    .exec((err, user) => {
      if (err) throw err;
      user.clearSensitiveData();
      res.json(user);
      next();
      return;
    });
};

// Adds (or edits) an account.
exports.add = function add(req, res, next) {
  if (redirectIfLoggedOut(req, res, next)) return;
  if (!validateRequest(req, res, next)) return;
  const account = new AccountModel(req.body);
  if (req.body.account_id) account._id = new mongoose.Types.ObjectId(req.body.account_id);
  UserModel.findById(req.user._id, (user_err, user) => {
    // In case of any error return
    if (user_err) {
      console.log(`Error adding account: ${user_err}`);
      req.flash('error_message', getErrorMessage(ERROR_CODES.ACCOUNTS_ADD_ERROR_1));
      res.redirect('/account');
      next();
      return;
    }
    if (!user) {
      console.log(`Could not find user for id: ${req.user._id}`);
      req.flash('error_message', getErrorMessage(ERROR_CODES.ACCOUNTS_ADD_ERROR_2));
      res.redirect('/signup');
      next();
      return;
    }
    const edit = hasId(user._accounts, account._id);
    const callback = (err) => {
      if (err) throw err;
      // We should only allow upsert (create object if it doesn't exist) if we are not editing.
      const options = { upsert: !edit };
      const update_request = getUpdateRequest(account);
      AccountModel.findByIdAndUpdate(account._id, update_request, options, (account_err) => {
        if (account_err) throw account_err;
        const action = edit ? 'edited' : 'added';
        console.log(`Successfully ${action} account.`);
        req.flash('info_message', `Account ${action}.`);
        res.redirect('/account');
        next();
        return;
      });
    };
    if (edit) {
      callback();
    } else {
      user.update({ $push: { _accounts: account._id } }, callback);
    }
  });
};

// Recursively removes the captains referred to by id by the given captains array.
// Calls cb when finished.
function removeCaptains(captains, cb) {
  if (captains.length === 0) {
    cb();
    return;
  }
  const captain_id = captains.pop();
  CaptainModel.findByIdAndRemove(captain_id, (err) => {
    if (err) throw err;
    removeCaptains(captains, cb);
  });
}

// Deletes an account.
exports.delete = function delete_account(req, res, next) {
  if (redirectIfLoggedOut(req, res, next)) return;
  const account_id = req.params.id;
  UserModel.findByIdAndUpdate(req.user._id, { $pull: { _accounts: account_id } }, (user_err, user) => {
    // In case of any error return
    if (user_err) {
      console.log(`Error deleting account: ${user_err}`);
      req.flash('error_message', getErrorMessage(ERROR_CODES.ACCOUNTS_DELETE_ERROR_1));
      res.redirect('/signup');
      next();
      return;
    }
    if (!user) {
      req.flash('error_message', getErrorMessage(ERROR_CODES.ACCOUNTS_DELETE_ERROR_2));
      res.redirect('/signup');
      next();
      return;
    }
    AccountModel.findByIdAndRemove(account_id, (account_err, account) => {
      if (account_err) throw account_err;
      removeCaptains(account._captains, () => {
        console.log('Successfully deleted account.');
        req.flash('info_message', 'Account deleted.');
        res.redirect('/account');
        next();
        return;
      });
    });
  });
};
