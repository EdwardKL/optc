import CaptainModel from '../models/captain';

// Redirects to /signup if the user is not logged in.
// Returns true if redirected.
exports.redirectIfLoggedOut = function redirectIfLoggedOut(req, res, next) {
  // Don't call next, because we shouldn't redirect.
  if (req.user) return false;
  req.flash('error_message', 'Please sign in.');
  res.redirect('/signup');
  next();
  return true;
};

// Converts to a number. If input is undefined, this will return 0.
exports.getNumber = function getNumber(num) {
  return num ? Number(num) : 0;
};

exports.areIdsEqual = function areIdsEqual(id1, id2) {
  return id1.toString().valueOf() === id2.toString().valueOf();
};

exports.convertLocationString = function convertLocationString(location_string) {
  if (location_string.indexOf('/') > 0) {
    // the location string needs to be converted to be storable in the DB, replace with '!'
    return location_string.split('/').join('!');
  } else {
    return location_string.split('!').join('/');
  }
};

// Array should be an array of object ids, and id should be either an object id
// or its string representation.
// Returns true if array has id.
exports.hasId = function hasId(array, id) {
  for (const item of array) {
    if (exports.areIdsEqual(item, id)) {
      return true;
    }
  }
  return false;
};

// Recursively removes the captains referred to by id by the given captains array.
// Calls cb when finished.
exports.removeCaptains = function removeCaptains(captains, cb) {
  if (captains.length === 0) {
    cb();
    return;
  }
  const captain_id = captains.pop();
  CaptainModel.findByIdAndRemove(captain_id, (err) => {
    if (err) throw err;
    removeCaptains(captains, cb);
  });
};
