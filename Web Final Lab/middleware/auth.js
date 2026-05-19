module.exports.isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    req.flash('error', 'Access Denied: You do not have permission to view this page.');
    return res.redirect('/');
  }
  next();
};
