const mongoose = require("mongoose");
const roomReviewSchema = require("../Schema");

const RoomReview = mongoose.model("roomReviews", roomReviewSchema);

module.exports = RoomReview;
