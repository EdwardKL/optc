import randtoken from 'rand-token';
import AccountModel from '../models/account';
import UserModel from '../models/user';
import PasswordResetTokenModel from '../models/password_reset_token';
import { redirectIfLoggedOut, removeCaptains } from './utils';
import { getErrorMessage } from '../../errors/error_handler';
import ERROR_CODES from '../../constants/error_codes';
import { mail } from './mailer';

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

// Shared with editPass and resetPass.
function setPass(user_id, req, res, next) {
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
  UserModel.findById(user_id, (err, user) => {
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
}

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
  setPass(req.user._id, req, res, next);
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

exports.forgotPass = function forgot_pass(req, res, next) {
  const username = UserModel.convertToUsername(req.body.username);
  UserModel.findByUsername(username, (err, user) => {
    if (err) {
      console.log('User lookup error in forgot password route: ', err);
      req.flash('error_message', getErrorMessage(ERROR_CODES.USERS_FORGOT_PASS_ERROR_1));
      res.redirect('back');
      next();
      return;
    }
    if (!user) {
      req.flash('error_message', `User: ${username} not found.`);
      res.redirect('back');
      next();
      return;
    }
    if (!user.email) {
      req.flash('error_message', 'User has no associated email.');
      res.redirect('back');
      next();
      return;
    }
    // We have an email. Generate a token.
    const token = randtoken.generate(8);
    const reset_token = PasswordResetTokenModel({
      _user_id: user._id,
      token,
    });
    reset_token.save((err2) => {
      if (err2) {
        console.log('Reset token update error in forgot password route: ', err2);
        req.flash('error_message', getErrorMessage(ERROR_CODES.USERS_FORGOT_PASS_ERROR_2));
        res.redirect('back');
        next();
        return;
      }
      // Send an email.
      const mailOptions = {
        from: `"OPTC Ohara (noreply)" <${process.env.MAIL_USER}>`,
        to: user.email,
        subject: 'Resetting your Ohara password',
        text: `Hi ${user.display_name}!\n` +
              `Please visit optc.herokuapp.com/reset_password and use your token '${token
              }' to reset your password within the next 30 minutes. ` +
              'If you didn\'t ask for one, please ignore this email.',
      };
      if (!mail(mailOptions)) {
        req.flash('error_message', 'There was an error sending your password reset email.');
        res.redirect('back');
        next();
        return;
      }
      req.flash('info_message', 'Reset password token sent to associated email. You have 30 minutes to use this token.');
      res.redirect('/');
      next();
      return;
    });
  });
};

exports.resetPass = function reset_password(req, res, next) {
  UserModel.findByUsername(UserModel.convertToUsername(req.body.username), (err, user) => {
    if (err) {
      console.log('Reset password error in finding user: ', err);
      req.flash('error_message', getErrorMessage(ERROR_CODES.USERS_RESET_PASS_ERROR_1));
      res.redirect('back');
      next();
      return;
    }
    if (!user) {
      console.log('Found an invalid user: ', req.body.username);
      req.flash('error_message', 'The user this token was registered to no longer exists.');
      res.redirect('back');
      next();
      return;
    }
    PasswordResetTokenModel.findOne({ _user_id: user._id }, (err2, token) => {
      if (err2) {
        console.log('Reset password error in finding token: ', err2);
        req.flash('error_message', getErrorMessage(ERROR_CODES.USERS_RESET_PASS_ERROR_2));
        res.redirect('back');
        next();
        return;
      }
      if (!token) {
        req.flash('error_message', 'No reset password token found. It may have expired.');
        res.redirect('back');
        next();
        return;
      }
      if (token.token !== req.body.token) {
        req.flash('error_message', 'Incorrect password token.');
        res.redirect('back');
        next();
        return;
      }
      setPass(user._id, req, res, next);
      return;
    });
  });
};

exports.setEmail = function set_email(req, res, next) {
  if (redirectIfLoggedOut(req, res, next)) return;
  UserModel.findByIdAndUpdate(req.user._id, { email: req.body.email }, (err, user) => {
    if (err) {
      console.log('Error setting email: ', err, err.stack);
      req.flash('error_message', getErrorMessage(ERROR_CODES.USERS_SET_EMAIL_ERROR_1));
      res.redirect('back');
      next();
      return;
    }
    req.flash('info_message', 'Successfully set email.');
    res.redirect('/account');
    next();
    return;
  });
};

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
