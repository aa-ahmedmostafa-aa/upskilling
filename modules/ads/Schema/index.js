const mongoose = require("mongoose");

const adsSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, default: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "room" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  {
    collection: "ads",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = adsSchema;
