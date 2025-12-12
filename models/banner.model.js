const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
    Banner_Name:String,
    Banner_Url:String,
},
{timestamps:true}
);

module.exports = mongoose.model("Banner", BannerSchema);