module.exports.requireLogin = (req, res, next) => {
  if (!req.session.userId) return res.redirect("/login");
  return next();
};

module.exports.loggedOut = (req, res, next) => {
  if (req.session.userId) return res.redirect("/");
  return next();
};
