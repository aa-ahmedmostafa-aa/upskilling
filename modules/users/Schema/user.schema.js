const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { userTypes } = require("../helpers/constants");
const userSchema = new mongoose.Schema(
  {
    userName: { type: String },
    email: { type: String, required: true },
    password: { type: String },
    phoneNumber: { type: Number },
    country: { type: String },
    role: {
      type: String,
      enum: [userTypes.ADMIN, userTypes.USER],
      default: userTypes.USER,
    },
    verificationCode: { type: String },
    verified: { type: Boolean, default: false },
  },
  {
    collection: "users",
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

module.exports = userSchema;
