const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const Util = require("../Util");

module.exports.GET_register = (req, res, next) => {
  return res.render("auth/register", { title: 'Register' });
};

module.exports.POST_register = async (req, res, next) => {
  try {
    const { username, password, confirmPassword, userNumber } = req.body;

    if (
      !username.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !userNumber.trim()
    ) {
      return Util.error("All fields required", next);
    }

    if (password !== confirmPassword) {
      return Util.error("Passwords do not match", next);
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) return Util.error("username already taken", next);

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ ...req.body, password: hash });
    req.session.userId = user._id;

    return res.redirect("/");
  } catch (error) {
    return next(error);
  }
};

module.exports.GET_login = (req, res, next) => {
  return res.render("auth/login", { title: 'Login' });
};

module.exports.POST_login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username.trim() || !password.trim()) {
      return Util.error("All fields required", next);
    }

    const user = await User.findOne({ username });
    if (!user) return Util.error("invalid username", next);

    const matching = await user.authenticate(password);
    if (!matching) return Util.error("incorrect password", next);

    req.session.userId = user._id;
    return res.redirect("/");
  } catch (error) {
    return next(error);
  }
};

module.exports.GET_logout = async (req, res, next) => {
  await req.session.destroy();

  return res.redirect("/login");
};
