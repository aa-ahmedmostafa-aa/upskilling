const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String },
    price: { type: Number },
    capacity: { type: Number },
    discount: { type: Number },
    facilities: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    images: [{ type: String }],
  },
  {
    collection: "rooms",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = roomSchema;
