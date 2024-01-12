const mongoose = require("mongoose");

const roomReviewSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "room" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    rating: { type: Number, required: true },
    review: { type: String, required: true },
  },
  {
    collection: "roomReviews",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = roomReviewSchema;
