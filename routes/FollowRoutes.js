const mongoose = require("mongoose");
const User = mongoose.model("User");
const { requireLogin } = require("../middleware");
const {
  GET_follow_followeeId,
  GET_unfollow_followeeId
} = require("../controllers/FollowController");

module.exports = app => {
  app.get("/follow/:followeeId", requireLogin, GET_follow_followeeId);
  app.get("/unfollow/:followeeId", requireLogin, GET_unfollow_followeeId);
};
