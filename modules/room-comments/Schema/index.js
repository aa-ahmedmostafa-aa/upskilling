const mongoose = require("mongoose");

const roomCommentSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "room" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    comment: { type: String, required: true },
  },
  {
    collection: "roomComments",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = roomCommentSchema;
