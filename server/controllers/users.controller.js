import AccountModel from '../models/account';
import UserModel from '../models/user';
import { redirectIfLoggedOut, removeCaptains } from './utils';
import { getErrorMessage } from '../../errors/error_handler';
import ERROR_CODES from '../../constants/error_codes';

exports.setUser = function setUser(req, res, next) {
  if (redirectIfLoggedOut(req, res, next)) return;
  const display_name = req.body.username;
  if (!display_name || display_name.length <= 1) {
    req.flash('error_message', 'Usernames must be at least 2 characters long.');
    res.redirect('back');
    next();
    return;
  }
  if (!UserModel.validUsername(display_name)) {
    req.flash('error_message', 'Username contained invalid characters. Only alphanumeric, dash, and underscore characters are allowed.');
    res.redirect('back');
    next();
    return;
  }
  UserModel.findByUsername(display_name, (err, user) => {
    if (err) throw err;
    if (user) {
      req.flash('error_message', 'Username already exists.');
      res.redirect('back');
      next();
      return;
    }
    const username = UserModel.convertToUsername(display_name);
    req.user.update({ username, display_name }, (err2) => {
      if (err2) throw err2;
      req.flash('info_message', 'Username set.');
      res.redirect('/');
      next();
      return;
    });
  });
};

// Edit password.
exports.editPass = function editPass(req, res, next) {
  if (redirectIfLoggedOut(req, res, next)) return;
  // First make sure that the current pass is correct.
  if (!req.user.authenticate(req.body.current_password)) {
    req.flash('error_message', 'Wrong password.');
    res.redirect('/account');
    next();
    return;
  }
  if (req.body.password.length <= 3) {
    req.flash('error_message', 'Password must be at least 4 characters long.');
    res.redirect('/account');
    next();
    return;
  }
  if (req.body.password !== req.body.password_confirmation) {
    req.flash('error_message', "New password doesn't match with confirmation.");
    res.redirect('/account');
    next();
    return;
  }
  UserModel.findById(req.user._id, (err, user) => {
    if (err) throw err;
    if (!user) throw err;
    user.password = req.body.password;
    user.updateCredentials();
    user.save((e2) => {
      if (e2) throw e2;
      req.flash('info_message', 'Password updated.');
      res.redirect('/account');
      next();
      return;
    });
  });
};

// Recursively removes the accounts referred to by id by the given accounts array.
// Calls cb when finished.
function removeAccounts(accounts, cb) {
  if (accounts.length === 0) {
    cb();
    return;
  }
  const account_id = accounts.pop();
  AccountModel.findByIdAndRemove(account_id, (err, account) => {
    if (err) throw err;
    removeCaptains(account._captains, () => {
      removeAccounts(accounts, cb);
    });
  });
}

// Deletes a user.
exports.delete = function delete_user(req, res, next) {
  if (redirectIfLoggedOut(req, res, next)) return;
  // First delete any captains the user has.
  UserModel.findByIdAndRemove(req.user._id, (err, user) => {
    // In case of any error return
    if (err) {
      console.log(`Error deleting user: ${err}`);
      req.flash('error_message', getErrorMessage(ERROR_CODES.USERS_DELETE_ERROR_1));
      res.redirect('/signup');
      next();
      return;
    }
    if (!user) {
      console.log('Could not find user to delete! ID: ', req.user._id);
      req.flash('error_message', getErrorMessage(ERROR_CODES.USERS_DELETE_ERROR_2));
      res.redirect('/account');
      next();
      return;
    }
    removeAccounts(user._accounts, () => {
      console.log('Deleted user.');
      req.flash('info_message', "I can't believe you've done this.");
      res.redirect('/');
      next();
      return;
    });
  });
};
