const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema(
  {
    mobile_number: { type: String },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Otp", otpSchema);
