const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String },
    content: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
    postImage: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = postSchema;
