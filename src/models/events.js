const mongoose = require("mongoose");
const dayjs = require("dayjs")();

const EventSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    created_by: String,
    sponsored_by: String,
    location: {
      city: String,
      state: String,
      country: String,
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
