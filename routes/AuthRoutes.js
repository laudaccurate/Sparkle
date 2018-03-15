const {
  GET_register,
  POST_register,
  GET_logout,
  GET_login,
  POST_login
} = require("../controllers/AuthController");
const { requireLogin, loggedOut } = require("../middleware");

module.exports = app => {
  app.get("/register", loggedOut, GET_register);
  app.post("/register", loggedOut, POST_register);
  app.get("/login", loggedOut, GET_login);
  app.post("/login", loggedOut, POST_login);
  app.get("/logout", requireLogin, GET_logout);
};
