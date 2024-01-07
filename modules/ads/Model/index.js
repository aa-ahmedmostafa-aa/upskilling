const mongoose = require("mongoose");
const adsSchema = require("../Schema");

const Ads = mongoose.model("ads", adsSchema);

module.exports = Ads;
