const mongoose = require("mongoose");
const resetRequest = require("../Schema/resetRequest.schema");

const ResetRequest = mongoose.model("reset-requests", resetRequest);

module.exports = ResetRequest;
