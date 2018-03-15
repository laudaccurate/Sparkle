const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userNumber: {
    type: String,
    unique: true,
    required: true,
    trim: true
  }
});

UserSchema.methods.authenticate = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = UserSchema;
