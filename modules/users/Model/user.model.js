const mongoose = require("mongoose");
const userSchema = require("../Schema/user.schema");

const User = mongoose.model("user", userSchema);

module.exports = User;
