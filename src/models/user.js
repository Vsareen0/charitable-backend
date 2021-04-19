const mongoose = require("mongoose");
const dayjs = require("dayjs")();

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

const User = mongoose.model("User", UserSchema, "user");

// User.prototype.authenticate = ({ username, password }) => {
//   const res = this.findOne({
//     username,
//   });

//   if (username != null) {
//   }
// };

module.exports = User;
