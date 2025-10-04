const mongoose = require("mongoose");

const DealerSchema = new mongoose.Schema(
  {
    company_name: { type: String, required: true, },
    name: { type: String },
    email: { type: String },
    mobile_number: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    distributorId: { type: mongoose.Schema.Types.ObjectId, ref: "Distributor" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dealer", DealerSchema);