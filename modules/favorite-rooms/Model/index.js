const mongoose = require("mongoose");
const favoriteRoomsSchema = require("../Schema");

const FavoriteRooms = mongoose.model("favoriteRooms", favoriteRoomsSchema);

module.exports = FavoriteRooms;
