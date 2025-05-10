function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }

  // لو من صفحة ويب
  if (req.accepts('html')) {
    return res.redirect('/auth/login');
  }

  // لو من API
  return res.status(401).json({ message: 'Unauthorized' });
}

module.exports = isAuthenticated;
