const mongoose = require("mongoose");
const dayjs = require("dayjs")();
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const UserSchema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    password: String,
    mobile: String,
    email: { type: String, unique: true },
    dob: Date,
    username: { type: String, unique: true },
    linux_added_on: { type: Number, default: dayjs.unix() },
    linux_modified_on: {
      type: Number,
      default: dayjs.unix(),
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.authenticate = function (res, username, password) {
  if (res.username == username && res.password == password) {
    delete res.password;
    const token = jwt.sign(res, "charitable");
    return token;
  } else {
    return null;
  }
};

const User = mongoose.model("User", UserSchema, "user");

module.exports = User;
