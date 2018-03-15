const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  _postId: {
    type: Schema.Types.ObjectId,
    ref: "Post"
  },
  _author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = CommentSchema;
