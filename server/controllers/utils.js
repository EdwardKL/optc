import CaptainModel from '../models/captain';

// Redirects to /signup if the user is not logged in.
// Returns true if redirected.
export function redirectIfLoggedOut(req, res, next) {
  if (req.user) return false;
  req.flash('error_message', 'Please sign in.');
  res.redirect('/signup');
  next();
  return true;
}

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
