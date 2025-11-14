const mongoose = require("mongoose");

const VersionSchema = new mongoose.Schema({
    version:String,
},
{timestamps:true}
);

module.exports = mongoose.model("Version", VersionSchema);
