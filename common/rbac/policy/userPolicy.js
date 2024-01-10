const {
  endpoints: UserEndPoints,
} = require("../../../modules/users/helpers/constants");

const {
  endpoints: BookingEndPoints,
} = require("../../../modules/booking/helpers/constants");

const {
  endpoints: RoomsEndPoints,
} = require("../../../modules/rooms/helpers/constants");

const {
  endpoints: AdsEndPoints,
} = require("../../../modules/ads/helpers/constants");

const {
  endpoints: FavoriteRoomsEndPoints,
} = require("../../../modules/favorite-rooms/helpers/constants");

module.exports = [
  UserEndPoints.USER_CHANGE_PASSWORD,
  UserEndPoints.USER_GET_USER,
  BookingEndPoints.BOOKING_MY_BOOKING,
  BookingEndPoints.BOOKING_DELETE_BOOKING,
  BookingEndPoints.BOOKING_CREATE_BOOKING,
  RoomsEndPoints.ROOM_GET_ALL_AVAILABLE_ROOMS,
  AdsEndPoints.ADS_GET_ALL,
  AdsEndPoints.ADS_GET_details,
  FavoriteRoomsEndPoints.FAVORITE_ROOMS_CREATE,
  FavoriteRoomsEndPoints.FAVORITE_ROOMS_GET_ALL,
  FavoriteRoomsEndPoints.FAVORITE_ROOMS_UPDATE,
];
