const mongoose = require("mongoose");

const roomFacilitiesSchema = new mongoose.Schema(
  {
    name: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  {
    collection: "roomFacilities",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = roomFacilitiesSchema;
