const mongoose = require("mongoose");
const roomFacilitiesSchema = require("../Schema");

const RoomFacilities = mongoose.model("roomFacilities", roomFacilitiesSchema);

module.exports = RoomFacilities;
