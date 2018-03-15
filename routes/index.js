const { requireLogin } = require("../middleware");

module.exports = app => {
  app.get("/", requireLogin, (req, res) => res.render("index", { title: 'Home' }));
  require("./AuthRoutes")(app);
  require("./PostRoutes")(app);
  require("./FollowRoutes")(app);
};
