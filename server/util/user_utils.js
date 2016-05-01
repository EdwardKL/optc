
// Returns true if the user is logged in without a username.
// This will also redirect the user to /auth/oauth-signup to make them set a username.
export function redirectIfNoUsername(req, res) {
  if (!req.user) return false;
  /*if (req.user && (!req.user.username || req.user.username.length === 0)) {
    req.flash('info_message', 'You need a username to proceed.');
    return res.redirect('/auth/oauth-signup');
  }
  req.flash('info_message', 'You need a username to proceed.');
  return res.redirect('/auth/oauth-signup');*/
}
