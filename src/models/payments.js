const mongoose = require("mongoose");
const dayjs = require("dayjs")();
// require("./events");
// require("./user");

const PaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    payment_id: { type: String, required: true },
    payment_mode: { type: String, required: true },
    payment_method: { type: String, required: true },
    description: String,
    currency: { type: String, required: true },
    // customer: { type: String, required: true },
    status: { type: String, required: true },
    receipt_url: { type: String, required: true },
    transaction_id: { type: String, required: true },
    more_details: Object,
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

const Payment = mongoose.model("Payment", PaymentSchema, "payments");

module.exports = Payment;
