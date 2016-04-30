import AccountModel from '../models/account';
import UserModel from '../models/user';
import { redirectIfLoggedOut, hasId } from './utils';
import { getErrorMessage } from '../../errors/error_handler';
import ERROR_CODES from '../../constants/error_codes';

function validateAccount(account, req, res) {
  if (account.friend_id < 100000000 || account.friend_id > 999999999) {
    req.flash('error_message', 'Invalid friend ID.');
    res.redirect('/account');
    return;
  }
  if (account.region !== 'japan' && account.region !== 'global') {
    req.flash('error_message', 'Invalid region.');
    res.redirect('/account');
    return;
  }
}

exports.redirect = function redirect(req, res) {
  if (redirectIfLoggedOut(req, res, () => {})) return;
  res.redirect(`/account/${req.user.username}`);
  return;
};

exports.get = function get(req, res) {
  const username = UserModel.convertToUsername(req.params.username);
  UserModel
    .findOne({ username })
    .populate({ path: '_accounts',
                populate: {
                  path: '_captains',
                  model: 'Captain' } })
    .exec((err, user) => {
      if (err) throw err;
      return res.json(user);
    });
};

// Adds (or edits) an account.
exports.add = function add(req, res) {
  if (redirectIfLoggedOut(req, res, () => {})) return;
  const account = new AccountModel(req.body);
  if (req.body.account_id) account._id = req.body.account_id;
  validateAccount(account);
  UserModel.findById(req.user._id, (user_err, user) => {
    // In case of any error return
    if (user_err) {
      console.log('Error adding account: ' + user_err);
      req.flash('error_message', getErrorMessage(ERROR_CODES.ACCOUNTS_ADD_ERROR_1));
      res.redirect('/account');
      return;
    }
    if (!user) {
      req.flash('error_message', getErrorMessage(ERROR_CODES.ACCOUNTS_ADD_ERROR_2));
      res.redirect('/signup');
      return;
    }
    const edit = hasId(user.accounts, account._id);
    const callback = (err) => {
      if (err) throw err;
      // We should only allow upsert (create object if it doesn't exist) if we are not editing.
      const options = { upsert: !edit };
      AccountModel.findByIdAndUpdate(account._id, account, options, (account_err) => {
        if (account_err) throw account_err;
        const action = edit ? 'edited' : 'added';
        console.log('Successfully ' + action + ' account.');
        req.flash('info_message', `Account ${action}.`);
        res.redirect('/account');
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

// Deletes an account.
exports.delete = function delete_account(req, res) {
  if (redirectIfLoggedOut(req, res, () => {})) return;
  const account_id = req.params.id;
  UserModel.findById(req.user._id, (user_err, user) => {
    // In case of any error return
    if (user_err) {
      console.log('Error deleting account: ' + user_err);
      req.flash('error_message', getErrorMessage(ERROR_CODES.ACCOUNTS_DELETE_ERROR_1));
      res.redirect('/signup');
      return;
    }
    if (!user) {
      req.flash('error_message', getErrorMessage(ERROR_CODES.ACCOUNTS_DELETE_ERROR_2));
      res.redirect('/signup');
      return;
    }
    user.update({ $pull: { _accounts: account_id } }, (pull_err) => {
      if (pull_err) throw pull_err;
      AccountModel.findByIdAndRemove(account_id, (account_err) => {
        if (account_err) throw account_err;
        console.log('Successfully deleted account.');
        req.flash('info_message', 'Account deleted.');
        res.redirect('/account');
        return;
      });
    });
  });
};
