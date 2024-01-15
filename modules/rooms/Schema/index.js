const mongoose = require("mongoose");
// const Booking = require("../../booking/Model");
// const Ads = require("../../ads/Model");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String },
    price: { type: Number },
    capacity: { type: Number },
    discount: { type: Number },
    facilities: [
      { type: mongoose.Schema.Types.ObjectId, ref: "roomFacilities" },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    images: [{ type: String }],
  },
  {
    collection: "rooms",
    timestamps: true,
    versionKey: false,
  }
);

// roomSchema.pre("remove", async function (next) {
//   // 'this' is the room that's about to be removed
//   // Remove all ads and bookings that reference this room
//   await Ads.deleteMany({ roomId: this._id });
//   await Booking.deleteMany({ roomId: this._id });
//   next();
// });

module.exports = roomSchema;
