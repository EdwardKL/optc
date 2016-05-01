import CaptainModel from '../models/captain';

// Redirects to /signup if the user is not logged in.
// Returns true if redirected.
export function redirectIfLoggedOut(req, res, next) {
  // Don't call next, because we shouldn't redirect.
  if (req.user) return false;
  req.flash('error_message', 'Please sign in.');
  res.redirect('/signup');
  next();
  return true;
}

// Converts to a number. If input is undefined, this will return 0.
export function getNumber(num) {
  return num ? Number(num) : 0;
}

// Array should be an array of object ids, and id should be either an object id
// or its string representation.
// Returns true if array has id.
export function hasId(array, id) {
  for (const item of array) {
    if (item.toString().valueOf() === id.toString().valueOf()) {
      return true;
    }
  }
  return false;
}

// Recursively removes the captains referred to by id by the given captains array.
// Calls cb when finished.
export function removeCaptains(captains, cb) {
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
