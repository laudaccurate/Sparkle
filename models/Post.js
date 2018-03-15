const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    body: {
      type: String,
      required: true
    },
    _author: {
      type: Schema.Types.ObjectId,
      // required: true,
      ref: "User"
    },
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    imageUrl: String
  },
  { timestamps: true }
);

module.exports = PostSchema;
