const mongoose = require("mongoose");
const roomCommentSchema = require("../Schema");

const RoomComment = mongoose.model("roomComments", roomCommentSchema);

module.exports = RoomComment;
