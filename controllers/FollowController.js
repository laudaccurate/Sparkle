const mongoose = require("mongoose");
const User = mongoose.model("User");
const Relationship = mongoose.model("Relationship");
const Util = require("../Util");

module.exports.GET_follow_followeeId = async (req, res, next) => {
  try {
    const existingRelation = await Relationship.findOne({
      _follower: req.session.userId,
      _followee: req.params.followeeId
    });

    if (existingRelation)
      return Util.error("This user is already being followed by you", next);

    const relation = await Relationship.create({
      _follower: req.session.userId,
      _followee: req.params.followeeId
    });

    return res.json(relation);
  } catch (error) {
    return next(error);
  }
};

module.exports.GET_unfollow_followeeId = async (req, res, next) => {
  try {
    const existingRelation = await Relationship.find({
      _follower: req.session.userId,
      _followee: req.params.followeeId
    });

    if (!existingRelation)
      return Util.error("This user is not being followed by you", next);

    const relations = await Relationship.findByIdAndRemove(
      req.params.followeeId
    );

    return res.json(relations);
  } catch (error) {
    return next(error);
  }
};
