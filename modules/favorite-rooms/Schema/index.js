const mongoose = require("mongoose");

const favoriteRoomsSchema = new mongoose.Schema(
  {
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "room" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  {
    collection: "favoriteRooms",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = favoriteRoomsSchema;
