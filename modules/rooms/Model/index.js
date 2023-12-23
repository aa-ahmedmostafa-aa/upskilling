const mongoose = require("mongoose");
const roomSchema = require("../Schema");

const Room = mongoose.model("room", roomSchema);

module.exports = Room;
