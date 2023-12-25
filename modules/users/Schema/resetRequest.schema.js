const mongoose = require("mongoose");
const resetRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    seed: { type: String },
  },
  {
    collection: "reset-requests",
    timestamps: true,
    versionKey: false,
  }
);



module.exports = resetRequestSchema;
