const mongoose = require("mongoose");
const dayjs = require("dayjs")();

const EventSchema = new mongoose.Schema(
  {
    cause_name: String,
    cause_type: String,
    description: String,
    creator: {
      name: String,
      phone: String,
      email: String,
    },
    image: String,
    sponsored_by: [String],
    target_price: Number,
    location: {
      city: String,
      state: String,
      country: String,
      postal_code: String,
    },
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

const Event = mongoose.model("Event", EventSchema, "events");

module.exports = Event;
