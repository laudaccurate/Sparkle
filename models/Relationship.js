const mongoose = require("mongoose");
const { Schema } = mongoose;

const RelationshipSchema = new Schema({
  _followee: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  _follower: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = RelationshipSchema;
