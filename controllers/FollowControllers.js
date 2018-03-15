const mongoose = require("mongoose");
const Relationship = mongoose.model("Relationship");
const Util = require("../Util");

module.exports.POST_follow_followeeId = async (req, res) => {
  const relationship = await Relationship.create({
    _followee: req.params.followeeId,
    _follower: req.session.userId
  });
};
