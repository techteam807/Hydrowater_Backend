const mongoose = require("mongoose");

const DistributorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, },
    email: { type: String },
    mobile_number: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Distributor", DistributorSchema);