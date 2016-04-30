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
